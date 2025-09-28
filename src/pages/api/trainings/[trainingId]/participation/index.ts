import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/authMiddleware";
import { UserProfileRepository } from "@/lib/repositories/userProfileRepository";
import { GameParticipationStatus } from "@prisma/client";

const userProfileRepository = new UserProfileRepository();

async function participationHandler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // User is already authenticated via middleware
        const { user } = req;

        const { trainingId } = req.query;
        const { status, reason } = req.body;

        if (!trainingId || typeof trainingId !== "string") {
            return res.status(400).json({ error: "Invalid training ID" });
        }

        if (!status || !["JOINING", "DECLINING"].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        // Bei DECLINING ist ein Grund erforderlich
        if (status === "DECLINING" && (!reason || reason.trim().length === 0)) {
            return res.status(400).json({ error: "Bei einer Absage muss ein Grund angegeben werden" });
        }

        // Check if training exists
        const training = await prisma.training.findUnique({
            where: { id: trainingId },
        });

        if (!training) {
            return res.status(404).json({ error: "Training not found" });
        }

        // Check if user has player role
        const userProfile = await userProfileRepository.findById(user.id);

        if (!userProfile || (userProfile.role !== "PLAYER" && userProfile.role !== "TRAINER" && userProfile.role !== "ADMIN")) {
            return res.status(403).json({ error: "Only players, trainers, and admins can participate in trainings" });
        }

        // Upsert participation (create or update)
        const participation = await prisma.trainingParticipation.upsert({
            where: {
                trainingId_playerId: {
                    trainingId: trainingId,
                    playerId: user.id,
                },
            },
            update: {
                status: status as GameParticipationStatus,
                reason: reason && reason.trim() ? reason.trim() : null, // Grund optional bei JOINING, erforderlich bei DECLINING
                updatedAt: new Date(),
            },
            create: {
                trainingId: trainingId,
                playerId: user.id,
                status: status as GameParticipationStatus,
                reason: reason && reason.trim() ? reason.trim() : null, // Grund optional bei JOINING, erforderlich bei DECLINING
            },
        });

        return res.status(200).json(participation);
    } catch (error) {
        console.error("Error handling training participation:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

// Export with auth middleware
const handler = (req: NextApiRequest, res: NextApiResponse) => withAuth(req, res, participationHandler);

export default handler;
