// src/hooks/rides/useUserParticipationCheck.tsx
import { useState, useEffect, useCallback } from "react";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";
import { Ride } from "@/entities/Ride";

interface UseUserParticipationCheckProps {
    matchId: string | string[] | undefined;
    refreshTrigger?: number;
}

export function useUserParticipationCheck({ matchId, refreshTrigger }: UseUserParticipationCheckProps) {
    const [isParticipating, setIsParticipating] = useState(false);
    const [participatingRideId, setParticipatingRideId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useOptimizedAuth();

    const checkParticipation = useCallback(async () => {
        // Warte bis matchId verfügbar ist
        if (!matchId || Array.isArray(matchId)) {
            setLoading(true);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (!user) {
                setIsParticipating(false);
                setParticipatingRideId(null);
                setLoading(false);
                return;
            }

            // Überprüfe, ob User als Mitfahrer in einer Fahrt für diesen Spieltag angemeldet ist
            const response = await fetch(`/api/rides/passenger/${user.id}`);

            if (!response.ok) {
                throw new Error("Fehler beim Laden der Mitfahrerfahrten");
            }

            const passengerRides = await response.json();
            const participationInMatch = passengerRides.find((pr: { ride: Ride; rideId: string }) => pr.ride.matchDayId === matchId);

            const hasParticipation = !!participationInMatch;
            setIsParticipating(hasParticipation);
            setParticipatingRideId(hasParticipation ? participationInMatch.rideId : null);
        } catch (err) {
            console.error("Error checking participation:", err);
            setError("Ein unerwarteter Fehler ist aufgetreten");
        } finally {
            setLoading(false);
        }
    }, [matchId, user]);

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

