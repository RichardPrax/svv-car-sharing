// src/hooks/trainings/useBatchedTrainingParticipation.tsx
import { useState, useEffect, useCallback } from "react";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";

export interface TrainingParticipation {
    id: string;
    trainingId: string;
    playerId: string;
    status: "JOINING" | "DECLINING";
    reason?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface BatchedTrainingParticipation {
    [trainingId: string]: TrainingParticipation | null;
}

interface UseBatchedTrainingParticipationProps {
    trainingIds: string[];
    refreshTrigger?: number;
}

export function useBatchedTrainingParticipation({ trainingIds, refreshTrigger = 0 }: UseBatchedTrainingParticipationProps) {
    const [participation, setParticipation] = useState<BatchedTrainingParticipation | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user, session } = useOptimizedAuth();

    const fetchParticipation = useCallback(async () => {
        if (!trainingIds || trainingIds.length === 0 || !user) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = session?.access_token;
            if (!token) {
                console.log("No access token available, skipping participation fetch");
                setParticipation(null);
                return;
            }

            const trainingIdsParam = trainingIds.join(",");
            const response = await fetch(`/api/trainings/participation/user-batch?trainingIds=${trainingIdsParam}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setParticipation(data);
            } else if (response.status === 404) {
                setParticipation(null);
            } else if (response.status === 500) {
                console.log("Server error - database migration might not be applied yet");
                setParticipation(null);
            } else {
                throw new Error(`Failed to fetch training participation: ${response.status}`);
            }
        } catch (err) {
            console.error("Error fetching training participation:", err);
            setParticipation(null);
        } finally {
            setLoading(false);
        }
    }, [trainingIds, user, session]);

    useEffect(() => {
        if (trainingIds && trainingIds.length > 0 && user) {
            fetchParticipation();
        }
    }, [fetchParticipation, refreshTrigger, trainingIds, user]);

    return {
        participation,
        loading,
        error,
        refetch: fetchParticipation,
    };
}
