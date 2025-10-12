import { NextApiRequest, NextApiResponse } from "next";
import { RideRepository } from "@/lib/repositories/rideRepository";

const rideRepository = new RideRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const { userId } = req.query;

            if (!userId || typeof userId !== "string") {
                console.error("Invalid userId parameter:", userId);
                return res.status(400).json({ error: "User ID ist erforderlich" });
            }

            const rides = await rideRepository.findByPassenger(userId);
            res.status(200).json(rides);
        } catch (error) {
            console.error("Fehler beim Laden der Mitfahrerfahrten:", error);
            const errorMessage = error instanceof Error ? error.message : "Unbekannter Fehler";
            res.status(500).json({ 
                error: "Fehler beim Laden der Mitfahrerfahrten",
                details: errorMessage 
            });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
