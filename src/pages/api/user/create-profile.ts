import { NextApiRequest, NextApiResponse } from "next";
import { UserProfileRepository } from "@/lib/repositories/userProfileRepository";

const userProfileRepository = new UserProfileRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { userId, firstName, lastName } = req.body;

        // Validierung
        if (!userId || !firstName || !lastName) {
            return res.status(400).json({ error: "userId, firstName und lastName sind erforderlich" });
        }

        // Prüfen ob der User bereits ein Profil hat
        const existingProfile = await userProfileRepository.findById(userId);
        if (existingProfile) {
            return res.status(200).json({ message: "Profile already exists", profile: existingProfile });
        }

        // User-Profil erstellen
        const userProfile = await userProfileRepository.createWithId({
            id: userId,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
        });

        console.log("User profile created:", userProfile);
        return res.status(201).json({ message: "User profile created successfully", profile: userProfile });
    } catch (error) {
        console.error("Error creating user profile:", error);
        return res.status(500).json({ error: "Failed to create user profile" });
    }
}

