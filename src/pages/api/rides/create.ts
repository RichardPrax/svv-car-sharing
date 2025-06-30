import { NextApiRequest, NextApiResponse } from "next";
import { RideRepository } from "@/lib/repositories/rideRepository";

const rideRepository = new RideRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const rideData = req.body;

            // Validierung
            if (!rideData.matchDayId || !rideData.driverId || !rideData.departureTime || !rideData.departureLocation || !rideData.availableSeats) {
                return res.status(400).json({ error: "Alle erforderlichen Felder müssen ausgefüllt werden" });
            }

            const newRide = await rideRepository.create(rideData);
            res.status(201).json(newRide);
        } catch (error) {
            console.error("Fehler beim Erstellen der Fahrt:", error);
            res.status(500).json({ error: "Fehler beim Erstellen der Fahrt" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
