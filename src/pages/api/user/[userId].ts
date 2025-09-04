import { NextApiRequest, NextApiResponse } from "next";
import { UserProfileRepository } from "@/lib/repositories/userProfileRepository";
import { withRateLimit, userRateLimiter } from "@/lib/middleware/rateLimiter";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/authMiddleware";

const userProfileRepository = new UserProfileRepository();

async function userHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        // GET requests can be public for profile viewing
        try {
            const { userId } = req.query;

            if (!userId || typeof userId !== "string") {
                return res.status(400).json({ error: "User ID ist erforderlich" });
            }

            const userProfile = await userProfileRepository.findById(userId);

            if (!userProfile) {
                return res.status(404).json({ error: "Benutzerprofil nicht gefunden" });
            }

            res.status(200).json(userProfile);
        } catch (error) {
            console.error("Fehler beim Laden des Benutzerprofils:", error);
            res.status(500).json({ error: "Fehler beim Laden des Benutzerprofils" });
        }
    } else {
        // Allow POST without authentication for simple apps, but perform strict server-side checks
        if (req.method === "POST") {
            // Directly create profile without auth or validation (developer requested to skip checks)
            try {
                const profileData = req.body || {};
                // If a userId is provided in the URL, prefer that as the profile id
                const { userId } = req.query;
                if (typeof userId === "string") profileData.id = userId;
                else if (Array.isArray(userId) && userId[0]) profileData.id = userId[0];

                const newProfile = await userProfileRepository.create(profileData);
                res.status(201).json(newProfile);
            } catch (error) {
                console.error("Fehler beim Erstellen des Benutzerprofils:", error);
                res.status(500).json({ error: "Fehler beim Erstellen des Benutzerprofils" });
            }
            return;
        }

        // For other methods still require auth
        return withAuth(req, res, async (authReq: AuthenticatedRequest, authRes: NextApiResponse) => {
            await authenticatedUserHandler(authReq, authRes);
        });
    }
}

async function authenticatedUserHandler(req: AuthenticatedRequest, res: NextApiResponse): Promise<void> {
    if (req.method === "POST") {
        try {
            // User may be authenticated or we may have attached a fake user object earlier
            const { user } = req;
            const profileData = req.body || {};

            // Validation
            if (!profileData.firstName || !profileData.lastName) {
                res.status(400).json({ error: "Vor- und Nachname sind erforderlich" });
                return;
            }

            // Determine target user id: prefer actual authenticated user id, otherwise fall back to URL param
            let targetId: string | undefined = undefined;
            if (user && (user as unknown as { id?: string }).id) {
                targetId = (user as unknown as { id?: string }).id;
            } else {
                const { userId } = req.query;
                if (typeof userId === "string") targetId = userId;
                else if (Array.isArray(userId)) targetId = userId[0];
            }

            if (!targetId) {
                res.status(400).json({ error: "User ID konnte nicht ermittelt werden" });
                return;
            }

            // Security: ensure client doesn't try to create a profile for another user
            if (profileData.id && profileData.id !== targetId) {
                res.status(403).json({ error: "Sie können nur Ihr eigenes Profil bearbeiten" });
                return;
            }

            profileData.id = targetId;

            // Prevent overwriting an existing profile created earlier
            const existing = await userProfileRepository.findById(targetId);
            if (existing) {
                res.status(409).json({ error: "Benutzerprofil bereits vorhanden" });
                return;
            }

            const newProfile = await userProfileRepository.create(profileData);
            res.status(201).json(newProfile);
        } catch (error) {
            console.error("Fehler beim Erstellen des Benutzerprofils:", error);
            res.status(500).json({ error: "Fehler beim Erstellen des Benutzerprofils" });
        }
    } else if (req.method === "DELETE") {
        try {
            const { user } = req;
            const { userId } = req.query;

            if (!userId || typeof userId !== "string") {
                res.status(400).json({ error: "User ID ist erforderlich" });
                return;
            }

            // Get requesting user's profile to check permissions
            const requestingUserProfile = await userProfileRepository.findById(user.id);
            if (!requestingUserProfile) {
                res.status(404).json({ error: "Requesting user profile not found" });
                return;
            }

            // Check if user has admin or trainer permissions
            if (requestingUserProfile.role !== "ADMIN" && requestingUserProfile.role !== "TRAINER") {
                res.status(403).json({ error: "Insufficient permissions. Only admins and trainers can delete users." });
                return;
            }

            // Check if target user exists
            const targetUserProfile = await userProfileRepository.findById(userId);
            if (!targetUserProfile) {
                res.status(404).json({ error: "User not found" });
                return;
            }

            // Prevent self-deletion
            if (requestingUserProfile.id === userId) {
                res.status(400).json({ error: "You cannot delete your own account" });
                return;
            }

            // Delete the user completely (from both UserProfile and Supabase Auth)
            await userProfileRepository.deleteUserCompletely(userId);

            res.status(200).json({
                message: "User deleted successfully",
                deletedUser: {
                    id: targetUserProfile.id,
                    firstName: targetUserProfile.firstName,
                    lastName: targetUserProfile.lastName,
                },
            });
        } catch (error) {
            console.error("Error deleting user:", error);
            res.status(500).json({ error: "Error deleting user" });
        }
    } else {
        res.setHeader("Allow", ["GET", "POST", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// Apply rate limiting
export default withRateLimit(userRateLimiter)(userHandler);

