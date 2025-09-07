// src/hooks/trainings/useUpdateTraining.tsx
import { useState } from "react";
import { Training } from "@/entities/Training";

export function useUpdateTraining() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateTraining = async (training: Training): Promise<Training> => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/trainings/${training.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    date: training.date.toISOString(),
                    startTime: training.startTime,
                    endTime: training.endTime,
                    description: training.description,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Fehler beim Aktualisieren des Trainings");
            }

            const data = await response.json();
            // Convert date strings to Date objects
            const trainingWithDates = {
                ...data,
                date: new Date(data.date),
                createdAt: new Date(data.createdAt),
                updatedAt: new Date(data.updatedAt),
            };

            return trainingWithDates;
        } catch (err) {
            console.error("Error updating training:", err);
            setError(err instanceof Error ? err.message : "Fehler beim Aktualisieren des Trainings");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateTraining,
        loading,
        error,
    };
}
