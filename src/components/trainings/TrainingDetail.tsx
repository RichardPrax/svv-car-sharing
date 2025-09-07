// src/components/trainings/TrainingDetail.tsx
import { Training, formatTrainingTimeRange } from "@/entities/Training";
import { formatDate, formatDateForId } from "@/utils/dateTime";
import styles from "./Trainings.module.css";

type Props = {
    training: Training;
    onEdit?: () => void;
    onDelete?: () => void;
    canEdit?: boolean;
};

export default function TrainingDetail({ training, onEdit, onDelete, canEdit }: Props) {
    return (
        <div data-testid={`training-${formatDateForId(training.date)}-detail`} className={styles.trainingDetailContainer}>
            <div className={styles.trainingDetailWrapper}>
                {/* Training Info */}
                <div className={styles.trainingInfo}>
                    <h1 className={styles.trainingTitle}>{formatDate(training.date)}</h1>

                    <div className={styles.trainingInfoGrid}>
                        <div className={styles.trainingInfoItem}>
                            <h3 className={styles.trainingInfoLabel}>Zeit</h3>
                            <p className={styles.trainingInfoValue}>{formatTrainingTimeRange(training)}</p>
                        </div>

                        <div className={styles.trainingInfoItem}>
                            <h3 className={styles.trainingInfoLabel}>Ort</h3>
                            <p className={styles.trainingInfoValue}>{training.location}</p>
                        </div>

                        {training.description && (
                            <div className={styles.trainingInfoItem}>
                                <h3 className={styles.trainingInfoLabel}>Beschreibung</h3>
                                <p className={styles.trainingInfoValue}>{training.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Admin Actions */}
                    {canEdit && (onEdit || onDelete) && (
                        <div className={styles.formActions} style={{ marginTop: "24px", justifyContent: "flex-start" }}>
                            {onEdit && (
                                <button
                                    onClick={onEdit}
                                    className={`${styles.formButton} ${styles.formButtonSecondary}`}
                                >
                                    ✏️ Bearbeiten
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={onDelete}
                                    className={`${styles.formButton} ${styles.formButtonDanger}`}
                                >
                                    🗑️ Löschen
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
