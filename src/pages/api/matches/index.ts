import { NextApiRequest, NextApiResponse } from "next";
import { MatchDayRepository } from "@/lib/repositories/matchDayRepository";

const matchDayRepository = new MatchDayRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const matchDays = await matchDayRepository.findAll();
            res.status(200).json(matchDays);
        } catch (error) {
            console.error("Fehler beim Laden der Spieltage:", error);
            res.status(500).json({ error: "Fehler beim Laden der Spieltage" });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
