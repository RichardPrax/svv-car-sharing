// src/hooks/rides/useRideActions.tsx
import { useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

interface UseRideActionsProps {
    currentUserId: string | null;
    matchId: string;
    onSuccess?: () => void;
}

export function useRideActions({ currentUserId, matchId, onSuccess }: UseRideActionsProps) {
    const joinRide = useCallback(
        async (rideId: string) => {
            if (!currentUserId) return { error: "Nicht angemeldet" };

            try {
                // 1. Überprüfe, ob User bereits Fahrer für diesen Spieltag ist
                const { data: existingDriverRides, error: driverCheckError } = await supabase.from("rides").select("id").eq("match_day_id", matchId).eq("driver_id", currentUserId);

                if (driverCheckError) {
                    console.error("Error checking driver status:", driverCheckError);
                    return { error: "Fehler beim Überprüfen des Fahrer-Status" };
                }

                if (existingDriverRides.length > 0) {
                    return { error: "Sie können sich nicht als Mitfahrer anmelden, da Sie bereits eine Fahrt anbieten" };
                }

                // 2. Überprüfe, ob User bereits als Mitfahrer in einer anderen Fahrt angemeldet ist
                const { data: existingParticipations, error: participationCheckError } = await supabase
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
                    .eq("passenger_id", currentUserId)
                    .eq("rides.match_day_id", matchId);

                if (participationCheckError) {
                    console.error("Error checking participation:", participationCheckError);
                    return { error: "Fehler beim Überprüfen der Teilnahme" };
                }

                if (existingParticipations.length > 0) {
                    return { error: "Sie sind bereits als Mitfahrer in einer anderen Fahrt angemeldet" };
                }

                // 3. Jetzt zur Fahrt anmelden
                const { error } = await supabase.from("ride_passengers").insert({
                    ride_id: rideId,
                    passenger_id: currentUserId,
                });

                if (error) {
                    console.error("Error joining ride:", error);
                    return { error: "Fehler beim Beitreten" };
                }

                onSuccess?.();
                return { success: true };
            } catch (error) {
                console.error("Error:", error);
                return { error: "Ein unerwarteter Fehler ist aufgetreten" };
            }
        },
        [currentUserId, matchId, onSuccess]
    );

    const leaveRide = useCallback(
        async (rideId: string) => {
            if (!currentUserId) return { error: "Nicht angemeldet" };

            try {
                const { error } = await supabase.from("ride_passengers").delete().eq("ride_id", rideId).eq("passenger_id", currentUserId);

                if (error) {
                    console.error("Error leaving ride:", error);
                    return { error: "Fehler beim Verlassen" };
                }

                onSuccess?.();
                return { success: true };
            } catch (error) {
                console.error("Error:", error);
                return { error: "Ein unerwarteter Fehler ist aufgetreten" };
            }
        },
        [currentUserId, onSuccess]
    );

    const deleteRide = useCallback(
        async (rideId: string) => {
            if (!currentUserId) return { error: "Nicht angemeldet" };

            try {
                // Zuerst alle Mitfahrer entfernen
                const { error: passengersError } = await supabase.from("ride_passengers").delete().eq("ride_id", rideId);

                if (passengersError) {
                    console.error("Error deleting passengers:", passengersError);
                    return { error: "Fehler beim Löschen der Mitfahrer" };
                }

                // Dann die Fahrt löschen
                const { error: rideError } = await supabase.from("rides").delete().eq("id", rideId);

                if (rideError) {
                    console.error("Error deleting ride:", rideError);
                    return { error: "Fehler beim Löschen der Fahrt" };
                }

                onSuccess?.();
                return { success: true };
            } catch (error) {
                console.error("Error:", error);
                return { error: "Ein unerwarteter Fehler ist aufgetreten" };
            }
        },
        [currentUserId, onSuccess]
    );

    return {
        joinRide,
        leaveRide,
        deleteRide,
    };
}

