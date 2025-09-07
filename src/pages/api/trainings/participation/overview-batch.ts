import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        const { trainingIds } = req.query;

        if (!trainingIds || typeof trainingIds !== "string") {
            return res.status(400).json({ error: "Training IDs are required" });
        }

        const trainingIdArray = trainingIds.split(",").filter((id) => id.trim());

        if (trainingIdArray.length === 0) {
            return res.status(400).json({ error: "At least one training ID is required" });
        }

        // Verify all trainings exist
        const trainings = await prisma.training.findMany({
            where: { id: { in: trainingIdArray } },
            select: { id: true },
        });

        const foundTrainingIds = trainings.map((t) => t.id);
        const missingTrainingIds = trainingIdArray.filter((id) => !foundTrainingIds.includes(id));

        if (missingTrainingIds.length > 0) {
            return res.status(404).json({
                error: "Some trainings not found",
                missingIds: missingTrainingIds,
            });
        }

        // Get all participations for these trainings
        const participations = await prisma.trainingParticipation.findMany({
            where: { trainingId: { in: trainingIdArray } },
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
                { status: "asc" },
                { player: { firstName: "asc" } },
            ],
        });

        // Get all users
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

        // Group by training ID
        const overviewByTraining: Record<string, any> = {};

        for (const trainingId of trainingIdArray) {
            const trainingParticipations = participations.filter((p) => p.trainingId === trainingId);
            const participatingUserIds = trainingParticipations.map((p) => p.playerId);
            const openUsers = allUsers.filter((user) => !participatingUserIds.includes(user.id));

            const participationsByStatus = {
                JOINING: trainingParticipations.filter((p) => p.status === "JOINING"),
                DECLINING: trainingParticipations.filter((p) => p.status === "DECLINING"),
            };

            const counts = {
                joining: participationsByStatus.JOINING.length,
                declining: participationsByStatus.DECLINING.length,
                open: openUsers.length,
                total: allUsers.length,
            };

            overviewByTraining[trainingId] = {
                participation: {
                    ...participationsByStatus,
                    OPEN: openUsers,
                },
                counts,
            };
        }

        return res.status(200).json(overviewByTraining);
    } catch (error) {
        console.error("Error fetching training participation overview batch:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
