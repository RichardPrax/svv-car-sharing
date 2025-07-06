import { NextApiRequest, NextApiResponse } from "next";
import { UserProfileRepository } from "@/lib/repositories/userProfileRepository";

const userProfileRepository = new UserProfileRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { record, type } = req.body;

        // Nur auf user.created Events reagieren
        if (type !== "INSERT") {
            return res.status(200).json({ message: "Event ignored" });
        }

        // Prüfen ob der User bereits ein Profil hat
        const existingProfile = await userProfileRepository.findById(record.id);
        if (existingProfile) {
            return res.status(200).json({ message: "Profile already exists" });
        }

        // User-Profil erstellen
        const userProfile = await userProfileRepository.createWithId({
            id: record.id, // Supabase User ID verwenden
            firstName: record.raw_user_meta_data?.first_name || "",
            lastName: record.raw_user_meta_data?.last_name || "",
        });

        console.log("User profile created:", userProfile);
        return res.status(201).json({ message: "User profile created successfully", profile: userProfile });
    } catch (error) {
        console.error("Error creating user profile:", error);
        return res.status(500).json({ error: "Failed to create user profile" });
    }
}

