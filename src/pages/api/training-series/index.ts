import { NextApiRequest, NextApiResponse } from "next";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/authMiddleware";
import { userProfileRepository, trainingRepository } from "@/lib/repositories";
import { trainingSeriesRepository } from "@/lib/repositories/trainingSeriesRepository";
import { generateTrainingDatesForSeries, CreateTrainingSeriesData } from "@/entities/Training";

async function trainingSeriesHandler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === "GET") {
        try {
            const series = await trainingSeriesRepository.findAll();
            res.status(200).json(series);
        } catch (error) {
            console.error("Fehler beim Laden der Trainings-Serien:", error);
            res.status(500).json({ error: "Fehler beim Laden der Trainings-Serien" });
        }
    } else {
        await withAuth(req, res, authenticatedTrainingSeriesHandler);
    }
}

async function authenticatedTrainingSeriesHandler(req: AuthenticatedRequest, res: NextApiResponse): Promise<void> {
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

            const { name, description, weekdays, startTime, endTime, startWeek, endWeek } = req.body;

            // Validate required fields
            if (!weekdays || !weekdays.length || !startTime || !endTime || !startWeek || !endWeek) {
                return res.status(400).json({ 
                    error: "Trainingstage, Startzeit, Endzeit, Startwoche und Endwoche sind erforderlich" 
                });
            }

            // Validate weekdays array
            if (!Array.isArray(weekdays) || weekdays.some(day => typeof day !== 'number' || day < 1 || day > 7)) {
                return res.status(400).json({ 
                    error: "Ungültige Trainingstage. Muss ein Array von Zahlen zwischen 1 und 7 sein." 
                });
            }

            // Validate dates
            const startWeekDate = new Date(startWeek);
            const endWeekDate = new Date(endWeek);
            
            if (endWeekDate < startWeekDate) {
                return res.status(400).json({ 
                    error: "Die Endwoche muss nach der Startwoche liegen" 
                });
            }

            // Create the series data
            const seriesData: CreateTrainingSeriesData = {
                name: name || undefined,
                description: description || undefined,
                weekdays,
                startTime,
                endTime,
                startWeek: startWeekDate,
                endWeek: endWeekDate,
            };

            // Create the training series
            const series = await trainingSeriesRepository.create(seriesData);

            // Generate training dates
            const trainingDates = generateTrainingDatesForSeries(seriesData);

            // Create individual trainings
            const trainings = await trainingRepository.createMultiple(
                trainingDates.map(date => ({
                    date,
                    startTime,
                    endTime,
                    seriesId: series.id,
                }))
            );

            res.status(201).json({ series, trainings });
        } catch (error) {
            console.error("Fehler beim Erstellen der Trainings-Serie:", error);
            res.status(500).json({ error: "Fehler beim Erstellen der Trainings-Serie" });
        }
    } else {
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// Export both handlers - one for public GET, one for authenticated POST
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        return trainingSeriesHandler(req, res);
    } else {
        return withAuth(req, res, authenticatedTrainingSeriesHandler);
    }
}



