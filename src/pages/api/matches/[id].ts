import { NextApiRequest, NextApiResponse } from "next";
import { MatchDayRepository } from "@/lib/repositories/matchDayRepository";

const matchDayRepository = new MatchDayRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const { id } = req.query;

            if (!id || typeof id !== "string") {
                return res.status(400).json({ error: "Match ID ist erforderlich" });
            }

            const matchDay = await matchDayRepository.findById(id);

            if (!matchDay) {
                return res.status(404).json({ error: "Spieltag nicht gefunden" });
            }

            res.status(200).json(matchDay);
        } catch (error) {
            console.error("Fehler beim Laden des Spieltags:", error);
            res.status(500).json({ error: "Fehler beim Laden des Spieltags" });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
