// src/hooks/rides/useUserRideCheck.tsx
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface UseUserRideCheckProps {
    matchId: string | string[] | undefined;
    refreshTrigger?: number;
}

export function useUserRideCheck({ matchId, refreshTrigger }: UseUserRideCheckProps) {
    const [hasExistingRide, setHasExistingRide] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const checkExistingRide = async () => {
        // Warte bis matchId verfügbar ist
        if (!matchId || Array.isArray(matchId)) {
            setLoading(true);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                setHasExistingRide(false);
                setLoading(false);
                return;
            }

            const { data: existingRides, error: checkError } = await supabase.from("rides").select("id").eq("match_day_id", matchId).eq("driver_id", session.user.id);

            if (checkError) {
                console.error("Error checking existing rides:", checkError);
                setError("Fehler beim Überprüfen bestehender Fahrten");
                return;
            }

            setHasExistingRide(existingRides.length > 0);
        } catch (err) {
            console.error("Error:", err);
            setError("Ein unerwarteter Fehler ist aufgetreten");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (matchId && !Array.isArray(matchId)) {
            checkExistingRide();
        }
    }, [matchId, refreshTrigger]);

    return {
        hasExistingRide,
        loading,
        error,
        recheckExistingRide: checkExistingRide,
    };
}

