// src/pages/api/matches/[matchId]/bring-items.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { matchId } = req.query;

    if (typeof matchId !== "string") {
        return res.status(400).json({ error: "Invalid match ID" });
    }

    switch (req.method) {
        case "GET":
            return handleGet(req, res, matchId);
        case "POST":
            return handlePost(req, res, matchId);
        default:
            res.setHeader("Allow", ["GET", "POST"]);
            return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse, matchId: string) {
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

        return res.status(200).json(bringItems);
    } catch (error) {
        console.error("Error fetching bring items:", error);
        return res.status(500).json({ error: "Failed to fetch bring items" });
    }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse, matchId: string) {
    try {
        const { userId, itemName, description } = req.body;

        if (!userId || !itemName) {
            return res.status(400).json({ error: "User ID and item name are required" });
        }

        // Verify that the match exists
        const matchDay = await prisma.matchDay.findUnique({
            where: { id: matchId },
        });

        if (!matchDay) {
            return res.status(404).json({ error: "Match not found" });
        }

        // Verify that the user exists
        const user = await prisma.userProfile.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

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

        return res.status(201).json(newBringItem);
    } catch (error) {
        console.error("Error creating bring item:", error);
        return res.status(500).json({ error: "Failed to create bring item" });
    }
}

