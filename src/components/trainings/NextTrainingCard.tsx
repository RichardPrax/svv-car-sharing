// src/components/trainings/NextTrainingCard.tsx
import { Training, formatTrainingDate, formatTrainingTimeRange, isPartOfSeries, getSeriesDisplayName } from "@/entities/Training";
import { Icon } from "@/components/ui";
import styles from "./Trainings.module.css";

type Props = {
    training: Training | null;
    loading?: boolean;
};

export default function NextTrainingCard({ training, loading }: Props) {

    if (loading) {
        return (
            <div className={styles.nextTrainingCard}>
                <div className={styles.nextTrainingHeader}>
                    <div className={styles.nextTrainingIcon}>
                        <Icon name="clock-loading" size={20} />
                    </div>
                    <h3 className={styles.nextTrainingTitle}>Nächstes Training</h3>
                </div>
                <p>Lade...</p>
            </div>
        );
    }

    if (!training) {
        return (
            <div className={styles.nextTrainingCard}>
                <div className={styles.nextTrainingHeader}>
                    <div className={styles.nextTrainingIcon}>
                        <Icon name="volleyball" size={20} />
                    </div>
                    <h3 className={styles.nextTrainingTitle}>Nächstes Training</h3>
                </div>
                <p>Kein Training geplant</p>
            </div>
        );
    }

    // No click handler needed - trainings should not be clickable

    return (
        <div className={styles.nextTrainingCard}>
            <div className={styles.nextTrainingHeader}>
                <p className={styles.nextTrainingDate}>
                    {formatTrainingDate(training)}
                </p>
                <p className={styles.nextTrainingTime}>{formatTrainingTimeRange(training)}</p>
                <div className={styles.nextTrainingTypeLabel}>
                    {isPartOfSeries(training) && training.series ? (
                        <span className={styles.nextTrainingSeriesLabel}>
                            <Icon name="refresh" size={14} color="currentColor" />
                            Reguläres Training
                        </span>
                    ) : (
                        <span className={styles.nextTrainingSingleLabel}>
                            <Icon name="calendar" size={14} color="currentColor" />
                            Einzeltraining
                        </span>
                    )}
                </div>
            </div>

            {training.series?.description && (
                <div className={styles.nextTrainingDescription}>
                    <p className={styles.nextTrainingDescriptionText}>{training.series.description}</p>
                </div>
            )}
        </div>
    );
}
