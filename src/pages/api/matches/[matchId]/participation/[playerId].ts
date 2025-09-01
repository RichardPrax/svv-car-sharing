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

        const { matchId, playerId } = req.query;

        if (!matchId || typeof matchId !== "string") {
            return res.status(400).json({ error: "Invalid match ID" });
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
            const participation = await prisma.gameParticipation.findUnique({
                where: {
                    matchDayId_playerId: {
                        matchDayId: matchId,
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
            await prisma.gameParticipation.delete({
                where: {
                    matchDayId_playerId: {
                        matchDayId: matchId,
                        playerId: playerId,
                    },
                },
            });

            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: "Method not allowed" });
    } catch (error) {
        console.error("Error handling participation:", error);

        // Handle specific Prisma errors
        if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
            return res.status(404).json({ error: "Participation not found" });
        }

        return res.status(500).json({ error: "Internal server error" });
    }
}

// Export with auth middleware
export default (req: NextApiRequest, res: NextApiResponse) => 
    withAuth(req, res, playerParticipationHandler);

