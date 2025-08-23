import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        const { matchIds } = req.query;

        if (!matchIds || typeof matchIds !== "string") {
            return res.status(400).json({ error: "Match IDs are required" });
        }

        const matchIdArray = matchIds.split(",").filter(id => id.trim());

        if (matchIdArray.length === 0) {
            return res.status(400).json({ error: "At least one match ID is required" });
        }

        // Verify all matches exist
        const matches = await prisma.matchDay.findMany({
            where: { id: { in: matchIdArray } },
            select: { id: true, date: true, time: true, opponent: true, location: true }
        });

        if (matches.length !== matchIdArray.length) {
            return res.status(400).json({ error: "One or more matches not found" });
        }

        // Get all participations for these matches with user profiles and positions
        const participations = await prisma.gameParticipation.findMany({
            where: { matchDayId: { in: matchIdArray } },
            include: {
                player: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        playerPositions: {
                            select: {
                                id: true,
                                position: true,
                                isPrimary: true,
                            },
                            orderBy: [
                                { isPrimary: 'desc' },
                                { position: 'asc' }
                            ]
                        },
                    },
                },
            },
            orderBy: [
                { status: "asc" }, // JOINING first, then DECLINING
                { player: { firstName: "asc" } }, // Then alphabetically by name
            ],
        });

        // Get all users to determine who hasn't responded yet (including positions)
        const allUsers = await prisma.userProfile.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                playerPositions: {
                    select: {
                        id: true,
                        position: true,
                        isPrimary: true,
                    },
                    orderBy: [
                        { isPrimary: 'desc' },
                        { position: 'asc' }
                    ]
                },
            },
            orderBy: { firstName: "asc" },
        });

        // Get IDs of users who have already participated in any match
        const participatedUserIds = new Set(participations.map((p) => p.playerId));

        // Find users who haven't responded to any match yet
        const openUsers = allUsers.filter((user) => !participatedUserIds.has(user.id));

        // Group participations by match day and status
        const overviewByMatch: Record<string, any> = {};

        for (const match of matches) {
            const matchParticipations = participations.filter(p => p.matchDayId === match.id);
            const participatedUserIdsForMatch = new Set(matchParticipations.map((p) => p.playerId));
            const openUsersForMatch = allUsers.filter((user) => !participatedUserIdsForMatch.has(user.id));

            const groupedParticipations = {
                JOINING: matchParticipations.filter((p) => p.status === "JOINING"),
                DECLINING: matchParticipations.filter((p) => p.status === "DECLINING"),
            };

            const counts = {
                joining: groupedParticipations.JOINING.length,
                declining: groupedParticipations.DECLINING.length,
                open: openUsersForMatch.length,
                total: allUsers.length,
            };

            overviewByMatch[match.id] = {
                participations: groupedParticipations,
                openUsers: openUsersForMatch,
                counts,
                match: {
                    id: match.id,
                    date: match.date,
                    time: match.time,
                    opponent: match.opponent,
                    location: match.location,
                },
            };
        }

        res.status(200).json(overviewByMatch);
    } catch (error) {
        console.error("Error fetching batch participation overview:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
