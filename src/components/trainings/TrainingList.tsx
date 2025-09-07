// src/components/trainings/TrainingList.tsx
import { Training } from "@/entities/Training";
import TrainingCard from "./TrainingCard";
import styles from "./Trainings.module.css";

type Props = {
    trainings: Training[];
    loading?: boolean;
};

export default function TrainingList({ trainings, loading }: Props) {
    if (loading) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>⏳</div>
                <h3 className={styles.emptyStateTitle}>Lade Trainings...</h3>
            </div>
        );
    }

    if (trainings.length === 0) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>🏐</div>
                <h3 className={styles.emptyStateTitle}>Keine Trainings verfügbar</h3>
                <p className={styles.emptyStateMessage}>
                    Es sind derzeit keine Trainings geplant.
                </p>
            </div>
        );
    }

    return (
        <div className={styles.trainingList}>
            {trainings.map((training) => (
                <TrainingCard key={training.id} training={training} />
            ))}
        </div>
    );
}
