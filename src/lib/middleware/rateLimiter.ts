// src/lib/middleware/rateLimiter.ts
import { NextApiRequest, NextApiResponse } from "next";
import { logRateLimitExceeded } from "@/lib/monitoring/securityMonitor";

interface RateLimitEntry {
    count: number;
    resetTime: number;
    blocked: boolean;
    blockUntil?: number;
}

class RateLimiter {
    private store = new Map<string, RateLimitEntry>();
    private readonly windowMs: number;
    private readonly maxRequests: number;
    private readonly blockDurationMs: number;

    constructor(windowMs = 60000, maxRequests = 5, blockDurationMs = 300000) {
        this.windowMs = windowMs; // 1 Minute
        this.maxRequests = maxRequests; // Max 5 Requests pro Minute
        this.blockDurationMs = blockDurationMs; // 5 Minuten Block
    }

    private getClientIP(req: NextApiRequest): string {
        const forwarded = req.headers["x-forwarded-for"];
        return forwarded ? String(forwarded).split(",")[0] : req.connection.remoteAddress || "unknown";
    }

    private getClientId(req: NextApiRequest): string {
        // Verwende IP-Adresse und User-Agent für eindeutige Identifikation
        const ip = this.getClientIP(req);
        const userAgent = req.headers["user-agent"] || "unknown";
        return `${ip}-${userAgent.substring(0, 50)}`;
    }

    private cleanupExpiredEntries(): void {
        const now = Date.now();
        for (const [key, entry] of this.store.entries()) {
            if (entry.resetTime < now && (!entry.blocked || (entry.blockUntil && entry.blockUntil < now))) {
                this.store.delete(key);
            }
        }
    }

    public checkLimit(req: NextApiRequest): { allowed: boolean; resetTime?: number; blockUntil?: number } {
        this.cleanupExpiredEntries();

        const clientId = this.getClientId(req);
        const now = Date.now();
        const entry = this.store.get(clientId);

        if (!entry) {
            // Erste Request von diesem Client
            this.store.set(clientId, {
                count: 1,
                resetTime: now + this.windowMs,
                blocked: false,
            });
            return { allowed: true };
        }

        // Prüfe ob Client blockiert ist
        if (entry.blocked && entry.blockUntil && entry.blockUntil > now) {
            return { allowed: false, blockUntil: entry.blockUntil };
        }

        // Reset Counter wenn Window abgelaufen ist
        if (entry.resetTime < now) {
            entry.count = 1;
            entry.resetTime = now + this.windowMs;
            entry.blocked = false;
            delete entry.blockUntil;
            return { allowed: true };
        }

        // Erhöhe Counter
        entry.count++;

        // Prüfe ob Limit überschritten
        if (entry.count > this.maxRequests) {
            entry.blocked = true;
            entry.blockUntil = now + this.blockDurationMs;

            // Log Security Event
            logRateLimitExceeded(this.getClientIP(req), req.headers["user-agent"], `Rate limit exceeded: ${entry.count}/${this.maxRequests} requests`);

            console.warn(`Rate limit exceeded for client ${clientId}. Blocked until ${new Date(entry.blockUntil).toISOString()}`);
            return { allowed: false, blockUntil: entry.blockUntil, resetTime: entry.resetTime };
        }

        return { allowed: true, resetTime: entry.resetTime };
    }

    public forceBlock(req: NextApiRequest, durationMs = this.blockDurationMs): void {
        const clientId = this.getClientId(req);
        const now = Date.now();

        this.store.set(clientId, {
            count: this.maxRequests + 1,
            resetTime: now + this.windowMs,
            blocked: true,
            blockUntil: now + durationMs,
        });

        console.warn(`Force blocked client ${clientId} for ${durationMs}ms`);
    }
}

// Verschiedene Rate Limiter für verschiedene Endpunkte
export const authRateLimiter = new RateLimiter(60000, 5, 600000); // 5 Versuche pro Minute, 10 Min Block
export const apiRateLimiter = new RateLimiter(60000, 30, 300000); // 30 Requests pro Minute, 5 Min Block

export function withRateLimit(rateLimiter: RateLimiter) {
    return function (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void) {
        return async function (req: NextApiRequest, res: NextApiResponse) {
            const { allowed, resetTime, blockUntil } = rateLimiter.checkLimit(req);

            if (!allowed) {
                const remainingTime = blockUntil ? Math.ceil((blockUntil - Date.now()) / 1000) : 0;

                res.setHeader("X-RateLimit-Limit", "3");
                res.setHeader("X-RateLimit-Remaining", "0");
                res.setHeader("X-RateLimit-Reset", resetTime || Date.now());
                res.setHeader("Retry-After", remainingTime.toString());

                return res.status(429).json({
                    error: "Rate limit exceeded",
                    message: `Too many requests. Try again in ${remainingTime} seconds.`,
                    retryAfter: remainingTime,
                });
            }

            res.setHeader("X-RateLimit-Limit", "3");
            res.setHeader("X-RateLimit-Remaining", "2");
            res.setHeader("X-RateLimit-Reset", resetTime || Date.now());

            return handler(req, res);
        };
    };
}

