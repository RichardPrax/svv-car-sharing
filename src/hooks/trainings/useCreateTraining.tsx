// src/hooks/trainings/useCreateTraining.tsx
import { useState } from "react";
import { Training } from "@/entities/Training";

export function useCreateTraining() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createTraining = async (trainingData: Omit<Training, "id" | "createdAt" | "updatedAt">): Promise<Training> => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch("/api/trainings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    date: trainingData.date.toISOString(),
                    startTime: trainingData.startTime,
                    endTime: trainingData.endTime,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Fehler beim Erstellen des Trainings");
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
            console.error("Error creating training:", err);
            setError(err instanceof Error ? err.message : "Fehler beim Erstellen des Trainings");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        createTraining,
        loading,
        error,
    };
}
