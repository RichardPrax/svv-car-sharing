import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabaseClient";
import { UserProfileRepository } from "@/lib/repositories/userProfileRepository";

const userProfileRepository = new UserProfileRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
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

        const { matchIds } = req.query;

        if (!matchIds || typeof matchIds !== "string") {
            return res.status(400).json({ error: "Match IDs are required" });
        }

        const matchIdArray = matchIds.split(",").filter(id => id.trim());

        if (matchIdArray.length === 0) {
            return res.status(400).json({ error: "At least one match ID is required" });
        }

        // Check if user has player role
        const userProfile = await userProfileRepository.findById(user.id);

        if (!userProfile || (userProfile.role !== "PLAYER" && userProfile.role !== "USER" && userProfile.role !== "ADMIN")) {
            return res.status(403).json({ error: "Only players, users, and admins can participate in games" });
        }

        // Get all participations for this user across the specified matches
        const participations = await prisma.gameParticipation.findMany({
            where: {
                matchDayId: { in: matchIdArray },
                playerId: user.id,
            },
            orderBy: { updatedAt: "desc" },
        });

        // Create a map of matchId to participation
        const participationByMatch: Record<string, any> = {};
        
        for (const matchId of matchIdArray) {
            const participation = participations.find(p => p.matchDayId === matchId);
            participationByMatch[matchId] = participation || null;
        }

        res.status(200).json(participationByMatch);
    } catch (error) {
        console.error("Error fetching user participation batch:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
