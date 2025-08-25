// src/hooks/matches/useBatchedUserParticipation.tsx
import { useState, useEffect, useCallback } from "react";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";

export interface GameParticipation {
    id: string;
    matchDayId: string;
    playerId: string;
    status: "JOINING" | "DECLINING";
    reason?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface BatchedUserParticipation {
    [matchId: string]: GameParticipation | null;
}

interface UseBatchedUserParticipationProps {
    matchIds: string[];
    refreshTrigger?: number;
}

export function useBatchedUserParticipation({ matchIds, refreshTrigger = 0 }: UseBatchedUserParticipationProps) {
    const [participation, setParticipation] = useState<BatchedUserParticipation | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user, session } = useOptimizedAuth();

    const fetchParticipation = useCallback(async () => {
        if (!matchIds || matchIds.length === 0 || !user) {
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

            const matchIdsParam = matchIds.join(",");
            const response = await fetch(`/api/matches/participation/user-batch?matchIds=${matchIdsParam}`, {
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
                throw new Error(`Failed to fetch user participation: ${response.status}`);
            }
        } catch (err) {
            console.error("Error fetching user participation:", err);
            setParticipation(null);
        } finally {
            setLoading(false);
        }
    }, [matchIds, user, session]);

    useEffect(() => {
        if (matchIds && matchIds.length > 0 && user) {
            fetchParticipation();
        }
    }, [fetchParticipation, refreshTrigger, matchIds, user]);

    return {
        participation,
        loading,
        error,
        refetch: fetchParticipation,
    };
}
