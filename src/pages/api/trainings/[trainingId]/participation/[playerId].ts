import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/authMiddleware";
import { UserProfileRepository } from "@/lib/repositories/userProfileRepository";

const userProfileRepository = new UserProfileRepository();

async function playerParticipationHandler(req: AuthenticatedRequest, res: NextApiResponse) {
    const { method } = req;

    try {
        // User is already authenticated via middleware
        const { user } = req;

        const { trainingId, playerId } = req.query;

        if (!trainingId || typeof trainingId !== "string") {
            return res.status(400).json({ error: "Invalid training ID" });
        }

        if (!playerId || typeof playerId !== "string") {
            return res.status(400).json({ error: "Invalid player ID" });
        }

        // Check if user is requesting their own participation or is admin
        const userProfile = await userProfileRepository.findById(user.id);

        if (!userProfile) {
            return res.status(404).json({ error: "User profile not found" });
        }

        const isOwnParticipation = user.id === playerId;
        const isAdmin = userProfile.role === "ADMIN";

        if (!isOwnParticipation && !isAdmin) {
            return res.status(403).json({ error: "Forbidden" });
        }

        if (method === "GET") {
            const participation = await prisma.trainingParticipation.findUnique({
                where: {
                    trainingId_playerId: {
                        trainingId: trainingId,
                        playerId: playerId,
                    },
                },
            });

            if (!participation) {
                return res.status(404).json({ error: "Participation not found" });
            }

            return res.status(200).json(participation);
        }

        if (method === "DELETE") {
            await prisma.trainingParticipation.delete({
                where: {
                    trainingId_playerId: {
                        trainingId: trainingId,
                        playerId: playerId,
                    },
                },
            });

            return res.status(204).end();
        }

        res.setHeader("Allow", ["GET", "DELETE"]);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    } catch (error) {
        console.error(`Error handling player training participation (${method}):`, error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

// Export with auth middleware
export default (req: NextApiRequest, res: NextApiResponse) => withAuth(req, res, playerParticipationHandler);
