// src/hooks/rides/useRides.tsx
import { useEffect, useState, useCallback } from "react";
import { RideWithDetails } from "@/entities/Ride";
import { RideRepository } from "@/lib/repositories/rideRepository";

const rideRepository = new RideRepository();

interface UseRidesProps {
    matchId: string;
    refreshTrigger: number;
}

export function useRides({ matchId, refreshTrigger }: UseRidesProps) {
    const [rides, setRides] = useState<RideWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRides = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Lade Fahrten mit allen Details über das Repository
            const ridesData = await rideRepository.findByMatchDay(matchId);

            // Transform the data to match RideWithDetails interface
            const ridesWithDetails: RideWithDetails[] = ridesData.map((ride) => ({
                id: ride.id,
                matchDayId: ride.matchDayId,
                driverId: ride.driverId,
                departureTime: ride.departureTime,
                departureLocation: ride.departureLocation,
                availableSeats: ride.availableSeats,
                additionalInfo: ride.additionalInfo,
                createdAt: ride.createdAt,
                updatedAt: ride.updatedAt,
                driver: ride.driver,
                matchDay: ride.matchDayId, // Use matchDayId instead of matchDay object
                passengers: ride.passengers,
                passengerCount: ride.passengers?.length || 0,
                passengerNames: [], // TODO: Fix typing for passenger names
            }));

            setRides(ridesWithDetails);
        } catch (error) {
            console.error("Error fetching rides:", error);
            setError("Ein unerwarteter Fehler ist aufgetreten");
        } finally {
            setLoading(false);
        }
    }, [matchId]);

    useEffect(() => {
        fetchRides();
    }, [fetchRides, refreshTrigger]);

    return {
        rides,
        loading,
        error,
        refetch: fetchRides,
    };
}
