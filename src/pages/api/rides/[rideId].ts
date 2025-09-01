import { NextApiRequest, NextApiResponse } from "next";
import { RideRepository } from "@/lib/repositories/rideRepository";
import { RideUpdateData } from "@/entities/Ride";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/authMiddleware";

const rideRepository = new RideRepository();

async function rideHandler(req: AuthenticatedRequest, res: NextApiResponse): Promise<void> {
    const { rideId } = req.query;

    if (!rideId || typeof rideId !== "string") {
        res.status(400).json({ error: "Ride ID ist erforderlich" });
        return;
    }

    // User is already authenticated via middleware
    const { user } = req;

    if (req.method === "PUT") {
        try {
            const updateData: RideUpdateData = req.body;

            // Validierung
            if (!updateData.departureTime || !updateData.departureLocation || !updateData.availableSeats) {
                res.status(400).json({ error: "Alle erforderlichen Felder müssen ausgefüllt werden" });
                return;
            }

            // Sicherheitsprüfung: Nur der Driver kann seine eigene Ride bearbeiten
            const existingRide = await rideRepository.findByIdWithDetails(rideId);
            if (!existingRide) {
                res.status(404).json({ error: "Ride nicht gefunden" });
                return;
            }

            if (existingRide.driverId !== user.id) {
                res.status(403).json({ error: "Sie können nur Ihre eigenen Rides bearbeiten" });
                return;
            }

            const updatedRide = await rideRepository.update(rideId, updateData);
            res.status(200).json(updatedRide);
        } catch (error) {
            console.error("Fehler beim Aktualisieren der Fahrt:", error);
            res.status(500).json({ error: "Fehler beim Aktualisieren der Fahrt" });
        }
    } else if (req.method === "DELETE") {
        try {
            // Sicherheitsprüfung: Nur der Driver kann seine eigene Ride löschen
            const existingRide = await rideRepository.findByIdWithDetails(rideId);
            if (!existingRide) {
                res.status(404).json({ error: "Ride nicht gefunden" });
                return;
            }

            if (existingRide.driverId !== user.id) {
                res.status(403).json({ error: "Sie können nur Ihre eigenen Rides löschen" });
                return;
            }

            await rideRepository.delete(rideId);
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

// Export with auth middleware
export default (req: NextApiRequest, res: NextApiResponse) => 
    withAuth(req, res, rideHandler);
