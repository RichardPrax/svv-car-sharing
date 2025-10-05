// src/hooks/trainings/useNextTraining.tsx
import { useEffect, useState } from "react";
import { Training } from "@/entities/Training";

export function useNextTraining() {
    const [nextTraining, setNextTraining] = useState<Training | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNextTraining = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/trainings/next");

                if (!response.ok) {
                    throw new Error("Fehler beim Laden des nächsten Trainings");
                }

                const data = await response.json();
                
                if (data) {
                    // Convert date strings to Date objects
                    const trainingWithDates = {
                        ...data,
                        date: new Date(data.date),
                        createdAt: new Date(data.createdAt),
                        updatedAt: new Date(data.updatedAt),
                    };
                    setNextTraining(trainingWithDates);
                } else {
                    setNextTraining(null);
                }
                
                setError(null);
            } catch (err) {
                console.error("Error fetching next training:", err);
                setError("Fehler beim Laden des nächsten Trainings");
                setNextTraining(null);
            } finally {
                setLoading(false);
            }
        };

        fetchNextTraining();
    }, []);

    return {
        nextTraining,
        loading,
        error,
    };
}
