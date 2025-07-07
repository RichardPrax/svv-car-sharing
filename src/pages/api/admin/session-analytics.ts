// src/pages/api/admin/session-analytics.ts
import { NextApiRequest, NextApiResponse } from "next";

// Simple in-memory analytics (in production würde man eine DB nutzen)
const sessionAnalytics = {
    userApiCalls: new Map<string, number>(),
    lastHour: {
        totalUserCalls: 0,
        uniqueUsers: new Set<string>(),
        cacheHits: 0,
        cacheMisses: 0,
    },
    totalApiCalls: 0,
    startTime: Date.now(),
};

// Reset Analytics jede Stunde
setInterval(() => {
    sessionAnalytics.lastHour = {
        totalUserCalls: 0,
        uniqueUsers: new Set<string>(),
        cacheHits: 0,
        cacheMisses: 0,
    };
}, 60 * 60 * 1000);

export function recordUserApiCall(userId: string) {
    sessionAnalytics.totalApiCalls++;
    sessionAnalytics.lastHour.totalUserCalls++;
    sessionAnalytics.lastHour.uniqueUsers.add(userId);

    const current = sessionAnalytics.userApiCalls.get(userId) || 0;
    sessionAnalytics.userApiCalls.set(userId, current + 1);
}

export function recordCacheHit() {
    sessionAnalytics.lastHour.cacheHits++;
}

export function recordCacheMiss() {
    sessionAnalytics.lastHour.cacheMisses++;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const uptime = Date.now() - sessionAnalytics.startTime;
        const totalCacheRequests = sessionAnalytics.lastHour.cacheHits + sessionAnalytics.lastHour.cacheMisses;
        const cacheHitRate = totalCacheRequests > 0 ? ((sessionAnalytics.lastHour.cacheHits / totalCacheRequests) * 100).toFixed(2) : "0.00";

        // Top User-API-Verbraucher
        const topUsers = Array.from(sessionAnalytics.userApiCalls.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([userId, calls]) => ({
                userId: userId.substring(0, 8) + "...",
                calls,
            }));

        const analytics = {
            status: "active",
            uptime: Math.floor(uptime / 1000), // in seconds
            totalApiCalls: sessionAnalytics.totalApiCalls,
            lastHour: {
                userApiCalls: sessionAnalytics.lastHour.totalUserCalls,
                uniqueUsers: sessionAnalytics.lastHour.uniqueUsers.size,
                cacheHits: sessionAnalytics.lastHour.cacheHits,
                cacheMisses: sessionAnalytics.lastHour.cacheMisses,
                cacheHitRate: `${cacheHitRate}%`,
            },
            performance: {
                averageCallsPerUser: sessionAnalytics.userApiCalls.size > 0 ? Math.round(sessionAnalytics.totalApiCalls / sessionAnalytics.userApiCalls.size) : 0,
                topUsers,
            },
            recommendations: generateRecommendations(sessionAnalytics),
        };

        res.status(200).json(analytics);
    } catch (error) {
        console.error("Error in session analytics:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

function generateRecommendations(analytics: typeof sessionAnalytics): string[] {
    const recommendations: string[] = [];

    const totalCacheRequests = analytics.lastHour.cacheHits + analytics.lastHour.cacheMisses;
    const cacheHitRate = totalCacheRequests > 0 ? analytics.lastHour.cacheHits / totalCacheRequests : 0;

    if (cacheHitRate < 0.7) {
        recommendations.push("Cache Hit-Rate unter 70% - Cache-Strategie überprüfen");
    }

    if (analytics.lastHour.totalUserCalls > 100) {
        recommendations.push("Hohe User-API-Aktivität - Rate Limits prüfen");
    }

    const avgCallsPerUser = analytics.userApiCalls.size > 0 ? analytics.totalApiCalls / analytics.userApiCalls.size : 0;

    if (avgCallsPerUser > 50) {
        recommendations.push("Überdurchschnittliche API-Calls pro User - Session-Optimierung empfohlen");
    }

    if (analytics.lastHour.uniqueUsers.size > 20) {
        recommendations.push("Hohe Anzahl aktiver Users - Scaling überwachen");
    }

    if (recommendations.length === 0) {
        recommendations.push("System läuft optimal");
    }

    return recommendations;
}

