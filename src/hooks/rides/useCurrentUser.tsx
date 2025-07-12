// src/hooks/rides/useCurrentUser.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useCurrentUser() {
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();
                setCurrentUserId(session?.user?.id || null);
            } catch (error) {
                console.error("Error getting current user:", error);
            } finally {
                setLoading(false);
            }
        };

        getCurrentUser();
    }, []);

    return { currentUserId, loading };
}
