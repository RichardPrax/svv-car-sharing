// src/components/trainings/NextTrainingCard.tsx
import { Training, formatTrainingDate, formatTrainingTimeRange } from "@/entities/Training";
import { useRouter } from "next/router";
import styles from "./Trainings.module.css";

type Props = {
    training: Training | null;
    loading?: boolean;
};

export default function NextTrainingCard({ training, loading }: Props) {
    const router = useRouter();

    if (loading) {
        return (
            <div className={styles.nextTrainingCard}>
                <div className={styles.nextTrainingHeader}>
                    <div className={styles.nextTrainingIcon}>⏳</div>
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
                    <div className={styles.nextTrainingIcon}>🏐</div>
                    <h3 className={styles.nextTrainingTitle}>Nächstes Training</h3>
                </div>
                <p>Kein Training geplant</p>
            </div>
        );
    }

    const handleClick = () => {
        router.push(`/trainings/${training.id}`);
    };

    return (
        <div className={styles.nextTrainingCard} onClick={handleClick}>
            <div className={styles.nextTrainingHeader}>
                <p className={styles.nextTrainingDate}>{formatTrainingDate(training)}</p>
                <p className={styles.nextTrainingTime}>{formatTrainingTimeRange(training)}</p>
            </div>

            {training.description && (
                <div className={styles.nextTrainingDescription}>
                    <p className={styles.nextTrainingDescriptionText}>{training.description}</p>
                </div>
            )}
        </div>
    );
}
