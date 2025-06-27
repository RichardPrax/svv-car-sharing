// src/hooks/useCreateRide.tsx
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface CreateRideData {
    departure_time: string;
    departure_location: string;
    available_seats: number;
    additional_info: string;
}

interface UseCreateRideProps {
    matchId: string;
    onSuccess: () => void;
}

export function useCreateRide({ matchId, onSuccess }: UseCreateRideProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<CreateRideData>({
        departure_time: "",
        departure_location: "",
        available_seats: 1,
        additional_info: "",
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
            const { data: existingRides, error: checkError } = await supabase.from("rides").select("id").eq("match_day_id", matchId).eq("driver_id", session.user.id);

            if (checkError) {
                console.error("Error checking existing rides:", checkError);
                setError("Fehler beim Überprüfen bestehender Fahrten");
                return { success: false };
            }

            if (existingRides.length > 0) {
                setError("Sie haben bereits eine Fahrt für diesen Spieltag angeboten");
                return { success: false };
            }

            // Überprüfe, ob der User bereits als Mitfahrer in einer Fahrt angemeldet ist
            const { data: existingParticipations, error: participationCheckError } = await supabase
                .from("ride_passengers")
                .select(`
                    id,
                    ride_id,
                    rides!inner (
                        id,
                        match_day_id
                    )
                `)
                .eq("passenger_id", session.user.id)
                .eq("rides.match_day_id", matchId);

            if (participationCheckError) {
                console.error("Error checking participation:", participationCheckError);
                setError("Fehler beim Überprüfen der Teilnahme");
                return { success: false };
            }

            if (existingParticipations.length > 0) {
                setError("Sie können keine eigene Fahrt anbieten, da Sie bereits als Mitfahrer angemeldet sind");
                return { success: false };
            }

            const { error: insertError } = await supabase.from("rides").insert({
                match_day_id: matchId,
                driver_id: session.user.id,
                departure_time: data.departure_time,
                departure_location: data.departure_location,
                available_seats: data.available_seats,
                additional_info: data.additional_info || null,
            });

            if (insertError) {
                console.error("Error creating ride:", insertError);
                setError("Fehler beim Erstellen der Fahrt");
                return { success: false };
            }

            onSuccess();
            return { success: true };
        } catch (err) {
            console.error("Error:", err);
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

