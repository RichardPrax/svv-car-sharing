// src/hooks/rides/useRideActions.tsx
import { useCallback } from "react";
import { RideRepository } from "@/lib/repositories/rideRepository";

const rideRepository = new RideRepository();

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
                const existingDriverRides = await rideRepository.findByDriver(currentUserId);
                const hasExistingRide = existingDriverRides.some((ride) => ride.matchDayId === matchId);

                if (hasExistingRide) {
                    return { error: "Sie können sich nicht als Mitfahrer anmelden, da Sie bereits eine Fahrt anbieten" };
                }

                // 2. Überprüfe, ob User bereits als Mitfahrer in einer anderen Fahrt angemeldet ist
                const isAlreadyPassenger = await rideRepository.isPassengerInMatchDay(matchId, currentUserId);

                if (isAlreadyPassenger) {
                    return { error: "Sie sind bereits als Mitfahrer in einer anderen Fahrt angemeldet" };
                }

                // 3. Jetzt zur Fahrt anmelden
                await rideRepository.addPassenger(rideId, currentUserId);

                onSuccess?.();
                return { success: true };
            } catch (error) {
                console.error("Error joining ride:", error);
                return { error: "Ein unerwarteter Fehler ist aufgetreten" };
            }
        },
        [currentUserId, matchId, onSuccess]
    );

    const leaveRide = useCallback(
        async (rideId: string) => {
            if (!currentUserId) return { error: "Nicht angemeldet" };

            try {
                await rideRepository.removePassenger(rideId, currentUserId);

                onSuccess?.();
                return { success: true };
            } catch (error) {
                console.error("Error leaving ride:", error);
                return { error: "Ein unerwarteter Fehler ist aufgetreten" };
            }
        },
        [currentUserId, onSuccess]
    );

    const deleteRide = useCallback(
        async (rideId: string) => {
            if (!currentUserId) return { error: "Nicht angemeldet" };

            try {
                // Prisma wird automatisch die Mitfahrer löschen (CASCADE)
                await rideRepository.delete(rideId);

                onSuccess?.();
                return { success: true };
            } catch (error) {
                console.error("Error deleting ride:", error);
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
