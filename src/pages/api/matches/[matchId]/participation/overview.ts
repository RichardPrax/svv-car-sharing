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

        // Get all users to determine who hasn't responded yet
        const allUsers = await prisma.userProfile.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
            },
            orderBy: { firstName: "asc" },
        });

        // Get IDs of users who have already participated
        const participatedUserIds = new Set(participations.map((p) => p.playerId));

        // Find users who haven't responded yet
        const openUsers = allUsers.filter((user) => !participatedUserIds.has(user.id));

        // Group participations by status
        const groupedParticipations = {
            JOINING: participations.filter((p) => p.status === "JOINING"),
            DECLINING: participations.filter((p) => p.status === "DECLINING"),
        };

        // Get counts
        const counts = {
            joining: groupedParticipations.JOINING.length,
            declining: groupedParticipations.DECLINING.length,
            open: openUsers.length,
            total: allUsers.length,
        };

        res.status(200).json({
            participations: groupedParticipations,
            openUsers,
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

