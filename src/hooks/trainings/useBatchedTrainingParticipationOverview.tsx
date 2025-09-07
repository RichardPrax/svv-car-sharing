// src/hooks/trainings/useBatchedTrainingParticipationOverview.tsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";

export interface TrainingParticipationData {
    id: string;
    trainingId: string;
    playerId: string;
    status: "JOINING" | "DECLINING";
    reason?: string | null;
    createdAt: string;
    updatedAt: string;
    player: {
        id: string;
        firstName: string;
        lastName: string;
        playerPositions: {
            id: string;
            position: string;
            isPrimary: boolean;
        }[];
    };
}

export interface TrainingParticipationPlayer {
    id: string;
    firstName: string;
    lastName: string;
    playerPositions: {
        id: string;
        position: string;
        isPrimary: boolean;
    }[];
}

export interface TrainingParticipationOverview {
    participation: {
        JOINING: TrainingParticipationData[];
        DECLINING: TrainingParticipationData[];
        OPEN: TrainingParticipationPlayer[];
    };
    counts: {
        joining: number;
        declining: number;
        open: number;
        total: number;
    };
}

export interface BatchedTrainingParticipationOverview {
    [trainingId: string]: TrainingParticipationOverview;
}

interface UseBatchedTrainingParticipationOverviewProps {
    trainingIds: string[];
    refreshTrigger?: number;
}

export function useBatchedTrainingParticipationOverview({ trainingIds, refreshTrigger = 0 }: UseBatchedTrainingParticipationOverviewProps) {
    const [overview, setOverview] = useState<BatchedTrainingParticipationOverview | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { session } = useOptimizedAuth();

    // Memoize trainingIds to prevent unnecessary re-renders
    const stableTrainingIds = useMemo(() => trainingIds, [trainingIds]);

    const fetchOverview = useCallback(async () => {
        if (!stableTrainingIds || stableTrainingIds.length === 0) {
            setLoading(false);
            return;
        }

        // Fetching batched participation overview for multiple trainings
        setLoading(true);
        setError(null);

        try {
            const token = session?.access_token;
            if (!token) {
                console.log("No access token available, skipping overview fetch");
                setOverview(null);
                return;
            }

            const trainingIdsParam = stableTrainingIds.join(",");
            const response = await fetch(`/api/trainings/participation/overview-batch?trainingIds=${trainingIdsParam}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setOverview(data);
            } else if (response.status === 404) {
                setOverview(null);
            } else if (response.status === 500) {
                console.log("Server error - database migration might not be applied yet");
                setOverview(null);
            } else {
                throw new Error(`Failed to fetch training participation overview: ${response.status}`);
            }
        } catch (err) {
            console.error("Error fetching training participation overview:", err);
            setError("Failed to load training participation overview");
        } finally {
            setLoading(false);
        }
    }, [stableTrainingIds, session?.access_token]);

    useEffect(() => {
        if (stableTrainingIds && stableTrainingIds.length > 0) {
            fetchOverview();
        }
    }, [stableTrainingIds, fetchOverview, refreshTrigger]);

    return {
        overview,
        loading,
        error,
        refetch: fetchOverview,
    };
}
