// src/hooks/rides/useUserParticipationCheck.tsx
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

interface UseUserParticipationCheckProps {
    matchId: string | string[] | undefined;
    refreshTrigger?: number;
}

export function useUserParticipationCheck({ matchId, refreshTrigger }: UseUserParticipationCheckProps) {
    const [isParticipating, setIsParticipating] = useState(false);
    const [participatingRideId, setParticipatingRideId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const checkParticipation = useCallback(async () => {
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
                setIsParticipating(false);
                setParticipatingRideId(null);
                setLoading(false);
                return;
            }

            // Überprüfe, ob User als Mitfahrer in einer Fahrt für diesen Spieltag angemeldet ist
            const { data: participations, error: checkError } = await supabase
                .from("ride_passengers")
                .select(
                    `
          id,
          ride_id,
          rides!inner (
            id,
            match_day_id
          )
        `
                )
                .eq("passenger_id", session.user.id)
                .eq("rides.match_day_id", matchId);

            if (checkError) {
                console.error("Error checking participation:", checkError);
                setError("Fehler beim Überprüfen der Teilnahme");
                return;
            }

            const hasParticipation = participations.length > 0;
            setIsParticipating(hasParticipation);
            setParticipatingRideId(hasParticipation ? participations[0].ride_id : null);
        } catch (err) {
            console.error("Error:", err);
            setError("Ein unerwarteter Fehler ist aufgetreten");
        } finally {
            setLoading(false);
        }
    }, [matchId]);

    useEffect(() => {
        if (matchId && !Array.isArray(matchId)) {
            checkParticipation();
        }
    }, [matchId, refreshTrigger, checkParticipation]);

    return {
        isParticipating,
        participatingRideId,
        loading,
        error,
        recheckParticipation: checkParticipation,
    };
}

