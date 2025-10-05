// src/components/trainings/TrainingCard.tsx
import { Training, formatTrainingDate, formatTrainingTimeRange, isPartOfSeries, getSeriesDisplayName } from "@/entities/Training";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";
import { Icon } from "@/components/ui";
import { formatDateForId, isTrainingInPast } from "@/utils/dateTime";
import { TrainingParticipationOverview } from "@/hooks/trainings/useBatchedTrainingParticipationOverview";
import { ThumbsUpIcon, ThumbsDownIcon, ClockIcon } from "@/components/ui/GameParticipationIcons";
import TrainingParticipationButtons from "./TrainingParticipationButtons";
import TrainingParticipationSummary from "./TrainingParticipationSummary";
import { useState, useMemo } from "react";
import styles from "./Trainings.module.css";

type Props = {
    training: Training;
    onEdit?: (training: Training) => void;
    onDelete?: (training: Training) => void;
    participationOverview?: TrainingParticipationOverview;
    onParticipationChange?: () => void;
};

export default function TrainingCard({ training, onEdit, onDelete, participationOverview, onParticipationChange }: Props) {
    const isPast = isTrainingInPast(training.date, training.startTime);
    const { hasRole, hasAdminAccess, hasPlayerAccess } = useRoleGuard();
    const { user } = useOptimizedAuth();
    const hasTrainerAccess = hasRole("TRAINER") || hasRole("ADMIN") || hasAdminAccess();
    const [participationRefreshTrigger, setParticipationRefreshTrigger] = useState(0);
    const [showParticipants, setShowParticipants] = useState(false);

    // Extract user's participation from the overview data
    const userParticipation = useMemo(() => {
        if (!participationOverview || !user) return null;
        
        const allParticipations = [
            ...participationOverview.participation.JOINING,
            ...participationOverview.participation.DECLINING
        ];
        
        return allParticipations.find(p => p.playerId === user.id) || null;
    }, [participationOverview, user]);

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit?.(training);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete?.(training);
    };

    // No click handler needed - trainings should not be clickable

    const handleParticipationClick = () => {
        // No need to prevent propagation since card is no longer clickable
    };

    const handleToggleView = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowParticipants(!showParticipants);
    };

    const cardClasses = [styles.trainingCard, isPast && styles.trainingCardPast].filter(Boolean).join(" ");

    return (
        <div 
            data-testid={`training-${formatDateForId(training.date)}`}
            className={cardClasses}
        >
            <div className={styles.trainingCardHeader}>
                <div className={styles.trainingCardDateTime}>
                    <div className={styles.trainingCardDateTimeMain}>
                        <p className={styles.trainingCardDate}>
                            {formatTrainingDate(training)}
                        </p>
                        <p className={styles.trainingCardTime}>{formatTrainingTimeRange(training)}</p>
                    </div>
                </div>
                <div className={styles.trainingCardHeaderRight}>
                    {isPast && <div className={styles.trainingCardPastIndicator}>Beendet</div>}
                    
                    {/* Toggle View Button */}
                    {participationOverview && participationOverview.counts.total > 0 && (
                        <button
                            onClick={handleToggleView}
                            className={styles.trainingCardActionButton}
                            title={showParticipants ? "Training-Info anzeigen" : "Teilnehmer anzeigen"}
                            type="button"
                            aria-label={showParticipants ? "Training-Info anzeigen" : "Teilnehmer anzeigen"}
                        >
                            <Icon name={showParticipants ? "chart" : "users"} size={16} color="currentColor" />
                        </button>
                    )}
                    
                    {hasTrainerAccess && !isPast && (
                        <div className={styles.trainingCardActions}>
                            <button
                                onClick={handleEditClick}
                                className={styles.trainingCardActionButton}
                                title="Training bearbeiten"
                                type="button"
                                aria-label={`Training vom ${formatTrainingDate(training)} bearbeiten`}
                            >
                                <Icon name="edit" size={16} color="currentColor" />
                            </button>
                            <button
                                onClick={handleDeleteClick}
                                className={`${styles.trainingCardActionButton} ${styles.trainingCardActionButtonDanger}`}
                                title="Training löschen"
                                type="button"
                                aria-label={`Training vom ${formatTrainingDate(training)} löschen`}
                            >
                                <Icon name="delete" size={16} color="currentColor" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Conditional rendering based on view mode */}
            {showParticipants ? (
                <div className={styles.trainingCardParticipantsView}>
                    <TrainingParticipationSummary 
                        trainingId={training.id}
                        trainingDate={training.date}
                        participationOverview={participationOverview}
                    />
                </div>
            ) : (
                <div className={styles.trainingCardDetails}>
                    {/* Participation Summary */}
                    {participationOverview && participationOverview.counts.total > 0 ? (
                        <div className={styles.trainingCardParticipationSummary}>
                            <div className={styles.trainingCardParticipationLeft}>
                                <span className={styles.trainingCardParticipationLabel}>Teilnahme:</span>
                                <div className={styles.trainingCardParticipationCounts}>
                                    {participationOverview.counts.joining > 0 && (
                                        <span className={styles.trainingCardParticipationCount} style={{ color: "#10b981" }}>
                                            <ThumbsUpIcon size={16} />
                                            <span style={{ marginLeft: "4px" }}>{participationOverview.counts.joining}</span>
                                        </span>
                                    )}
                                    {participationOverview.counts.declining > 0 && (
                                        <span className={styles.trainingCardParticipationCount} style={{ color: "#ef4444" }}>
                                            <ThumbsDownIcon size={16} />
                                            <span style={{ marginLeft: "4px" }}>{participationOverview.counts.declining}</span>
                                        </span>
                                    )}
                                    {participationOverview.counts.open > 0 && (
                                        <span className={styles.trainingCardParticipationCount} style={{ color: "#6b7280" }}>
                                            <ClockIcon size={16} />
                                            <span style={{ marginLeft: "4px" }}>{participationOverview.counts.open}</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className={styles.trainingCardTypeLabel}>
                                {isPartOfSeries(training) && training.series ? (
                                    <span className={styles.trainingCardSeriesLabel}>
                                        <Icon name="refresh" size={14} color="currentColor" />
                                        Reguläres Training
                                    </span>
                                ) : (
                                    <span className={styles.trainingCardSingleLabel}>
                                        <Icon name="calendar" size={14} color="currentColor" />
                                        Einzeltraining
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className={styles.trainingCardParticipationSummary}>
                            <div></div>
                            <div className={styles.trainingCardTypeLabel}>
                                {isPartOfSeries(training) && training.series ? (
                                    <span className={styles.trainingCardSeriesLabel}>
                                        <Icon name="refresh" size={14} color="currentColor" />
                                        Reguläres Training
                                    </span>
                                ) : (
                                    <span className={styles.trainingCardSingleLabel}>
                                        <Icon name="calendar" size={14} color="currentColor" />
                                        Einzeltraining
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Show participation buttons only for players and future trainings */}
            {user && hasPlayerAccess() && !isPast && (
                <div onClick={handleParticipationClick}>
                    <TrainingParticipationButtons
                        trainingId={training.id}
                        trainingDate={training.date}
                        userParticipation={userParticipation}
                        refreshTrigger={participationRefreshTrigger}
                        onParticipationChange={() => {
                            // Trigger a refresh of the participation overview
                            // Small delay to ensure the API call completes
                            setTimeout(() => {
                                setParticipationRefreshTrigger((prev) => prev + 1);
                                onParticipationChange?.();
                            }, 100);
                        }}
                    />
                </div>
            )}
        </div>
    );
}
