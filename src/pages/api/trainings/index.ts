import { NextApiRequest, NextApiResponse } from "next";
import { TrainingRepository } from "@/lib/repositories/trainingRepository";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/authMiddleware";
import { UserProfileRepository } from "@/lib/repositories/userProfileRepository";

const trainingRepository = new TrainingRepository();
const userProfileRepository = new UserProfileRepository();

async function trainingHandler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === "GET") {
        try {
            const trainings = await trainingRepository.findAll();
            res.status(200).json(trainings);
        } catch (error) {
            console.error("Fehler beim Laden der Trainings:", error);
            res.status(500).json({ error: "Fehler beim Laden der Trainings" });
        }
    } else if (req.method === "POST") {
        // This method requires authentication, but GET doesn't
        return res.status(405).json({ error: "Use authenticated endpoint for POST requests" });
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function authenticatedTrainingHandler(req: AuthenticatedRequest, res: NextApiResponse): Promise<void> {
    if (req.method === "POST") {
        try {
            // User is already authenticated via middleware
            const { user } = req;

            // Get user profile and check trainer/admin role
            const userProfile = await userProfileRepository.findById(user.id);
            if (!userProfile || (userProfile.role !== "ADMIN" && userProfile.role !== "TRAINER")) {
                res.status(403).json({ error: "Insufficient permissions. Admin or Trainer access required." });
                return;
            }

            const { date, startTime, endTime, description } = req.body;

            // Validate required fields
            if (!date || !startTime || !endTime) {
                return res.status(400).json({ 
                    error: "Datum, Startzeit und Endzeit sind erforderlich" 
                });
            }

            // Create the training
            const training = await trainingRepository.create({
                date: new Date(date),
                startTime,
                endTime,
                description: description || null
            });

            res.status(201).json(training);
        } catch (error) {
            console.error("Fehler beim Erstellen des Trainings:", error);
            res.status(500).json({ error: "Fehler beim Erstellen des Trainings" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// Export both handlers - one for public GET, one for authenticated POST
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        return trainingHandler(req, res);
    } else if (req.method === "POST") {
        return withAuth(req, res, authenticatedTrainingHandler);
    } else {
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
