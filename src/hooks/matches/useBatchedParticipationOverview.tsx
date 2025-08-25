// src/hooks/matches/useBatchedParticipationOverview.tsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";

export interface ParticipationData {
    id: string;
    matchDayId: string;
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

export interface ParticipationPlayer {
    id: string;
    firstName: string;
    lastName: string;
    playerPositions: {
        id: string;
        position: string;
        isPrimary: boolean;
    }[];
}

export interface ParticipationOverview {
    participations: {
        JOINING: ParticipationData[];
        DECLINING: ParticipationData[];
    };
    openUsers: ParticipationPlayer[];
    counts: {
        joining: number;
        declining: number;
        open: number;
        total: number;
    };
    match: {
        id: string;
        date: string;
        time: string;
        opponent: string;
        location: string;
    };
}

export interface BatchedParticipationOverview {
    [matchId: string]: ParticipationOverview;
}

interface UseBatchedParticipationOverviewProps {
    matchIds: string[];
    refreshTrigger?: number;
}

export function useBatchedParticipationOverview({ matchIds, refreshTrigger = 0 }: UseBatchedParticipationOverviewProps) {
    const [overview, setOverview] = useState<BatchedParticipationOverview | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { session } = useOptimizedAuth();

    // Memoize matchIds to prevent unnecessary re-renders
    const stableMatchIds = useMemo(() => matchIds, [JSON.stringify(matchIds)]);

    const fetchOverview = useCallback(async () => {
        if (!stableMatchIds || stableMatchIds.length === 0) {
            setLoading(false);
            return;
        }

        // Fetching batched participation overview for multiple matches
        setLoading(true);
        setError(null);

        try {
            const token = session?.access_token;
            if (!token) {
                console.log("No access token available, skipping overview fetch");
                setOverview(null);
                return;
            }

            const matchIdsParam = stableMatchIds.join(",");
            const response = await fetch(`/api/matches/participation/overview-batch?matchIds=${matchIdsParam}`, {
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
                throw new Error(`Failed to fetch participation overview: ${response.status}`);
            }
        } catch (err) {
            console.error("Error fetching participation overview:", err);
            setError("Failed to load participation overview");
        } finally {
            setLoading(false);
        }
    }, [stableMatchIds, session?.access_token]);

    useEffect(() => {
        if (stableMatchIds && stableMatchIds.length > 0) {
            fetchOverview();
        }
    }, [fetchOverview, refreshTrigger]);

    return {
        overview,
        loading,
        error,
        refetch: fetchOverview,
    };
}
