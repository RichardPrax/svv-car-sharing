// src/pages/api/matches/[matchId]/bring-items/[itemId].ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/authMiddleware";

async function bringItemHandler(req: AuthenticatedRequest, res: NextApiResponse): Promise<void> {
    const { matchId, itemId } = req.query;

    if (typeof matchId !== "string" || typeof itemId !== "string") {
        res.status(400).json({ error: "Invalid match ID or item ID" });
        return;
    }

    switch (req.method) {
        case "DELETE":
            await handleDelete(req, res, matchId, itemId);
            break;
        default:
            res.setHeader("Allow", ["DELETE"]);
            res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}

async function handleDelete(req: AuthenticatedRequest, res: NextApiResponse, matchId: string, itemId: string): Promise<void> {
    try {
        // User is already authenticated via middleware
        const { user } = req;
        const { userId } = req.body;

        if (!userId) {
            res.status(400).json({ error: "User ID is required" });
            return;
        }

        // Sicherheitsprüfung: Nur der authentifizierte User kann seine eigenen Items löschen
        if (userId !== user.id) {
            res.status(403).json({ error: "Sie können nur Ihre eigenen Items löschen" });
            return;
        }

        // Find the bring item to verify it exists and belongs to the user
        const bringItem = await prisma.bringItem.findUnique({
            where: { id: itemId },
        });

        if (!bringItem) {
            res.status(404).json({ error: "Bring item not found" });
            return;
        }

        // Verify the item belongs to the correct match
        if (bringItem.matchDayId !== matchId) {
            res.status(400).json({ error: "Item does not belong to this match" });
            return;
        }

        // Verify the item belongs to the user (only the creator can delete)
        if (bringItem.userId !== userId) {
            res.status(403).json({ error: "You can only delete your own items" });
            return;
        }

        await prisma.bringItem.delete({
            where: { id: itemId },
        });

        res.status(200).json({ message: "Bring item deleted successfully" });
    } catch (error) {
        console.error("Error deleting bring item:", error);
        res.status(500).json({ error: "Failed to delete bring item" });
    }
}

// Export with auth middleware
const handler = (req: NextApiRequest, res: NextApiResponse) => 
    withAuth(req, res, bringItemHandler);

export default handler;

