import { NextApiRequest, NextApiResponse } from "next";
import { TrainingRepository } from "@/lib/repositories/trainingRepository";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/authMiddleware";
import { UserProfileRepository } from "@/lib/repositories/userProfileRepository";

const trainingRepository = new TrainingRepository();
const userProfileRepository = new UserProfileRepository();

async function trainingDetailHandler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const { trainingId } = req.query;

    if (typeof trainingId !== "string") {
        return res.status(400).json({ error: "Ungültige Training-ID" });
    }

    if (req.method === "GET") {
        try {
            const training = await trainingRepository.findById(trainingId);
            
            if (!training) {
                return res.status(404).json({ error: "Training nicht gefunden" });
            }

            res.status(200).json(training);
        } catch (error) {
            console.error("Fehler beim Laden des Trainings:", error);
            res.status(500).json({ error: "Fehler beim Laden des Trainings" });
        }
    } else {
        // PUT and DELETE require authentication
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function authenticatedTrainingDetailHandler(req: AuthenticatedRequest, res: NextApiResponse): Promise<void> {
    const { trainingId } = req.query;

    if (typeof trainingId !== "string") {
        return res.status(400).json({ error: "Ungültige Training-ID" });
    }

    if (req.method === "PUT") {
        try {
            // User is already authenticated via middleware
            const { user } = req;

            // Get user profile and check trainer/admin role
            const userProfile = await userProfileRepository.findById(user.id);
            if (!userProfile || (userProfile.role !== "ADMIN" && userProfile.role !== "TRAINER")) {
                res.status(403).json({ error: "Insufficient permissions. Admin or Trainer access required." });
                return;
            }

            const { date, startTime, endTime, location, description } = req.body;

            // Validate required fields
            if (!date || !startTime || !endTime || !location) {
                return res.status(400).json({ 
                    error: "Datum, Startzeit, Endzeit und Ort sind erforderlich" 
                });
            }

            // Check if training exists
            const existingTraining = await trainingRepository.findById(trainingId);
            if (!existingTraining) {
                return res.status(404).json({ error: "Training nicht gefunden" });
            }

            // Update the training
            const training = await trainingRepository.update(trainingId, {
                date: new Date(date),
                startTime,
                endTime,
                location,
                description: description || null
            });

            res.status(200).json(training);
        } catch (error) {
            console.error("Fehler beim Aktualisieren des Trainings:", error);
            res.status(500).json({ error: "Fehler beim Aktualisieren des Trainings" });
        }
    } else if (req.method === "DELETE") {
        try {
            // User is already authenticated via middleware
            const { user } = req;

            // Get user profile and check trainer/admin role
            const userProfile = await userProfileRepository.findById(user.id);
            if (!userProfile || (userProfile.role !== "ADMIN" && userProfile.role !== "TRAINER")) {
                res.status(403).json({ error: "Insufficient permissions. Admin or Trainer access required." });
                return;
            }

            // Check if training exists
            const existingTraining = await trainingRepository.findById(trainingId);
            if (!existingTraining) {
                return res.status(404).json({ error: "Training nicht gefunden" });
            }

            // Delete the training
            await trainingRepository.delete(trainingId);

            res.status(200).json({ message: "Training erfolgreich gelöscht" });
        } catch (error) {
            console.error("Fehler beim Löschen des Trainings:", error);
            res.status(500).json({ error: "Fehler beim Löschen des Trainings" });
        }
    } else {
        res.setHeader("Allow", ["PUT", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// Export combined handler that routes based on method
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        return trainingDetailHandler(req, res);
    } else if (req.method === "PUT" || req.method === "DELETE") {
        return withAuth(req, res, authenticatedTrainingDetailHandler);
    } else {
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}