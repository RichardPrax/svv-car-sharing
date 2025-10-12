// src/pages/api/auth/reset-password.ts
import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import { withRateLimit, passwordResetRateLimiter } from "@/lib/middleware/rateLimiter";
import { SecurityValidator } from "@/lib/middleware/security";

async function resetPasswordHandler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    try {
        const { email } = req.body;

        // Validate input
        if (!email || typeof email !== "string") {
            console.warn(`Invalid reset password attempt from ${SecurityValidator.getClientIP(req)}: missing email`);
            res.status(400).json({ error: "E-Mail-Adresse ist erforderlich" });
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.warn(`Invalid reset password attempt from ${SecurityValidator.getClientIP(req)}: invalid email format`);
            res.status(400).json({ error: "Ungültiges E-Mail-Format" });
            return;
        }

        // Get the site URL for the redirect URL
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:3000';
        const redirectTo = `${siteUrl}/reset-password-confirm`;

        // Send password reset email via Supabase
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo,
        });

        if (error) {
            console.error("Password reset error:", error);
            // Don't reveal if email exists or not for security
            // Always return success to prevent email enumeration
        }

        console.info(`Password reset requested for ${email} from ${SecurityValidator.getClientIP(req)}`);

        // Always return success to prevent email enumeration attacks
        res.status(200).json({ 
            success: true,
            message: "Wenn ein Konto mit dieser E-Mail-Adresse existiert, wurde eine E-Mail zum Zurücksetzen des Passworts versendet." 
        });
    } catch (error) {
        console.error("Unexpected error in reset password handler:", error);
        res.status(500).json({ error: "Ein interner Fehler ist aufgetreten" });
    }
}

// Apply rate limiting: 3 requests per 15 minutes per IP for password reset
export default withRateLimit(passwordResetRateLimiter)(resetPasswordHandler);

