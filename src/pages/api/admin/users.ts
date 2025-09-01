// src/pages/api/admin/users.ts
import { NextApiRequest, NextApiResponse } from "next";
import { UserProfileRepository } from "@/lib/repositories/userProfileRepository";
import { withRateLimit, userRateLimiter } from "@/lib/middleware/rateLimiter";
import { withSecurity } from "@/lib/middleware/security";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/authMiddleware";

const userProfileRepository = new UserProfileRepository();

async function adminUsersHandler(req: AuthenticatedRequest, res: NextApiResponse): Promise<void> {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    try {
        // User is already authenticated via middleware
        const { user } = req;

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

// Apply middleware chain with auth
export default withRateLimit(userRateLimiter)(withSecurity()((req: NextApiRequest, res: NextApiResponse) => 
    withAuth(req, res, adminUsersHandler)
));

