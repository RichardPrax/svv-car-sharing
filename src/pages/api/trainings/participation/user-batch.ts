import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/authMiddleware";
import { UserProfileRepository } from "@/lib/repositories/userProfileRepository";

const userProfileRepository = new UserProfileRepository();

async function userBatchHandler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        // User is already authenticated via middleware
        const { user } = req;

        const { trainingIds } = req.query;

        if (!trainingIds || typeof trainingIds !== "string") {
            return res.status(400).json({ error: "Training IDs are required" });
        }

        const trainingIdArray = trainingIds.split(",").filter((id) => id.trim());

        if (trainingIdArray.length === 0) {
            return res.status(400).json({ error: "At least one training ID is required" });
        }

        // Check if user has player role
        const userProfile = await userProfileRepository.findById(user.id);

        if (!userProfile || (userProfile.role !== "PLAYER" && userProfile.role !== "ADMIN" && userProfile.role !== "TRAINER")) {
            return res.status(403).json({ error: "Only players, trainers, and admins can participate in trainings" });
        }

        // Get all participations for this user across the specified trainings
        const participations = await prisma.trainingParticipation.findMany({
            where: {
                trainingId: { in: trainingIdArray },
                playerId: user.id,
            },
            orderBy: { updatedAt: "desc" },
        });

        // Create a map of trainingId to participation
        const participationByTraining: Record<string, (typeof participations)[0] | null> = {};

        for (const trainingId of trainingIdArray) {
            const participation = participations.find((p) => p.trainingId === trainingId);
            participationByTraining[trainingId] = participation || null;
        }

        return res.status(200).json(participationByTraining);
    } catch (error) {
        console.error("Error fetching user training participations:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

// Export with auth middleware
const handler = (req: NextApiRequest, res: NextApiResponse) => withAuth(req, res, userBatchHandler);

export default handler;
