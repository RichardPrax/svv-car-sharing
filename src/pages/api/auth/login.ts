// src/pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from "next";
import { withRateLimit, authRateLimiter } from "@/lib/middleware/rateLimiter";
import { withAuthSecurity, SecurityValidator } from "@/lib/middleware/security";

async function loginHandler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    try {
        const { email, password } = req.body;

        // Validiere Input
        if (!email || !password || typeof email !== "string" || typeof password !== "string") {
            console.warn(`Invalid login attempt from ${SecurityValidator.getClientIP(req)}: missing credentials`);
            SecurityValidator.recordFailedAttempt(req);
            res.status(400).json({ error: "Email and password are required" });
            return;
        }

        // Email Format Validierung
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.warn(`Invalid login attempt from ${SecurityValidator.getClientIP(req)}: invalid email format`);
            SecurityValidator.recordFailedAttempt(req);
            res.status(400).json({ error: "Invalid email format" });
            return;
        }

        // Password Mindestanforderungen
        if (password.length < 6) {
            console.warn(`Invalid login attempt from ${SecurityValidator.getClientIP(req)}: password too short`);
            SecurityValidator.recordFailedAttempt(req);
            res.status(400).json({ error: "Password must be at least 6 characters" });
            return;
        }

        // Hier würde normalerweise die tatsächliche Authentifizierung stattfinden
        // Da Supabase die Auth handhabt, ist dieser Endpunkt hauptsächlich für Monitoring

        console.info(`Login attempt for ${email} from ${SecurityValidator.getClientIP(req)}`);
        SecurityValidator.recordSuccessfulAttempt(req);

        res.status(200).json({
            message: "Login request processed",
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Error in login handler:", error);
        SecurityValidator.recordFailedAttempt(req);
        res.status(500).json({ error: "Internal server error" });
    }
}

// Restore security middleware with improved validation
export default withRateLimit(authRateLimiter)(withAuthSecurity()(loginHandler));

