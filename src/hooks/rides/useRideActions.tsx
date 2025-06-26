// src/hooks/rides/useRideActions.tsx
import { useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

interface UseRideActionsProps {
    currentUserId: string | null;
    onSuccess?: () => void;
}

export function useRideActions({ currentUserId, onSuccess }: UseRideActionsProps) {
    const joinRide = useCallback(
        async (rideId: string) => {
            if (!currentUserId) return { error: "Nicht angemeldet" };

            try {
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
        [currentUserId, onSuccess]
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

    return {
        joinRide,
        leaveRide,
    };
}
