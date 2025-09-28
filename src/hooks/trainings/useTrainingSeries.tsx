// src/hooks/trainings/useTrainingSeries.tsx
import { useEffect, useState } from "react";
import { TrainingSeries, Training } from "@/entities/Training";

export function useTrainingSeries() {
    const [trainingSeries, setTrainingSeries] = useState<TrainingSeries[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTrainingSeries = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/training-series");

            if (!response.ok) {
                throw new Error("Fehler beim Laden der Trainings-Serien");
            }

            const data = await response.json();
            // Convert date strings to Date objects
            const seriesWithDates = data.map((series: TrainingSeries & { 
                startWeek: string; 
                endWeek: string; 
                createdAt: string; 
                updatedAt: string;
                trainings?: (Training & { date: string; createdAt: string; updatedAt: string })[];
            }) => ({
                ...series,
                startWeek: new Date(series.startWeek),
                endWeek: new Date(series.endWeek),
                createdAt: new Date(series.createdAt),
                updatedAt: new Date(series.updatedAt),
                trainings: series.trainings?.map(training => ({
                    ...training,
                    date: new Date(training.date),
                    createdAt: new Date(training.createdAt),
                    updatedAt: new Date(training.updatedAt),
                })),
            }));
            
            setTrainingSeries(seriesWithDates);
            setError(null);
        } catch (err) {
            console.error("Error fetching training series:", err);
            setError(err instanceof Error ? err.message : "Fehler beim Laden der Trainings-Serien");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrainingSeries();
    }, []);

    return {
        trainingSeries,
        loading,
        error,
        refetch: fetchTrainingSeries,
    };
}
