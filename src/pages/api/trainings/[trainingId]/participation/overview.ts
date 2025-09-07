import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        const { trainingId } = req.query;

        if (!trainingId || typeof trainingId !== "string") {
            return res.status(400).json({ error: "Training ID is required" });
        }

        // Verify the training exists
        const training = await prisma.training.findUnique({
            where: { id: trainingId },
        });

        if (!training) {
            return res.status(404).json({ error: "Training not found" });
        }

        // Get all participations for this training with user profiles and positions
        const participations = await prisma.trainingParticipation.findMany({
            where: { trainingId: trainingId },
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

        // Determine who hasn't responded yet
        const participatingUserIds = participations.map(p => p.playerId);
        const openUsers = allUsers.filter(user => !participatingUserIds.includes(user.id));

        // Group participations by status
        const participationsByStatus = {
            JOINING: participations.filter(p => p.status === "JOINING"),
            DECLINING: participations.filter(p => p.status === "DECLINING")
        };

        // Calculate counts
        const counts = {
            joining: participationsByStatus.JOINING.length,
            declining: participationsByStatus.DECLINING.length,
            open: openUsers.length,
            total: allUsers.length
        };

        const response = {
            training: {
                id: training.id,
                date: training.date,
                startTime: training.startTime,
                endTime: training.endTime,
                description: training.description,
            },
            participation: {
                ...participationsByStatus,
                OPEN: openUsers
            },
            counts,
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching training participation overview:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
