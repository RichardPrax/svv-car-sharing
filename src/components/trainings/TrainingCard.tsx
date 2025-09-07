// src/components/trainings/TrainingCard.tsx
import { Training, formatTrainingDate, formatTrainingTimeRange } from "@/entities/Training";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { Icon } from "@/components/ui";
import { formatDateForId, isTrainingInPast } from "@/utils/dateTime";
import styles from "./Trainings.module.css";

type Props = {
    training: Training;
    onEdit?: (training: Training) => void;
    onDelete?: (training: Training) => void;
};

export default function TrainingCard({ training, onEdit, onDelete }: Props) {
    const isPast = isTrainingInPast(training.date, training.startTime);
    const { hasRole, hasAdminAccess } = useRoleGuard();
    const hasTrainerAccess = hasRole("TRAINER") || hasRole("ADMIN") || hasAdminAccess();

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit?.(training);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete?.(training);
    };

    const cardClasses = [styles.trainingCard, isPast && styles.trainingCardPast].filter(Boolean).join(" ");

    return (
        <div 
            data-testid={`training-${formatDateForId(training.date)}`}
            className={cardClasses}
        >
            <div className={styles.trainingCardHeader}>
                <div className={styles.trainingCardDateTime}>
                    <p className={styles.trainingCardDate}>{formatTrainingDate(training)}</p>
                    <p className={styles.trainingCardTime}>{formatTrainingTimeRange(training)}</p>
                </div>
                <div className={styles.trainingCardHeaderRight}>
                    {isPast && <div className={styles.trainingCardPastIndicator}>Beendet</div>}
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

            {training.description && (
                <div className={styles.trainingCardDetails}>
                    <div className={styles.trainingCardDetailRow}>
                        <span className={styles.trainingCardDetailLabel}>Beschreibung:</span>
                        <span className={styles.trainingCardDetailValue}>{training.description}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
