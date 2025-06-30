// src/hooks/rides/useUserParticipationCheck.tsx
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { RideRepository } from "@/lib/repositories/rideRepository";

const rideRepository = new RideRepository();

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
            const passengerRides = await rideRepository.findByPassenger(session.user.id);
            const participationInMatch = passengerRides.find((pr) => pr.ride.matchDayId === matchId);

            const hasParticipation = !!participationInMatch;
            setIsParticipating(hasParticipation);
            setParticipatingRideId(hasParticipation ? participationInMatch.rideId : null);
        } catch (err) {
            console.error("Error checking participation:", err);
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
