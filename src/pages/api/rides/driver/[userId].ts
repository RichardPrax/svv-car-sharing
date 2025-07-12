import { NextApiRequest, NextApiResponse } from "next";
import { RideRepository } from "@/lib/repositories/rideRepository";

const rideRepository = new RideRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const { userId } = req.query;

            if (!userId || typeof userId !== "string") {
                return res.status(400).json({ error: "User ID ist erforderlich" });
            }

            const rides = await rideRepository.findByDriver(userId);
            res.status(200).json(rides);
        } catch (error) {
            console.error("Fehler beim Laden der Fahrerfahrten:", error);
            res.status(500).json({ error: "Fehler beim Laden der Fahrerfahrten" });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
