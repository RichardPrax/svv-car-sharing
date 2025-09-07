import { NextApiRequest, NextApiResponse } from "next";
import { TrainingRepository } from "@/lib/repositories/trainingRepository";

const trainingRepository = new TrainingRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const nextTraining = await trainingRepository.findNextUpcoming();
            res.status(200).json(nextTraining);
        } catch (error) {
            console.error("Fehler beim Laden des nächsten Trainings:", error);
            res.status(500).json({ error: "Fehler beim Laden des nächsten Trainings" });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
