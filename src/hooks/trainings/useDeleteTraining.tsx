// src/hooks/trainings/useDeleteTraining.tsx
import { useState } from "react";
import { useAuthenticatedFetch } from "@/hooks/auth/useAuthenticatedFetch";

export function useDeleteTraining() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { authenticatedFetch } = useAuthenticatedFetch();

    const deleteTraining = async (trainingId: string): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const response = await authenticatedFetch(`/api/trainings/${trainingId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Fehler beim Löschen des Trainings");
            }
        } catch (err) {
            console.error("Error deleting training:", err);
            setError(err instanceof Error ? err.message : "Fehler beim Löschen des Trainings");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteTraining,
        loading,
        error,
    };
}
