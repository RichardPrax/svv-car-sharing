// src/hooks/trainings/useCreateTrainingSeries.tsx
import { useState } from "react";
import { CreateTrainingSeriesData } from "@/entities/Training";
import { useAuthenticatedFetch } from "@/hooks/auth/useAuthenticatedFetch";

export function useCreateTrainingSeries() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { authenticatedFetch } = useAuthenticatedFetch();

    const createTrainingSeries = async (data: CreateTrainingSeriesData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await authenticatedFetch("/api/training-series", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Fehler beim Erstellen der Trainings-Serie");
            }

            const result = await response.json();
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Unbekannter Fehler";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        createTrainingSeries,
        loading,
        error,
    };
}




