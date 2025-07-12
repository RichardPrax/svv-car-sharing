import { NextApiRequest, NextApiResponse } from "next";
import { RideRepository } from "@/lib/repositories/rideRepository";
import { RideUpdateData } from "@/entities/Ride";

const rideRepository = new RideRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Ride ID ist erforderlich" });
    }

    if (req.method === "PUT") {
        try {
            const updateData: RideUpdateData = req.body;

            // Validierung
            if (!updateData.departureTime || !updateData.departureLocation || !updateData.availableSeats) {
                return res.status(400).json({ error: "Alle erforderlichen Felder müssen ausgefüllt werden" });
            }

            const updatedRide = await rideRepository.update(id, updateData);
            res.status(200).json(updatedRide);
        } catch (error) {
            console.error("Fehler beim Aktualisieren der Fahrt:", error);
            res.status(500).json({ error: "Fehler beim Aktualisieren der Fahrt" });
        }
    } else if (req.method === "DELETE") {
        try {
            await rideRepository.delete(id);
            res.status(200).json({ success: true });
        } catch (error) {
            console.error("Fehler beim Löschen der Fahrt:", error);
            res.status(500).json({ error: "Fehler beim Löschen der Fahrt" });
        }
    } else {
        res.setHeader("Allow", ["PUT", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

