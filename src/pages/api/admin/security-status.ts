// src/pages/api/admin/security-status.ts
import { NextApiRequest, NextApiResponse } from "next";
import { securityMonitor } from "@/lib/monitoring/securityMonitor";
import { withRateLimit, apiRateLimiter } from "@/lib/middleware/rateLimiter";
import { withSecurity } from "@/lib/middleware/security";

async function securityStatusHandler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    try {
        // Basis-Security-Status
        const stats = securityMonitor.getStats();
        const patterns = securityMonitor.detectPatterns();
        const recentEvents = securityMonitor.getEvents(20);

        // System-Status
        const systemStatus = {
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            nodeVersion: process.version,
        };

        // Rate Limiter Status (simuliert - in einer echten App würde das aus der Rate Limiter Instanz kommen)
        const rateLimiterStatus = {
            authRequestsLastHour: stats.byType.AUTH_FAILURE || 0,
            rateLimitViolations: stats.byType.RATE_LIMIT_EXCEEDED || 0,
            blockedIPs: patterns.suspiciousIPs.length,
        };

        const securityStatus = {
            overall: determineOverallStatus(stats, patterns),
            stats,
            patterns,
            recentEvents: recentEvents.slice(0, 10), // Nur die letzten 10 für die API
            system: systemStatus,
            rateLimiter: rateLimiterStatus,
            recommendations: patterns.recommendations,
        };

        res.status(200).json(securityStatus);
    } catch (error) {
        console.error("Error getting security status:", error);
        res.status(500).json({ error: "Failed to get security status" });
    }
}

function determineOverallStatus(
    stats: ReturnType<typeof securityMonitor.getStats>,
    patterns: ReturnType<typeof securityMonitor.detectPatterns>
): "SAFE" | "WARNING" | "DANGER" | "CRITICAL" {
    const criticalEvents = stats.bySeverity.CRITICAL || 0;
    const highEvents = stats.bySeverity.HIGH || 0;
    const recentActivity = stats.lastHour;

    if (criticalEvents > 0 || patterns.suspiciousIPs.length > 10) {
        return "CRITICAL";
    }

    if (highEvents > 5 || recentActivity > 50) {
        return "DANGER";
    }

    if (highEvents > 2 || recentActivity > 20) {
        return "WARNING";
    }

    return "SAFE";
}

// Wende Rate Limiting und Security Middleware an
export default withRateLimit(apiRateLimiter)(withSecurity()(securityStatusHandler));

