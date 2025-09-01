import { NextApiRequest, NextApiResponse } from "next";
import { RideRepository } from "@/lib/repositories/rideRepository";
import { withRateLimit, apiRateLimiter } from "@/lib/middleware/rateLimiter";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/authMiddleware";

const rideRepository = new RideRepository();

async function rideActionsHandler(req: AuthenticatedRequest, res: NextApiResponse): Promise<void> {
    // User is already authenticated via middleware
    const { user } = req;
    
    if (req.method === "POST") {
        try {
            const { rideId, userId } = req.body;

            if (!rideId || !userId) {
                res.status(400).json({ error: "Ride ID und User ID sind erforderlich" });
                return;
            }

            // Sicherheitsprüfung: Nur der authentifizierte User kann sich selbst zu Rides hinzufügen
            if (userId !== user.id) {
                res.status(403).json({ error: "Sie können nur sich selbst zu Rides hinzufügen" });
                return;
            }

            await rideRepository.addPassenger(rideId, userId);
            res.status(200).json({ success: true });
        } catch (error) {
            console.error("Fehler beim Beitreten zur Fahrt:", error);
            res.status(500).json({ error: "Fehler beim Beitreten zur Fahrt" });
        }
    } else if (req.method === "DELETE") {
        try {
            const { rideId, userId } = req.body;

            if (!rideId || !userId) {
                res.status(400).json({ error: "Ride ID und User ID sind erforderlich" });
                return;
            }

            // Sicherheitsprüfung: Nur der authentifizierte User kann sich selbst von Rides entfernen
            if (userId !== user.id) {
                res.status(403).json({ error: "Sie können nur sich selbst von Rides entfernen" });
                return;
            }

            await rideRepository.removePassenger(rideId, userId);
            res.status(200).json({ success: true });
        } catch (error) {
            console.error("Fehler beim Verlassen der Fahrt:", error);
            res.status(500).json({ error: "Fehler beim Verlassen der Fahrt" });
        }
    } else {
        res.setHeader("Allow", ["POST", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// Export with middleware chain
export default withRateLimit(apiRateLimiter)((req: NextApiRequest, res: NextApiResponse) => 
    withAuth(req, res, rideActionsHandler)
);

