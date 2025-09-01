// src/hooks/rides/useCreateRide.tsx
import { useState } from "react";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";
import { useAuthenticatedFetch } from "@/hooks/auth/useAuthenticatedFetch";
import { Ride } from "@/entities/Ride";

export interface CreateRideData {
    departureTime: string; // String for form input, will be converted to Date
    departureLocation: string;
    availableSeats: number;
    additionalInfo: string;
}

interface UseCreateRideProps {
    matchId: string;
    onSuccess: () => void;
}

export function useCreateRide({ matchId, onSuccess }: UseCreateRideProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useOptimizedAuth();
    const { authenticatedFetch } = useAuthenticatedFetch();
    const [formData, setFormData] = useState<CreateRideData>({
        departureTime: "",
        departureLocation: "",
        availableSeats: 1,
        additionalInfo: "",
    });

    const handleChange = (field: keyof CreateRideData, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await createRide(formData);
        return result;
    };

    const createRide = async (data: CreateRideData) => {
        setLoading(true);
        setError(null);

        try {
            if (!user) {
                setError("Sie müssen angemeldet sein");
                return { error: "Sie müssen angemeldet sein" };
            }

            // 1. Hole die Match-Day Daten um das Datum zu bekommen
            const matchResponse = await fetch(`/api/matches/${matchId}`);
            if (!matchResponse.ok) {
                throw new Error("Fehler beim Laden des Spieltags");
            }
            const matchDay = await matchResponse.json();

            // 2. Überprüfe, ob User bereits eine Fahrt als Fahrer für diesen Spieltag anbietet
            const driverResponse = await authenticatedFetch(`/api/rides/driver/${user.id}`);
            if (!driverResponse.ok) {
                throw new Error("Fehler beim Laden der Fahrerfahrten");
            }
            const existingDriverRides = await driverResponse.json();
            const hasExistingRide = existingDriverRides.some((ride: Ride) => ride.matchDayId === matchId);

            if (hasExistingRide) {
                setError("Sie können nur eine Fahrt pro Spieltag anbieten");
                return { error: "Sie können nur eine Fahrt pro Spieltag anbieten" };
            }

            // 3. Überprüfe, ob User bereits als Mitfahrer in einer anderen Fahrt angemeldet ist
            const passengerResponse = await authenticatedFetch(`/api/rides/passenger/${user.id}`);
            if (!passengerResponse.ok) {
                throw new Error("Fehler beim Laden der Mitfahrerfahrten");
            }
            const passengerRides = await passengerResponse.json();
            const isPassenger = passengerRides.some((pr: { ride: Ride }) => pr.ride.matchDayId === matchId);

            if (isPassenger) {
                setError("Sie können keine Fahrt anbieten, da Sie bereits als Mitfahrer in einer anderen Fahrt angemeldet sind");
                return { error: "Sie können keine Fahrt anbieten, da Sie bereits als Mitfahrer in einer anderen Fahrt angemeldet sind" };
            }

            // 4. Erstelle die neue Fahrt mit korrekter Datums/Zeit-Kombination
            const matchDate = new Date(matchDay.date);
            const [hours, minutes] = data.departureTime.split(":").map(Number);
            const departureDateTime = new Date(matchDate);
            departureDateTime.setHours(hours, minutes, 0, 0);

            const rideData = {
                matchDayId: matchId,
                driverId: user.id,
                departureTime: departureDateTime.toISOString(),
                departureLocation: data.departureLocation,
                availableSeats: data.availableSeats,
                additionalInfo: data.additionalInfo || null,
            };

            const createResponse = await authenticatedFetch("/api/rides/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(rideData),
            });

            if (!createResponse.ok) {
                throw new Error("Fehler beim Erstellen der Fahrt");
            }

            onSuccess();
            return { success: true };
        } catch (err) {
            console.error("Error creating ride:", err);
            const errorMessage = "Ein unerwarteter Fehler ist aufgetreten";
            setError(errorMessage);
            return { error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        loading,
        error,
        handleChange,
        handleSubmit,
        createRide,
    };
}

