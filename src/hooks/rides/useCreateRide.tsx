// src/hooks/rides/useCreateRide.tsx
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                setError("Sie müssen angemeldet sein");
                return { error: "Sie müssen angemeldet sein" };
            }

            // 1. Überprüfe, ob User bereits eine Fahrt als Fahrer für diesen Spieltag anbietet
            const driverResponse = await fetch(`/api/rides/driver/${session.user.id}`);
            if (!driverResponse.ok) {
                throw new Error("Fehler beim Laden der Fahrerfahrten");
            }
            const existingDriverRides = await driverResponse.json();
            const hasExistingRide = existingDriverRides.some((ride: any) => ride.matchDayId === matchId);

            if (hasExistingRide) {
                setError("Sie können nur eine Fahrt pro Spieltag anbieten");
                return { error: "Sie können nur eine Fahrt pro Spieltag anbieten" };
            }

            // 2. Überprüfe, ob User bereits als Mitfahrer in einer anderen Fahrt angemeldet ist
            const passengerResponse = await fetch(`/api/rides/passenger/${session.user.id}`);
            if (!passengerResponse.ok) {
                throw new Error("Fehler beim Laden der Mitfahrerfahrten");
            }
            const passengerRides = await passengerResponse.json();
            const isPassenger = passengerRides.some((pr: any) => pr.ride.matchDayId === matchId);

            if (isPassenger) {
                setError("Sie können keine Fahrt anbieten, da Sie bereits als Mitfahrer in einer anderen Fahrt angemeldet sind");
                return { error: "Sie können keine Fahrt anbieten, da Sie bereits als Mitfahrer in einer anderen Fahrt angemeldet sind" };
            }

            // 3. Erstelle die neue Fahrt
            const rideData = {
                matchDayId: matchId,
                driverId: session.user.id,
                departureTime: new Date(data.departureTime).toISOString(),
                departureLocation: data.departureLocation,
                availableSeats: data.availableSeats,
                additionalInfo: data.additionalInfo || null,
            };

            const createResponse = await fetch("/api/rides/create", {
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
