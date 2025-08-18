import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabaseClient";
import { UserProfileRepository } from "@/lib/repositories/userProfileRepository";
import { GameParticipationStatus } from "@prisma/client";

const userProfileRepository = new UserProfileRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // Check authentication
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "No valid authorization token provided" });
        }

        const token = authHeader.split(" ")[1];
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        const { matchId } = req.query;
        const { status, reason } = req.body;

        if (!matchId || typeof matchId !== "string") {
            return res.status(400).json({ error: "Invalid match ID" });
        }

        if (!status || !["JOINING", "DECLINING", "TENTATIVE"].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        // Bei DECLINING und TENTATIVE ist ein Grund erforderlich
        if ((status === "DECLINING" || status === "TENTATIVE") && (!reason || reason.trim().length === 0)) {
            const statusText = status === "DECLINING" ? "Absage" : "unsicheren Teilnahme";
            return res.status(400).json({ error: `Bei einer ${statusText} muss ein Grund angegeben werden` });
        }

        // Bei JOINING sollte kein Grund angegeben werden
        if (status === "JOINING" && reason && reason.trim().length > 0) {
            return res.status(400).json({ error: "Bei einer Zusage kann kein Grund angegeben werden" });
        }

        // Check if match day exists
        const matchDay = await prisma.matchDay.findUnique({
            where: { id: matchId },
        });

        if (!matchDay) {
            return res.status(404).json({ error: "Match day not found" });
        }

        // Check if user has player role
        const userProfile = await userProfileRepository.findById(user.id);

        if (!userProfile || (userProfile.role !== "PLAYER" && userProfile.role !== "USER" && userProfile.role !== "ADMIN")) {
            return res.status(403).json({ error: "Only players, users, and admins can participate in games" });
        }

        // Upsert participation (create or update)
        const participation = await prisma.gameParticipation.upsert({
            where: {
                matchDayId_playerId: {
                    matchDayId: matchId,
                    playerId: user.id,
                },
            },
            update: {
                status: status as GameParticipationStatus,
                reason: status !== "JOINING" ? reason : null, // Grund bei DECLINING und TENTATIVE speichern
                updatedAt: new Date(),
            },
            create: {
                matchDayId: matchId,
                playerId: user.id,
                status: status as GameParticipationStatus,
                reason: status !== "JOINING" ? reason : null, // Grund bei DECLINING und TENTATIVE speichern
            },
        });

        return res.status(200).json(participation);
    } catch (error) {
        console.error("Error handling participation:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

