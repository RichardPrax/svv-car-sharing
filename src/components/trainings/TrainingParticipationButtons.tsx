import { useMemo, useState } from "react";
import { TrainingParticipationStatus } from "@/hooks/trainings/useTrainingParticipation";
import { ThumbsUpIcon, ThumbsDownIcon } from "@/components/ui/GameParticipationIcons";
import TrainingDeclineReasonModal from "./TrainingDeclineReasonModal";
import TrainingJoinInfoModal from "./TrainingJoinInfoModal";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";
import { formatDateForId } from "@/utils/dateTime";
import styles from "./Trainings.module.css";

interface TrainingParticipation {
    id: string;
    trainingId: string;
    playerId: string;
    status: TrainingParticipationStatus;
    reason?: string | null;
    createdAt: string;
    updatedAt: string;
}

interface TrainingParticipationButtonsProps {
    trainingId: string;
    trainingDate: string | Date;
    userParticipation?: TrainingParticipation | null;
    refreshTrigger?: number;
    onParticipationChange?: () => void;
}

export default function TrainingParticipationButtons({ trainingId, trainingDate, userParticipation, onParticipationChange }: TrainingParticipationButtonsProps) {
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<TrainingParticipationStatus | null>(null);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { session } = useOptimizedAuth();

    // Use the passed participation data instead of fetching
    const participation = userParticipation;
    const loading = false; // No loading since data is passed as props

    // Add the update and remove functions
    const updateParticipation = async (status: TrainingParticipationStatus, reason?: string) => {
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
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                return { success: true };
            } else {
                const errorData = await response.json();
                return { error: errorData.error || "Failed to update participation" };
            }
        } catch (err) {
            console.error("Error updating training participation:", err);
            return { error: "Network error" };
        } finally {
            setUpdating(false);
        }
    };

    const removeParticipation = async () => {
        setUpdating(true);
        setError(null);

        try {
            const token = session?.access_token;
            if (!token) {
                return { error: "No access token available" };
            }

            // The delete endpoint requires the user ID, so we need to use the correct endpoint
            const response = await fetch(`/api/trainings/${trainingId}/participation/${session.user?.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                return { success: true };
            } else {
                const errorData = await response.json();
                return { error: errorData.error || "Failed to remove participation" };
            }
        } catch (err) {
            console.error("Error removing training participation:", err);
            return { error: "Network error" };
        } finally {
            setUpdating(false);
        }
    };

    const handleParticipationClick = async (status: TrainingParticipationStatus) => {
        // If clicking the same status, remove participation
        if (participation?.status === status) {
            const result = await removeParticipation();
            if (result.success) {
                onParticipationChange?.();
            }
            return;
        }

        // For DECLINING status, show modal to get reason (required)
        if (status === "DECLINING") {
            setPendingStatus(status);
            setShowDeclineModal(true);
            return;
        }

        // For JOINING status, show modal to optionally add info
        if (status === "JOINING") {
            setPendingStatus(status);
            setShowJoinModal(true);
            return;
        }
    };

    const handleDeclineConfirm = async (reason: string) => {
        if (!pendingStatus) return;

        const result = await updateParticipation(pendingStatus, reason);
        if (result.success) {
            setShowDeclineModal(false);
            setPendingStatus(null);
            onParticipationChange?.();
        }
    };

    const handleJoinConfirm = async (info?: string) => {
        if (!pendingStatus) return;

        const result = await updateParticipation(pendingStatus, info);
        if (result.success) {
            setShowJoinModal(false);
            setPendingStatus(null);
            onParticipationChange?.();
        }
    };

    const handleModalClose = () => {
        setShowDeclineModal(false);
        setShowJoinModal(false);
        setPendingStatus(null);
    };

    const buttonClasses = useMemo(
        () => ({
            joining: `${styles.participationButton} ${participation?.status === "JOINING" ? styles.participationButtonActive : ""} ${styles.participationButtonJOINING}`.trim(),
            declining: `${styles.participationButton} ${participation?.status === "DECLINING" ? styles.participationButtonActive : ""} ${
                styles.participationButtonDECLINING
            }`.trim(),
        }),
        [participation?.status]
    );

    // Show buttons immediately, with loading state overlay if needed
    const showLoadingOverlay = loading && !participation;

    // If there's an error, show a simple message
    if (error) {
        return (
            <div className={styles.participationButtonsContainer}>
                <div className={styles.participationButtonsLoading}>
                    {error.includes("Database migration") ? "Teilnahme-System wird eingerichtet..." : "Teilnahme-System nicht verfügbar"}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.participationButtonsContainer}>
            {showLoadingOverlay && <div className={styles.participationButtonsLoading}>Lade...</div>}
            <div className={styles.participationButtons}>
                <button
                    data-testid={`training-${formatDateForId(trainingDate)}-participate`}
                    className={buttonClasses.joining}
                    onClick={() => handleParticipationClick("JOINING")}
                    disabled={updating}
                    title="Ich komme zum Training"
                    aria-label="Ich komme zum Training"
                >
                    <ThumbsUpIcon size={20} />
                    <span className={styles.participationButtonText}>Dabei</span>
                </button>

                <button
                    data-testid={`training-${formatDateForId(trainingDate)}-decline`}
                    className={buttonClasses.declining}
                    onClick={() => handleParticipationClick("DECLINING")}
                    disabled={updating}
                    title="Ich kann nicht kommen"
                    aria-label="Ich kann nicht kommen"
                >
                    <ThumbsDownIcon size={20} />
                    <span className={styles.participationButtonText}>Nicht dabei</span>
                </button>
            </div>

            <TrainingDeclineReasonModal isOpen={showDeclineModal} onClose={handleModalClose} onConfirm={handleDeclineConfirm} isLoading={updating} statusType={pendingStatus} />
            <TrainingJoinInfoModal isOpen={showJoinModal} onClose={handleModalClose} onConfirm={handleJoinConfirm} isLoading={updating} />
        </div>
    );
}
