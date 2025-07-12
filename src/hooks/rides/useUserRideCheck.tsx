// src/hooks/rides/useUserRideCheck.tsx
import { useState, useEffect, useCallback } from "react";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";
import { Ride } from "@/entities/Ride";

interface UseUserRideCheckProps {
    matchId: string | string[] | undefined;
    refreshTrigger?: number;
}

export function useUserRideCheck({ matchId, refreshTrigger }: UseUserRideCheckProps) {
    const [hasExistingRide, setHasExistingRide] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useOptimizedAuth();

    const checkExistingRide = useCallback(async () => {
        // Warte bis matchId verfügbar ist
        if (!matchId || Array.isArray(matchId)) {
            setLoading(true);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (!user) {
                setHasExistingRide(false);
                setLoading(false);
                return;
            }

            // Lade Fahrten über die API-Route
            const response = await fetch(`/api/rides/driver/${user.id}`);

            if (!response.ok) {
                throw new Error("Fehler beim Laden der Fahrerfahrten");
            }

            const existingRides = await response.json();
            const hasRideForMatch = existingRides.some((ride: Ride) => ride.matchDayId === matchId);

            setHasExistingRide(hasRideForMatch);
        } catch (err) {
            console.error("Error checking existing rides:", err);
            setError("Ein unerwarteter Fehler ist aufgetreten");
        } finally {
            setLoading(false);
        }
    }, [matchId, user]);

    useEffect(() => {
        if (matchId && !Array.isArray(matchId)) {
            checkExistingRide();
        }
    }, [matchId, refreshTrigger, checkExistingRide]);

    return {
        hasExistingRide,
        loading,
        error,
        recheckExistingRide: checkExistingRide,
    };
}

