// src/pages/api/matches/[matchId]/bring-items.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/authMiddleware";

async function bringItemsHandler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const { matchId } = req.query;

    if (typeof matchId !== "string") {
        res.status(400).json({ error: "Invalid match ID" });
        return;
    }

    switch (req.method) {
        case "GET":
            await handleGet(req, res, matchId);
            break;
        case "POST":
            // POST requires authentication
            return withAuth(req, res, async (authReq: AuthenticatedRequest, authRes: NextApiResponse) => {
                await handlePost(authReq, authRes, matchId);
            });
        default:
            res.setHeader("Allow", ["GET", "POST"]);
            res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse, matchId: string): Promise<void> {
    try {
        const bringItems = await prisma.bringItem.findMany({
            where: {
                matchDayId: matchId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        res.status(200).json(bringItems);
    } catch (error) {
        console.error("Error fetching bring items:", error);
        res.status(500).json({ error: "Failed to fetch bring items" });
    }
}

async function handlePost(req: AuthenticatedRequest, res: NextApiResponse, matchId: string): Promise<void> {
    try {
        // User is already authenticated via middleware
        const { user } = req;
        const { userId, itemName, description } = req.body;

        if (!userId || !itemName) {
            res.status(400).json({ error: "User ID and item name are required" });
            return;
        }

        // Sicherheitsprüfung: Nur der authentifizierte User kann Items für sich erstellen
        if (userId !== user.id) {
            res.status(403).json({ error: "Sie können nur Items für sich selbst erstellen" });
            return;
        }

        // Verify that the match exists
        const matchDay = await prisma.matchDay.findUnique({
            where: { id: matchId },
        });

        if (!matchDay) {
            res.status(404).json({ error: "Match not found" });
            return;
        }

        // User exists check is no longer needed since we have authenticated user
        // from middleware and already validated userId === user.id

        const newBringItem = await prisma.bringItem.create({
            data: {
                matchDayId: matchId,
                userId: userId,
                itemName: itemName.trim(),
                description: description?.trim() || null,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        res.status(201).json(newBringItem);
    } catch (error) {
        console.error("Error creating bring item:", error);
        res.status(500).json({ error: "Failed to create bring item" });
    }
}

// Export the handler directly (no auth middleware for the route)
export default bringItemsHandler;

