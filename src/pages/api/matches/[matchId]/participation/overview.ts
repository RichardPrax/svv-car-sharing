import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        const { matchId } = req.query;

        if (!matchId || typeof matchId !== "string") {
            return res.status(400).json({ error: "Match ID is required" });
        }

        // Verify the match exists
        const match = await prisma.matchDay.findUnique({
            where: { id: matchId },
        });

        if (!match) {
            return res.status(404).json({ error: "Match not found" });
        }

        // Get all participations for this match with user profiles
        const participations = await prisma.gameParticipation.findMany({
            where: { matchDayId: matchId },
            include: {
                player: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                    },
                },
            },
            orderBy: [
                { status: "asc" }, // JOINING first, then TENTATIVE, then DECLINING
                { player: { firstName: "asc" } }, // Then alphabetically by name
            ],
        });

        // Group participations by status
        const groupedParticipations = {
            JOINING: participations.filter((p) => p.status === "JOINING"),
            TENTATIVE: participations.filter((p) => p.status === "TENTATIVE"),
            DECLINING: participations.filter((p) => p.status === "DECLINING"),
        };

        // Get counts
        const counts = {
            joining: groupedParticipations.JOINING.length,
            tentative: groupedParticipations.TENTATIVE.length,
            declining: groupedParticipations.DECLINING.length,
            total: participations.length,
        };

        res.status(200).json({
            participations: groupedParticipations,
            counts,
            match: {
                id: match.id,
                date: match.date,
                time: match.time,
                opponent: match.opponent,
                location: match.location,
            },
        });
    } catch (error) {
        console.error("Error fetching participation overview:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

