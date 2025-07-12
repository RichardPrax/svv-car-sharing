// src/hooks/rides/useRides.tsx
import { useEffect, useState, useCallback } from "react";
import { RideWithDetails } from "@/entities/Ride";
import { UserProfile } from "@/entities/UserProfile";
import { MatchDay } from "@/entities/MatchDay";

interface UseRidesProps {
    matchId: string;
    refreshTrigger: number;
}

// API response type for rides
interface RideApiResponse {
    id: string;
    matchDayId: string;
    driverId: string;
    departureTime: string;
    departureLocation: string;
    availableSeats: number;
    additionalInfo: string | null;
    createdAt: string;
    updatedAt: string;
    driver: UserProfile;
    matchDay: MatchDay;
    passengers: Array<{
        id: string;
        rideId: string;
        passengerId: string;
        joinedAt: string;
        passenger: UserProfile;
    }>;
}

export function useRides({ matchId, refreshTrigger }: UseRidesProps) {
    const [rides, setRides] = useState<RideWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRides = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Lade Fahrten über die API-Route
            const response = await fetch(`/api/rides/by-match/${matchId}`);

            if (!response.ok) {
                throw new Error("Fehler beim Laden der Fahrten");
            }

            const ridesData: RideApiResponse[] = await response.json();

            // Transform API response to use proper RideWithDetails
            const ridesWithDetails: RideWithDetails[] = ridesData.map((ride) => ({
                id: ride.id,
                matchDayId: ride.matchDayId,
                driverId: ride.driverId,
                departureTime: new Date(ride.departureTime),
                departureLocation: ride.departureLocation,
                availableSeats: ride.availableSeats,
                additionalInfo: ride.additionalInfo,
                createdAt: new Date(ride.createdAt),
                updatedAt: new Date(ride.updatedAt),
                driver: ride.driver,
                matchDay: {
                    ...ride.matchDay,
                    date: new Date(ride.matchDay.date),
                },
                passengers: ride.passengers.map((p) => ({
                    id: p.id,
                    rideId: p.rideId,
                    passengerId: p.passengerId,
                    joinedAt: new Date(p.joinedAt),
                    passenger: p.passenger,
                })),
                passengerCount: ride.passengers.length,
                passengerNames: ride.passengers.map((p) => {
                    const fullName = `${p.passenger.firstName} ${p.passenger.lastName}`;
                    console.log(`Passenger ${p.passengerId}: firstName="${p.passenger.firstName}", lastName="${p.passenger.lastName}", fullName="${fullName}"`);
                    return fullName;
                }),
                driverName: `${ride.driver.firstName} ${ride.driver.lastName}`,
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

