// src/hooks/rides/useRideActions.tsx
import { useCallback } from "react";
import { useAuthenticatedFetch } from "@/hooks/auth/useAuthenticatedFetch";
import { Ride } from "@/entities/Ride";

interface UseRideActionsProps {
    currentUserId: string | null;
    matchId: string;
    onSuccess?: () => void;
}

export function useRideActions({ currentUserId, matchId, onSuccess }: UseRideActionsProps) {
    const { authenticatedFetch } = useAuthenticatedFetch();

    const joinRide = useCallback(
        async (rideId: string) => {
            if (!currentUserId) return { error: "Nicht angemeldet" };

            try {
                // 1. Überprüfe, ob User bereits Fahrer für diesen Spieltag ist
                const driverResponse = await authenticatedFetch(`/api/rides/driver/${currentUserId}`);
                if (!driverResponse.ok) {
                    throw new Error("Fehler beim Laden der Fahrerfahrten");
                }
                const existingDriverRides = await driverResponse.json();
                const hasExistingRide = existingDriverRides.some((ride: Ride) => ride.matchDayId === matchId);

                if (hasExistingRide) {
                    return { error: "Sie können sich nicht als Mitfahrer anmelden, da Sie bereits eine Fahrt anbieten" };
                }

                // 2. Überprüfe, ob User bereits als Mitfahrer in einer anderen Fahrt angemeldet ist
                const passengerResponse = await authenticatedFetch(`/api/rides/passenger/${currentUserId}`);
                if (!passengerResponse.ok) {
                    throw new Error("Fehler beim Laden der Mitfahrerfahrten");
                }
                const passengerRides = await passengerResponse.json();
                const isAlreadyPassenger = passengerRides.some((pr: { ride: Ride }) => pr.ride.matchDayId === matchId);

                if (isAlreadyPassenger) {
                    return { error: "Sie sind bereits als Mitfahrer in einer anderen Fahrt angemeldet" };
                }

                // 3. Jetzt zur Fahrt anmelden
                const joinResponse = await authenticatedFetch("/api/rides/actions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ rideId, userId: currentUserId }),
                });

                if (!joinResponse.ok) {
                    throw new Error("Fehler beim Beitreten zur Fahrt");
                }

                onSuccess?.();
                return { success: true };
            } catch (error) {
                console.error("Error joining ride:", error);
                return { error: "Ein unerwarteter Fehler ist aufgetreten" };
            }
        },
        [currentUserId, matchId, onSuccess, authenticatedFetch]
    );

    const leaveRide = useCallback(
        async (rideId: string) => {
            if (!currentUserId) return { error: "Nicht angemeldet" };

            try {
                const response = await authenticatedFetch("/api/rides/actions", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ rideId, userId: currentUserId }),
                });

                if (!response.ok) {
                    throw new Error("Fehler beim Verlassen der Fahrt");
                }

                onSuccess?.();
                return { success: true };
            } catch (error) {
                console.error("Error leaving ride:", error);
                return { error: "Ein unerwarteter Fehler ist aufgetreten" };
            }
        },
        [currentUserId, onSuccess, authenticatedFetch]
    );

    const deleteRide = useCallback(
        async (rideId: string) => {
            if (!currentUserId) return { error: "Nicht angemeldet" };

            try {
                const response = await authenticatedFetch(`/api/rides/${rideId}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    throw new Error("Fehler beim Löschen der Fahrt");
                }

                onSuccess?.();
                return { success: true };
            } catch (error) {
                console.error("Error deleting ride:", error);
                return { error: "Ein unerwarteter Fehler ist aufgetreten" };
            }
        },
        [currentUserId, onSuccess, authenticatedFetch]
    );

    return {
        joinRide,
        leaveRide,
        deleteRide,
    };
}
