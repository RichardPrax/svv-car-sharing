import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/authMiddleware";
import { UserProfileRepository } from "@/lib/repositories/userProfileRepository";

const userProfileRepository = new UserProfileRepository();

async function playerParticipationHandler(req: AuthenticatedRequest, res: NextApiResponse): Promise<void> {
    const { method } = req;

    try {
        // User is already authenticated via middleware
        const { user } = req;

        const { trainingId, playerId } = req.query;

        if (!trainingId || typeof trainingId !== "string") {
            res.status(400).json({ error: "Invalid training ID" });
            return;
        }

        if (!playerId || typeof playerId !== "string") {
            res.status(400).json({ error: "Invalid player ID" });
            return;
        }

        // Check if user is requesting their own participation or is admin
        const userProfile = await userProfileRepository.findById(user.id);

        if (!userProfile) {
            res.status(404).json({ error: "User profile not found" });
            return;
        }

        const isOwnParticipation = user.id === playerId;
        const isAdmin = userProfile.role === "ADMIN";

        if (!isOwnParticipation && !isAdmin) {
            res.status(403).json({ error: "Forbidden" });
            return;
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
                res.status(404).json({ error: "Participation not found" });
                return;
            }

            res.status(200).json(participation);
            return;
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

            res.status(204).end();
            return;
        }

        res.setHeader("Allow", ["GET", "DELETE"]);
        res.status(405).json({ error: `Method ${method} Not Allowed` });
    } catch (error) {
        console.error(`Error handling player training participation (${method}):`, error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// Export with auth middleware
const handler = (req: NextApiRequest, res: NextApiResponse) => withAuth(req, res, playerParticipationHandler);

export default handler;
