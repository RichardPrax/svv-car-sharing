import React, { useMemo, useState } from "react";
import { useGameParticipation, GameParticipationStatus } from "@/hooks/matches/useGameParticipation";
import { ThumbsUpIcon, ThumbsDownIcon } from "@/components/ui/GameParticipationIcons";
import DeclineReasonModal from "./DeclineReasonModal";
import JoinInfoModal from "./JoinInfoModal";
import styles from "./Matches.module.css";

interface GameParticipationButtonsProps {
    matchDayId: string;
    refreshTrigger?: number;
    onParticipationChange?: () => void;
}

export default function GameParticipationButtons({ matchDayId, refreshTrigger, onParticipationChange }: GameParticipationButtonsProps) {
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<GameParticipationStatus | null>(null);

    const { participation, loading, error, updating, updateParticipation, removeParticipation } = useGameParticipation({ matchDayId, refreshTrigger });

    const handleParticipationClick = async (status: GameParticipationStatus) => {
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
            <div className={styles.participationButtonsLabel}>Teilnahme:</div>
            <div className={styles.participationButtons}>
                <button
                    className={buttonClasses.joining}
                    onClick={() => handleParticipationClick("JOINING")}
                    disabled={updating}
                    title="Ich komme zum Spiel"
                    aria-label="Ich komme zum Spiel"
                >
                    <ThumbsUpIcon size={20} />
                    <span className={styles.participationButtonText}>Dabei</span>
                </button>

                <button
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

            <DeclineReasonModal isOpen={showDeclineModal} onClose={handleModalClose} onConfirm={handleDeclineConfirm} isLoading={updating} statusType={pendingStatus} />
            <JoinInfoModal isOpen={showJoinModal} onClose={handleModalClose} onConfirm={handleJoinConfirm} isLoading={updating} />
        </div>
    );
}

