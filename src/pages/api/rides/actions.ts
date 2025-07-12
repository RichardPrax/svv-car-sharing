import { NextApiRequest, NextApiResponse } from "next";
import { RideRepository } from "@/lib/repositories/rideRepository";
import { withRateLimit, apiRateLimiter } from "@/lib/middleware/rateLimiter";

const rideRepository = new RideRepository();

export default withRateLimit(apiRateLimiter)(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const { rideId, userId } = req.body;

            if (!rideId || !userId) {
                return res.status(400).json({ error: "Ride ID und User ID sind erforderlich" });
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
                return res.status(400).json({ error: "Ride ID und User ID sind erforderlich" });
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

