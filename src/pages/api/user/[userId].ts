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
        // All other methods require authentication
        return withAuth(req, res, async (authReq: AuthenticatedRequest, authRes: NextApiResponse) => {
            await authenticatedUserHandler(authReq, authRes);
        });
    }
}

async function authenticatedUserHandler(req: AuthenticatedRequest, res: NextApiResponse): Promise<void> {
    if (req.method === "POST") {
        try {
            // User is already authenticated via middleware
            const { user } = req;
            const profileData = req.body;

            // Validierung
            if (!profileData.firstName || !profileData.lastName) {
                res.status(400).json({ error: "Vor- und Nachname sind erforderlich" });
                return;
            }

            // Sicherheitsprüfung: Nur für sich selbst Profile erstellen
            if (profileData.id && profileData.id !== user.id) {
                res.status(403).json({ error: "Sie können nur Ihr eigenes Profil bearbeiten" });
                return;
            }

            // Setze die User ID vom Auth-Token
            profileData.id = user.id;

            const newProfile = await userProfileRepository.create(profileData);
            res.status(201).json(newProfile);
        } catch (error) {
            console.error("Fehler beim Erstellen des Benutzerprofils:", error);
            res.status(500).json({ error: "Fehler beim Erstellen des Benutzerprofils" });
        }
    } else {
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// Apply rate limiting
export default withRateLimit(userRateLimiter)(userHandler);

