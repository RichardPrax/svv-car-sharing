import { NextApiRequest, NextApiResponse } from "next";
import { RideRepository } from "@/lib/repositories/rideRepository";
import { RideCreateData } from "@/entities/Ride";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/authMiddleware";

const rideRepository = new RideRepository();

async function createRideHandler(req: AuthenticatedRequest, res: NextApiResponse): Promise<void> {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    try {
        // User is already authenticated via middleware
        const { user } = req;
        
        const { matchDayId, driverId, departureTime, departureLocation, availableSeats, additionalInfo } = req.body;

        // Sicherheitsprüfung: Nur der authentifizierte User kann Rides für sich erstellen
        if (driverId !== user.id) {
            res.status(403).json({
                error: "Sie können nur Rides für sich selbst erstellen",
            });
            return;
        }

        // Validierung der Pflichtfelder
        if (!matchDayId || !driverId || !departureTime || !departureLocation || !availableSeats) {
            res.status(400).json({
                error: "matchDayId, driverId, departureTime, departureLocation und availableSeats sind erforderlich",
            });
            return;
        }

        // Validierung der Datentypen
        if (typeof availableSeats !== "number" || availableSeats < 1 || availableSeats > 8) {
            res.status(400).json({
                error: "availableSeats muss eine Zahl zwischen 1 und 8 sein",
            });
            return;
        }

        // Departure Time validieren
        const parsedDepartureTime = new Date(departureTime);
        if (isNaN(parsedDepartureTime.getTime())) {
            res.status(400).json({
                error: "departureTime muss ein gültiges Datum sein",
            });
            return;
        }

        // Mitfahrgelegenheit erstellen
        const rideData: RideCreateData = {
            matchDayId: matchDayId.trim(),
            driverId: driverId.trim(),
            departureTime: parsedDepartureTime,
            departureLocation: departureLocation.trim(),
            availableSeats: parseInt(availableSeats.toString()),
            additionalInfo: additionalInfo ? additionalInfo.trim() : null,
        };

        const ride = await rideRepository.create(rideData);

        console.log("Ride created:", ride);
        res.status(201).json({
            message: "Mitfahrgelegenheit erfolgreich erstellt",
            ride: ride,
        });
    } catch (error) {
        console.error("Error creating ride:", error);
        res.status(500).json({ error: "Fehler beim Erstellen der Mitfahrgelegenheit" });
    }
}

// Export with auth middleware
export default (req: NextApiRequest, res: NextApiResponse) => 
    withAuth(req, res, createRideHandler);

