// src/hooks/auth/useUserProfile.tsx
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
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
                const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single();

                if (error) {
                    console.error("Error fetching user profile:", error);
                    setError("Fehler beim Laden des Benutzerprofils");
                } else {
                    setProfile(data);
                }
            } catch (err) {
                console.error("Error:", err);
                setError("Ein unerwarteter Fehler ist aufgetreten");
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
                const { data, error } = await supabase.from("user_profiles").select("*").in("id", userIds);

                if (error) {
                    console.error("Error fetching user profiles:", error);
                    setError("Fehler beim Laden der Benutzerprofile");
                } else {
                    setProfiles(data || []);
                }
            } catch (err) {
                console.error("Error:", err);
                setError("Ein unerwarteter Fehler ist aufgetreten");
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

