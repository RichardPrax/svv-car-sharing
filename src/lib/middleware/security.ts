// src/lib/middleware/security.ts
import { NextApiRequest, NextApiResponse } from "next";
import { logSuspiciousRequest, logBlockedIP, logAuthFailure } from "@/lib/monitoring/securityMonitor";

interface SecurityCheckResult {
    valid: boolean;
    reason?: string;
}

export class SecurityValidator {
    private static suspiciousPatterns = [/bot/i, /crawler/i, /spider/i, /scraper/i, /automated/i, /attack/i, /flood/i];

    private static suspiciousIPs = new Set<string>();
    private static failedAttempts = new Map<string, number>();

    public static validateRequest(req: NextApiRequest): SecurityCheckResult {
        // Prüfe User-Agent
        const userAgent = req.headers["user-agent"] || "";
        if (!userAgent || userAgent.length < 10) {
            return { valid: false, reason: "Invalid or missing User-Agent" };
        }

        // Prüfe auf verdächtige User-Agent Patterns
        for (const pattern of this.suspiciousPatterns) {
            if (pattern.test(userAgent)) {
                return { valid: false, reason: "Suspicious User-Agent detected" };
            }
        }

        // Prüfe Content-Length bei POST Requests
        if (req.method === "POST") {
            const contentLength = parseInt(req.headers["content-length"] || "0");
            if (contentLength > 10000) {
                // 10KB Limit
                return { valid: false, reason: "Request too large" };
            }
        }

        // Prüfe IP-Adresse
        const ip = this.getClientIP(req);
        if (this.suspiciousIPs.has(ip)) {
            return { valid: false, reason: "IP address blocked" };
        }

        return { valid: true };
    }

    public static getClientIP(req: NextApiRequest): string {
        const forwarded = req.headers["x-forwarded-for"];
        return forwarded ? String(forwarded).split(",")[0].trim() : req.connection.remoteAddress || "unknown";
    }

    public static recordFailedAttempt(req: NextApiRequest): void {
        const ip = this.getClientIP(req);
        const currentCount = this.failedAttempts.get(ip) || 0;
        const newCount = currentCount + 1;

        this.failedAttempts.set(ip, newCount);

        // Blockiere IP nach 10 fehlgeschlagenen Versuchen
        if (newCount >= 10) {
            this.suspiciousIPs.add(ip);
            logBlockedIP(ip, `${newCount} failed attempts`);
            console.warn(`IP ${ip} blocked after ${newCount} failed attempts`);

            // Entferne Block nach 1 Stunde
            setTimeout(() => {
                this.suspiciousIPs.delete(ip);
                this.failedAttempts.delete(ip);
                console.info(`IP ${ip} unblocked after timeout`);
            }, 3600000); // 1 Stunde
        } else if (newCount >= 5) {
            // Log verdächtige Aktivität ab 5 Versuchen
            logSuspiciousRequest(ip, undefined, `${newCount} failed attempts`);
        }
    }

    public static recordSuccessfulAttempt(req: NextApiRequest): void {
        const ip = this.getClientIP(req);
        this.failedAttempts.delete(ip);
    }

    public static validateAuthRequest(req: NextApiRequest): SecurityCheckResult {
        // Basis-Validierung
        const baseCheck = this.validateRequest(req);
        if (!baseCheck.valid) {
            return baseCheck;
        }

        // Prüfe auf erforderliche Headers
        const requiredHeaders = ["user-agent", "accept", "accept-language"];
        for (const header of requiredHeaders) {
            if (!req.headers[header]) {
                return { valid: false, reason: `Missing required header: ${header}` };
            }
        }

        // Prüfe Request Body bei POST
        if (req.method === "POST" && (!req.body || typeof req.body !== "object")) {
            return { valid: false, reason: "Invalid request body" };
        }

        return { valid: true };
    }
}

export function withSecurity() {
    return function (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void) {
        return async function (req: NextApiRequest, res: NextApiResponse) {
            const securityCheck = SecurityValidator.validateRequest(req);

            if (!securityCheck.valid) {
                console.warn(`Security check failed for ${SecurityValidator.getClientIP(req)}: ${securityCheck.reason}`);
                SecurityValidator.recordFailedAttempt(req);

                // Log als verdächtige Anfrage
                logSuspiciousRequest(SecurityValidator.getClientIP(req), req.headers["user-agent"] as string, securityCheck.reason);

                return res.status(403).json({
                    error: "Request blocked",
                    message: "Your request was blocked for security reasons",
                });
            }

            return handler(req, res);
        };
    };
}

export function withAuthSecurity() {
    return function (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void) {
        return async function (req: NextApiRequest, res: NextApiResponse) {
            const securityCheck = SecurityValidator.validateAuthRequest(req);

            if (!securityCheck.valid) {
                console.warn(`Auth security check failed for ${SecurityValidator.getClientIP(req)}: ${securityCheck.reason}`);
                SecurityValidator.recordFailedAttempt(req);

                // Log als Auth-Fehler
                logAuthFailure(SecurityValidator.getClientIP(req), req.headers["user-agent"] as string, securityCheck.reason);

                return res.status(403).json({
                    error: "Authentication blocked",
                    message: "Your authentication request was blocked for security reasons",
                });
            }

            return handler(req, res);
        };
    };
}

