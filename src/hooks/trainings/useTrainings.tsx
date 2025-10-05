// src/hooks/trainings/useTrainings.tsx
import { useEffect, useState } from "react";
import { Training } from "@/entities/Training";

export function useTrainings() {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTrainings = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/trainings");

            if (!response.ok) {
                throw new Error("Fehler beim Laden der Trainings");
            }

            const data = await response.json();
            // Convert date strings to Date objects
            const trainingsWithDates = data.map((training: Training & { 
                date: string; 
                createdAt: string; 
                updatedAt: string;
                series?: { createdAt: string; updatedAt: string; startWeek: string; endWeek: string } | null;
            }) => ({
                ...training,
                date: new Date(training.date),
                createdAt: new Date(training.createdAt),
                updatedAt: new Date(training.updatedAt),
                series: training.series ? {
                    ...training.series,
                    createdAt: new Date(training.series.createdAt),
                    updatedAt: new Date(training.series.updatedAt),
                    startWeek: new Date(training.series.startWeek),
                    endWeek: new Date(training.series.endWeek)
                } : null
            }));
            
            setTrainings(trainingsWithDates);
            setError(null);
        } catch (err) {
            console.error("Error fetching trainings:", err);
            setError(err instanceof Error ? err.message : "Fehler beim Laden der Trainings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrainings();
    }, []);

    // Sort trainings: future trainings first (chronological), then past trainings (reverse chronological)
    const now = new Date();
    const futureTrainings = trainings
        .filter(training => {
            const trainingDateTime = new Date(training.date);
            const [hours, minutes] = training.startTime.split(':').map(Number);
            trainingDateTime.setHours(hours, minutes, 0, 0);
            return trainingDateTime > now;
        })
        .sort((a, b) => a.date.getTime() - b.date.getTime()); // chronological order for future trainings
    
    const pastTrainings = trainings
        .filter(training => {
            const trainingDateTime = new Date(training.date);
            const [hours, minutes] = training.startTime.split(':').map(Number);
            trainingDateTime.setHours(hours, minutes, 0, 0);
            return trainingDateTime <= now;
        })
        .sort((a, b) => b.date.getTime() - a.date.getTime()); // reverse chronological for past trainings
    
    const sortedTrainings = [...futureTrainings, ...pastTrainings];
    
    // Find next upcoming training (first future training)
    const nextTraining = futureTrainings[0] || null;

    return {
        trainings: sortedTrainings,
        nextTraining,
        loading,
        error,
        refetch: fetchTrainings,
    };
}
