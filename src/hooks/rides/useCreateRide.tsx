// src/hooks/rides/useCreateRide.tsx
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { RideRepository } from "@/lib/repositories/rideRepository";

const rideRepository = new RideRepository();

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
                return { success: false };
            }

            // Überprüfe, ob der User bereits eine Fahrt für diesen Spieltag anbietet
            const existingDriverRides = await rideRepository.findByDriver(session.user.id);
            const hasExistingRide = existingDriverRides.some((ride) => ride.matchDayId === matchId);

            if (hasExistingRide) {
                setError("Sie haben bereits eine Fahrt für diesen Spieltag angeboten");
                return { success: false };
            }

            // Überprüfe, ob der User bereits als Mitfahrer angemeldet ist
            const isPassenger = await rideRepository.isPassenger(matchId, session.user.id);

            if (isPassenger) {
                setError("Sie können keine eigene Fahrt anbieten, da Sie bereits als Mitfahrer angemeldet sind");
                return { success: false };
            }

            // Erstelle die Fahrt
            await rideRepository.create({
                matchDayId: matchId,
                driverId: session.user.id,
                departureTime: new Date(data.departureTime),
                departureLocation: data.departureLocation,
                availableSeats: data.availableSeats,
                additionalInfo: data.additionalInfo || null,
            });

            onSuccess();
            return { success: true };
        } catch (err) {
            console.error("Error creating ride:", err);
            setError("Ein unerwarteter Fehler ist aufgetreten");
            return { success: false };
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
        clearError: () => setError(null),
    };
}
