// src/hooks/rides/useRides.tsx
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { RideWithDetails } from "@/entities/Ride";

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
            // Lade Fahrten mit Mitfahrer-Details
            const { data: ridesData, error: ridesError } = await supabase
                .from("rides")
                .select(
                    `
          *,
          ride_passengers (
            id,
            passenger_id,
            joined_at
          )
        `
                )
                .eq("match_day_id", matchId)
                .order("departure_time", { ascending: true });

            if (ridesError) {
                console.error("Error fetching rides:", ridesError);
                setError("Fehler beim Laden der Fahrten");
                return;
            }

            // Sammle alle User IDs
            const driverIds = ridesData.map((ride) => ride.driver_id);
            const passengerIds = ridesData.flatMap((ride) => ride.ride_passengers?.map((p: { passenger_id: string }) => p.passenger_id) || []);
            const uniqueUserIds = [...new Set([...driverIds, ...passengerIds])];

            // Lade Benutzerprofile für alle beteiligten User
            let profiles: { id: string; first_name: string; last_name: string }[] = [];
            if (uniqueUserIds.length > 0) {
                const { data: profilesData, error: profilesError } = await supabase.from("user_profiles").select("*").in("id", uniqueUserIds);

                if (profilesError) {
                    console.error("Error fetching profiles:", profilesError);
                } else {
                    profiles = profilesData || [];
                }
            }

            // Hilfsfunktion für Namen
            const getNameForUser = (userId: string): string => {
                const profile = profiles.find((p) => p.id === userId);
                if (profile) {
                    return `${profile.first_name} ${profile.last_name}`;
                }
                return userId.substring(0, 8) + "..."; // Fallback
            };

            // Erstelle RideWithDetails mit echten Namen
            const ridesWithDetails: RideWithDetails[] = ridesData.map((ride) => ({
                ...ride,
                passenger_count: ride.ride_passengers?.length || 0,
                passengers: ride.ride_passengers || [],
                driver_name: getNameForUser(ride.driver_id),
                passenger_names: ride.ride_passengers?.map((p: { passenger_id: string }) => getNameForUser(p.passenger_id)) || [],
            }));

            setRides(ridesWithDetails);
        } catch (error) {
            console.error("Error:", error);
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

