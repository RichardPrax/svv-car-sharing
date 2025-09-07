import { useState, useEffect, useCallback } from "react";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";

export type TrainingParticipationStatus = "JOINING" | "DECLINING";

interface TrainingParticipation {
    id: string;
    trainingId: string;
    playerId: string;
    status: TrainingParticipationStatus;
    reason?: string | null; // Grund für Absage
    createdAt: string;
    updatedAt: string;
}

interface UseTrainingParticipationProps {
    trainingId: string;
    refreshTrigger?: number;
}

export function useTrainingParticipation({ trainingId, refreshTrigger }: UseTrainingParticipationProps) {
    const [participation, setParticipation] = useState<TrainingParticipation | null>(null);
    const [loading, setLoading] = useState(false); // Start with false to avoid unnecessary loading
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);
    const { user, session } = useOptimizedAuth();

    const fetchParticipation = useCallback(async () => {
        if (!trainingId || !user) {
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

            const response = await fetch(`/api/trainings/${trainingId}/participation/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setParticipation(data);
            } else if (response.status === 404) {
                // No participation found, which is fine
                setParticipation(null);
            } else if (response.status === 500) {
                // Server error - might be database migration not applied
                console.log("Server error - database migration might not be applied yet");
                setParticipation(null);
            } else {
                throw new Error(`Failed to fetch participation: ${response.status}`);
            }
        } catch (err) {
            console.error("Error fetching training participation:", err);
            // Don't set error for now, just set participation to null
            setParticipation(null);
        } finally {
            setLoading(false);
        }
    }, [trainingId, user, session]);

    const updateParticipation = useCallback(
        async (status: TrainingParticipationStatus, reason?: string) => {
            if (!trainingId || !user) {
                return { error: "User not authenticated" };
            }

            // Validierung: Bei DECLINING ist ein Grund erforderlich
            if (status === "DECLINING" && (!reason || reason.trim().length === 0)) {
                return { error: "Bei einer Absage muss ein Grund angegeben werden" };
            }
            setUpdating(true);
            setError(null);

            try {
                const token = session?.access_token;
                if (!token) {
                    return { error: "No access token available" };
                }

                const body: { status: TrainingParticipationStatus; reason?: string } = { status };
                if (reason && reason.trim()) {
                    body.reason = reason.trim();
                }

                const response = await fetch(`/api/trainings/${trainingId}/participation`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(body),
                });

                if (response.ok) {
                    const data = await response.json();
                    setParticipation(data);
                    return { success: true, data };
                } else if (response.status === 500) {
                    // Server error - might be database migration not applied
                    console.log("Server error - database migration might not be applied yet");
                    return { error: "Database migration not applied yet. Please contact administrator." };
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to update participation");
                }
            } catch (err) {
                console.error("Error updating training participation:", err);
                const errorMessage = err instanceof Error ? err.message : "Failed to update participation";
                setError(errorMessage);
                return { error: errorMessage };
            } finally {
                setUpdating(false);
            }
        },
        [trainingId, user, session]
    );

    const removeParticipation = useCallback(async () => {
        if (!trainingId || !user || !participation) {
            return { error: "No participation to remove" };
        }

        setUpdating(true);
        setError(null);

        try {
            const token = session?.access_token;
            if (!token) {
                return { error: "No access token available" };
            }

            const response = await fetch(`/api/trainings/${trainingId}/participation/${user.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setParticipation(null);
                return { success: true };
            } else {
                throw new Error("Failed to remove participation");
            }
        } catch (err) {
            console.error("Error removing training participation:", err);
            const errorMessage = err instanceof Error ? err.message : "Failed to remove participation";
            setError(errorMessage);
            return { error: errorMessage };
        } finally {
            setUpdating(false);
        }
    }, [trainingId, user, participation, session]);

    useEffect(() => {
        // Only fetch if we have a user and trainingId
        if (user && trainingId) {
            fetchParticipation();
        }
    }, [fetchParticipation, refreshTrigger, user, trainingId]);

    return {
        participation,
        loading,
        error,
        updating,
        updateParticipation,
        removeParticipation,
        refetch: fetchParticipation,
    };
}
