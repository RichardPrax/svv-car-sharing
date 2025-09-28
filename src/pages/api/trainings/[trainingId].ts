import { NextApiRequest, NextApiResponse } from "next";
import { TrainingRepository } from "@/lib/repositories/trainingRepository";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/authMiddleware";
import { UserProfileRepository } from "@/lib/repositories/userProfileRepository";

const trainingRepository = new TrainingRepository();
const userProfileRepository = new UserProfileRepository();

async function authenticatedTrainingHandler(req: AuthenticatedRequest, res: NextApiResponse): Promise<void> {
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

            const { date, startTime, endTime, editScope } = req.body;

            // Validate required fields
            if (!date || !startTime || !endTime) {
                return res.status(400).json({ 
                    error: "Datum, Startzeit und Endzeit sind erforderlich" 
                });
            }

            // Check if training exists
            const existingTraining = await trainingRepository.findById(trainingId);
            if (!existingTraining) {
                return res.status(404).json({ error: "Training nicht gefunden" });
            }

            // Update the training
            let training;
            
            if (editScope === 'series' && existingTraining.seriesId) {
                // Update all trainings in the series (only times, not dates)
                await trainingRepository.updateSeriesTrainings(existingTraining.seriesId, {
                    startTime,
                    endTime
                });
                // Return the updated current training
                training = await trainingRepository.findById(trainingId);
            } else {
                // Update only this training
                training = await trainingRepository.update(trainingId, {
                    date: new Date(date),
                    startTime,
                    endTime
                });
            }

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

            const { deleteScope } = req.body;

            // Check if training exists
            const existingTraining = await trainingRepository.findById(trainingId);
            if (!existingTraining) {
                return res.status(404).json({ error: "Training nicht gefunden" });
            }

            // Delete training(s) based on scope
            if (deleteScope === 'series' && existingTraining.seriesId) {
                // Delete all trainings in the series
                await trainingRepository.deleteSeriesTrainings(existingTraining.seriesId);
                res.status(200).json({ message: "Alle Trainings der Serie erfolgreich gelöscht" });
            } else {
                // Delete only this training
                await trainingRepository.delete(trainingId);
                res.status(200).json({ message: "Training erfolgreich gelöscht" });
            }
        } catch (error) {
            console.error("Fehler beim Löschen des Trainings:", error);
            res.status(500).json({ error: "Fehler beim Löschen des Trainings" });
        }
    } else {
        res.setHeader("Allow", ["PUT", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// Export handler that only handles authenticated PUT and DELETE requests
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PUT" || req.method === "DELETE") {
        return withAuth(req, res, authenticatedTrainingHandler);
    } else {
        res.setHeader("Allow", ["PUT", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}