// src/hooks/auth/useUserProfile.tsx
import { useState, useEffect } from "react";
import { UserProfile } from "@/entities/UserProfile";

export function useUserProfile(userId?: string) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProfile() {
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/user/${userId}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        setProfile(null);
                        return;
                    }
                    throw new Error("Fehler beim Laden des Benutzerprofils");
                }

                const userProfile = await response.json();
                setProfile(userProfile);
            } catch (err) {
                console.error("Error fetching user profile:", err);
                setError("Fehler beim Laden des Benutzerprofils");
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [userId]);

    return { profile, loading, error };
}

export function useUserProfiles(userIds: string[]) {
    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProfiles() {
            if (userIds.length === 0) {
                setProfiles([]);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch("/api/user/profiles", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userIds }),
                });

                if (!response.ok) {
                    throw new Error("Fehler beim Laden der Benutzerprofile");
                }

                const userProfiles = await response.json();
                setProfiles(userProfiles);
            } catch (err) {
                console.error("Error fetching user profiles:", err);
                setError("Fehler beim Laden der Benutzerprofile");
            } finally {
                setLoading(false);
            }
        }

        fetchProfiles();
    }, [userIds]);

    const getProfileName = (userId: string): string => {
        const profile = profiles.find((p) => p.id === userId);
        if (profile) {
            return `${profile.firstName} ${profile.lastName}`;
        }
        return userId.substring(0, 8) + "..."; // Fallback
    };

    return { profiles, loading, error, getProfileName };
}
