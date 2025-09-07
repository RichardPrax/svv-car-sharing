// src/hooks/trainings/useTrainingDetail.tsx
import { useEffect, useState } from "react";
import { Training } from "@/entities/Training";

export function useTrainingDetail(trainingId: string | string[] | undefined) {
    const [training, setTraining] = useState<Training | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTraining = async () => {
            if (!trainingId || Array.isArray(trainingId)) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await fetch(`/api/trainings/${trainingId}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error("Training nicht gefunden");
                    }
                    throw new Error("Fehler beim Laden des Trainings");
                }

                const data = await response.json();
                // Convert date strings to Date objects
                const trainingWithDates = {
                    ...data,
                    date: new Date(data.date),
                    createdAt: new Date(data.createdAt),
                    updatedAt: new Date(data.updatedAt),
                };
                
                setTraining(trainingWithDates);
                setError(null);
            } catch (err) {
                console.error("Error fetching training:", err);
                setError(err instanceof Error ? err.message : "Fehler beim Laden des Trainings");
                setTraining(null);
            } finally {
                setLoading(false);
            }
        };

        fetchTraining();
    }, [trainingId]);

    return {
        training,
        loading,
        error,
    };
}
