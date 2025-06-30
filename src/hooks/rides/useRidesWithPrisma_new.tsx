// src/hooks/rides/useRidesWithPrisma.tsx
import { useState, useEffect } from "react";
import { rideRepository } from "../../lib/repositories";

// Example hook showing how to use the new Prisma-based repositories
export function useRidesWithPrisma(matchDayId?: string) {
    const [rides, setRides] = useState<unknown[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRides() {
            try {
                setLoading(true);
                setError(null);

                let ridesData;
                if (matchDayId) {
                    ridesData = await rideRepository.findByMatchDay(matchDayId);
                } else {
                    ridesData = await rideRepository.findAllWithDetails();
                }

                setRides(ridesData);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch rides");
            } finally {
                setLoading(false);
            }
        }

        fetchRides();
    }, [matchDayId]);

    const addPassenger = async (rideId: string, passengerId: string) => {
        try {
            await rideRepository.addPassenger(rideId, passengerId);
            // Refresh rides data
            const updatedRides = matchDayId ? await rideRepository.findByMatchDay(matchDayId) : await rideRepository.findAllWithDetails();
            setRides(updatedRides);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add passenger");
        }
    };

    const removePassenger = async (rideId: string, passengerId: string) => {
        try {
            await rideRepository.removePassenger(rideId, passengerId);
            // Refresh rides data
            const updatedRides = matchDayId ? await rideRepository.findByMatchDay(matchDayId) : await rideRepository.findAllWithDetails();
            setRides(updatedRides);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to remove passenger");
        }
    };

    const createRide = async (rideData: unknown) => {
        try {
            await rideRepository.create(rideData as never);
            // Refresh rides data
            const updatedRides = matchDayId ? await rideRepository.findByMatchDay(matchDayId) : await rideRepository.findAllWithDetails();
            setRides(updatedRides);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create ride");
        }
    };

    return {
        rides,
        loading,
        error,
        addPassenger,
        removePassenger,
        createRide,
        refetch: () => {
            // Trigger re-fetch
            setLoading(true);
        },
    };
}
