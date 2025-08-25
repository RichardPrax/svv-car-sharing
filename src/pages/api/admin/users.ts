// src/pages/api/admin/users.ts
import { NextApiRequest, NextApiResponse } from "next";
import { UserProfileRepository } from "@/lib/repositories/userProfileRepository";
import { withRateLimit, userRateLimiter } from "@/lib/middleware/rateLimiter";
import { withSecurity } from "@/lib/middleware/security";
import { supabase } from "@/lib/supabaseClient";

const userProfileRepository = new UserProfileRepository();

async function adminUsersHandler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    try {
        // Check authentication
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ error: "No valid authorization token provided" });
            return;
        }

        const token = authHeader.split(" ")[1];
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser(token);

        if (authError || !user) {
            res.status(401).json({ error: "Invalid or expired token" });
            return;
        }

        // Get user profile and check admin role
        const userProfile = await userProfileRepository.findById(user.id);
        if (!userProfile || (userProfile.role !== "ADMIN" && userProfile.role !== "TRAINER")) {
            res.status(403).json({ error: "Insufficient permissions. Admin access required." });
            return;
        }

        // Get all users if admin
        const allUsers = await userProfileRepository.findAll();

        res.status(200).json({
            users: allUsers,
            total: allUsers.length,
            requestedBy: {
                id: userProfile.id,
                name: `${userProfile.firstName} ${userProfile.lastName}`,
                role: userProfile.role,
            },
        });
    } catch (error) {
        console.error("Error in admin users endpoint:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// Apply security middleware and rate limiting
export default withRateLimit(userRateLimiter)(withSecurity()(adminUsersHandler));

