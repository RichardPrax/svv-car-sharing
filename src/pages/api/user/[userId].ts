import { NextApiRequest, NextApiResponse } from "next";
import { UserProfileRepository } from "@/lib/repositories/userProfileRepository";

const userProfileRepository = new UserProfileRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const { userId } = req.query;

            if (!userId || typeof userId !== "string") {
                return res.status(400).json({ error: "User ID ist erforderlich" });
            }

            const userProfile = await userProfileRepository.findById(userId);

            if (!userProfile) {
                return res.status(404).json({ error: "Benutzerprofil nicht gefunden" });
            }

            res.status(200).json(userProfile);
        } catch (error) {
            console.error("Fehler beim Laden des Benutzerprofils:", error);
            res.status(500).json({ error: "Fehler beim Laden des Benutzerprofils" });
        }
    } else if (req.method === "POST") {
        try {
            const profileData = req.body;

            // Validierung
            if (!profileData.firstName || !profileData.lastName) {
                return res.status(400).json({ error: "Vor- und Nachname sind erforderlich" });
            }

            const newProfile = await userProfileRepository.create(profileData);
            res.status(201).json(newProfile);
        } catch (error) {
            console.error("Fehler beim Erstellen des Benutzerprofils:", error);
            res.status(500).json({ error: "Fehler beim Erstellen des Benutzerprofils" });
        }
    } else {
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
