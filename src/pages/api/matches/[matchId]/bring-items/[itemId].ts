// src/pages/api/matches/[matchId]/bring-items/[itemId].ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { matchId, itemId } = req.query;

    if (typeof matchId !== "string" || typeof itemId !== "string") {
        return res.status(400).json({ error: "Invalid match ID or item ID" });
    }

    switch (req.method) {
        case "DELETE":
            return handleDelete(req, res, matchId, itemId);
        default:
            res.setHeader("Allow", ["DELETE"]);
            return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse, matchId: string, itemId: string) {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Find the bring item to verify it exists and belongs to the user
        const bringItem = await prisma.bringItem.findUnique({
            where: { id: itemId },
        });

        if (!bringItem) {
            return res.status(404).json({ error: "Bring item not found" });
        }

        // Verify the item belongs to the correct match
        if (bringItem.matchDayId !== matchId) {
            return res.status(400).json({ error: "Item does not belong to this match" });
        }

        // Verify the item belongs to the user (only the creator can delete)
        if (bringItem.userId !== userId) {
            return res.status(403).json({ error: "You can only delete your own items" });
        }

        await prisma.bringItem.delete({
            where: { id: itemId },
        });

        return res.status(200).json({ message: "Bring item deleted successfully" });
    } catch (error) {
        console.error("Error deleting bring item:", error);
        return res.status(500).json({ error: "Failed to delete bring item" });
    }
}

