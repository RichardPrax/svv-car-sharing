import { useState, useEffect, useCallback } from "react";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";

export interface ParticipationPlayer {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
}

export interface ParticipationData {
    id: string;
    matchDayId: string;
    playerId: string;
    status: "JOINING" | "TENTATIVE" | "DECLINING";
    reason?: string | null; // Grund für Absage
    createdAt: string;
    updatedAt: string;
    player: ParticipationPlayer;
}

export interface ParticipationOverview {
    participations: {
        JOINING: ParticipationData[];
        TENTATIVE: ParticipationData[];
        DECLINING: ParticipationData[];
    };
    counts: {
        joining: number;
        tentative: number;
        declining: number;
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

interface UseParticipationOverviewProps {
    matchId: string;
    refreshTrigger?: number;
}

export function useParticipationOverview({ matchId, refreshTrigger = 0 }: UseParticipationOverviewProps) {
    const [overview, setOverview] = useState<ParticipationOverview | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { session } = useOptimizedAuth();

    const fetchOverview = useCallback(async () => {
        if (!matchId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = session?.access_token;
            if (!token) {
                console.log("No access token available, skipping overview fetch");
                setOverview(null);
                return;
            }

            const response = await fetch(`/api/matches/${matchId}/participation/overview`, {
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
    }, [matchId, session]);

    useEffect(() => {
        if (matchId) {
            fetchOverview();
        }
    }, [fetchOverview, refreshTrigger, matchId]);

    return {
        overview,
        loading,
        error,
        refetch: fetchOverview,
    };
}

