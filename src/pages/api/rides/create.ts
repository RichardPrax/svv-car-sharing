import { NextApiRequest, NextApiResponse } from "next";
import { RideRepository } from "@/lib/repositories/rideRepository";

const rideRepository = new RideRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { matchDayId, driverId, departureTime, departureLocation, availableSeats, additionalInfo } = req.body;

        // Validierung der Pflichtfelder
        if (!matchDayId || !driverId || !departureTime || !departureLocation || !availableSeats) {
            return res.status(400).json({
                error: "matchDayId, driverId, departureTime, departureLocation und availableSeats sind erforderlich",
            });
        }

        // Validierung der Datentypen
        if (typeof availableSeats !== "number" || availableSeats < 1 || availableSeats > 8) {
            return res.status(400).json({
                error: "availableSeats muss eine Zahl zwischen 1 und 8 sein",
            });
        }

        // Departure Time validieren
        const parsedDepartureTime = new Date(departureTime);
        if (isNaN(parsedDepartureTime.getTime())) {
            return res.status(400).json({
                error: "departureTime muss ein gültiges Datum sein",
            });
        }

        // Mitfahrgelegenheit erstellen
        const ride = await rideRepository.create({
            matchDayId: matchDayId.trim(),
            driverId: driverId.trim(),
            departureTime: parsedDepartureTime,
            departureLocation: departureLocation.trim(),
            availableSeats: parseInt(availableSeats.toString()),
            additionalInfo: additionalInfo ? additionalInfo.trim() : null,
        });

        console.log("Ride created:", ride);
        return res.status(201).json({
            message: "Mitfahrgelegenheit erfolgreich erstellt",
            ride: ride,
        });
    } catch (error) {
        console.error("Error creating ride:", error);
        return res.status(500).json({ error: "Fehler beim Erstellen der Mitfahrgelegenheit" });
    }
}

