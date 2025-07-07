// src/lib/monitoring/securityMonitor.ts
interface SecurityEvent {
    timestamp: string;
    type: "RATE_LIMIT_EXCEEDED" | "SUSPICIOUS_REQUEST" | "BLOCKED_IP" | "AUTH_FAILURE";
    ip: string;
    userAgent?: string;
    details: string;
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

class SecurityMonitor {
    private events: SecurityEvent[] = [];
    private maxEvents = 1000; // Behalte nur die letzten 1000 Events

    public logEvent(event: Omit<SecurityEvent, "timestamp">): void {
        const securityEvent: SecurityEvent = {
            ...event,
            timestamp: new Date().toISOString(),
        };

        this.events.unshift(securityEvent);

        // Beschränke Array-Größe
        if (this.events.length > this.maxEvents) {
            this.events = this.events.slice(0, this.maxEvents);
        }

        // Log basierend auf Severity
        switch (event.severity) {
            case "CRITICAL":
                console.error(`🚨 CRITICAL SECURITY EVENT: ${event.type} from ${event.ip} - ${event.details}`);
                break;
            case "HIGH":
                console.warn(`⚠️ HIGH SECURITY EVENT: ${event.type} from ${event.ip} - ${event.details}`);
                break;
            case "MEDIUM":
                console.warn(`⚡ MEDIUM SECURITY EVENT: ${event.type} from ${event.ip} - ${event.details}`);
                break;
            case "LOW":
                console.info(`ℹ️ LOW SECURITY EVENT: ${event.type} from ${event.ip} - ${event.details}`);
                break;
        }

        // Bei kritischen Events sofortige Maßnahmen
        if (event.severity === "CRITICAL") {
            this.handleCriticalEvent(securityEvent);
        }
    }

    private handleCriticalEvent(event: SecurityEvent): void {
        // Hier könnten zusätzliche Maßnahmen ergriffen werden:
        // - E-Mail an Admin senden
        // - Slack/Discord Notification
        // - Automatische IP-Blockierung auf Firewall-Ebene
        console.error(`🔥 CRITICAL EVENT DETECTED - Immediate action required: ${JSON.stringify(event)}`);
    }

    public getEvents(limit = 100): SecurityEvent[] {
        return this.events.slice(0, limit);
    }

    public getEventsByType(type: SecurityEvent["type"], limit = 50): SecurityEvent[] {
        return this.events.filter((event) => event.type === type).slice(0, limit);
    }

    public getEventsByIP(ip: string, limit = 50): SecurityEvent[] {
        return this.events.filter((event) => event.ip === ip).slice(0, limit);
    }

    public getStats(): {
        total: number;
        byType: Record<SecurityEvent["type"], number>;
        bySeverity: Record<SecurityEvent["severity"], number>;
        lastHour: number;
    } {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

        const byType = this.events.reduce((acc, event) => {
            acc[event.type] = (acc[event.type] || 0) + 1;
            return acc;
        }, {} as Record<SecurityEvent["type"], number>);

        const bySeverity = this.events.reduce((acc, event) => {
            acc[event.severity] = (acc[event.severity] || 0) + 1;
            return acc;
        }, {} as Record<SecurityEvent["severity"], number>);

        const lastHour = this.events.filter((event) => event.timestamp > oneHourAgo).length;

        return {
            total: this.events.length,
            byType,
            bySeverity,
            lastHour,
        };
    }

    public detectPatterns(): {
        suspiciousIPs: string[];
        frequentAttackers: Array<{ ip: string; count: number; types: string[] }>;
        recommendations: string[];
    } {
        const ipCounts = new Map<string, { count: number; types: Set<string> }>();

        // Analysiere die letzten 24 Stunden
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const recentEvents = this.events.filter((event) => event.timestamp > twentyFourHoursAgo);

        recentEvents.forEach((event) => {
            const current = ipCounts.get(event.ip) || { count: 0, types: new Set() };
            current.count++;
            current.types.add(event.type);
            ipCounts.set(event.ip, current);
        });

        const suspiciousIPs = Array.from(ipCounts.entries())
            .filter(([, data]) => data.count > 10) // Mehr als 10 Events in 24h
            .map(([ip]) => ip);

        const frequentAttackers = Array.from(ipCounts.entries())
            .filter(([, data]) => data.count > 5)
            .map(([ip, data]) => ({
                ip,
                count: data.count,
                types: Array.from(data.types),
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        const recommendations: string[] = [];

        if (suspiciousIPs.length > 0) {
            recommendations.push(`${suspiciousIPs.length} IPs mit verdächtiger Aktivität erkannt`);
        }

        const criticalEvents = recentEvents.filter((e) => e.severity === "CRITICAL").length;
        if (criticalEvents > 5) {
            recommendations.push(`${criticalEvents} kritische Events in 24h - sofortige Überprüfung erforderlich`);
        }

        return {
            suspiciousIPs,
            frequentAttackers,
            recommendations,
        };
    }
}

// Singleton Instance
export const securityMonitor = new SecurityMonitor();

// Helper Funktionen für verschiedene Event-Typen
export const logRateLimitExceeded = (ip: string, userAgent?: string, details?: string) => {
    securityMonitor.logEvent({
        type: "RATE_LIMIT_EXCEEDED",
        ip,
        userAgent,
        details: details || "Rate limit exceeded",
        severity: "MEDIUM",
    });
};

export const logSuspiciousRequest = (ip: string, userAgent?: string, details?: string) => {
    securityMonitor.logEvent({
        type: "SUSPICIOUS_REQUEST",
        ip,
        userAgent,
        details: details || "Suspicious request pattern detected",
        severity: "HIGH",
    });
};

export const logBlockedIP = (ip: string, reason: string) => {
    securityMonitor.logEvent({
        type: "BLOCKED_IP",
        ip,
        details: `IP blocked: ${reason}`,
        severity: "HIGH",
    });
};

export const logAuthFailure = (ip: string, userAgent?: string, details?: string) => {
    securityMonitor.logEvent({
        type: "AUTH_FAILURE",
        ip,
        userAgent,
        details: details || "Authentication failure",
        severity: "MEDIUM",
    });
};

