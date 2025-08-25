import { useState, useEffect, useCallback } from "react";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";
import { MatchDay } from "@/entities/MatchDay";
import { RideWithDetails } from "@/entities/Ride";
import { ParticipationOverview } from "./useBatchedParticipationOverview";

interface UserRideCheck {
    hasExistingRide: boolean;
    rideId: string | null;
}

interface UserParticipationCheck {
    isParticipating: boolean;
    participatingRideId: string | null;
}

interface MatchDetailBatchData {
    match: MatchDay;
    participationOverview: ParticipationOverview;
    rides: RideWithDetails[];
    userRideCheck: UserRideCheck | null;
    userParticipationCheck: UserParticipationCheck | null;
}

interface UseMatchDetailBatchProps {
    matchId: string | string[] | undefined;
    refreshTrigger?: number;
}

export function useMatchDetailBatch({ matchId, refreshTrigger = 0 }: UseMatchDetailBatchProps) {
    const [data, setData] = useState<MatchDetailBatchData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user, session } = useOptimizedAuth();

    const fetchMatchDetailBatch = useCallback(async () => {
        if (!matchId || Array.isArray(matchId)) {
            setLoading(true);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = session?.access_token;
            if (!token) {
                console.log("No access token available, skipping match detail fetch");
                setData(null);
                return;
            }

            const userIdParam = user?.id ? `&userId=${user.id}` : "";
            const response = await fetch(`/api/matches/${matchId}/detail-batch?${userIdParam}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const responseData = await response.json();
                setData(responseData);
            } else if (response.status === 404) {
                setError("Spieltag nicht gefunden");
            } else {
                throw new Error(`Failed to fetch match detail: ${response.status}`);
            }
        } catch (err) {
            console.error("Error fetching match detail batch:", err);
            setError("Ein unerwarteter Fehler ist aufgetreten");
        } finally {
            setLoading(false);
        }
    }, [matchId, user?.id, session?.access_token]);

    useEffect(() => {
        if (matchId && !Array.isArray(matchId)) {
            fetchMatchDetailBatch();
        }
    }, [matchId, fetchMatchDetailBatch, refreshTrigger]);

    return {
        match: data?.match || null,
        participationOverview: data?.participationOverview || null,
        rides: data?.rides || [],
        userRideCheck: data?.userRideCheck || null,
        userParticipationCheck: data?.userParticipationCheck || null,
        loading,
        error,
        refetch: fetchMatchDetailBatch,
    };
}
