// src/components/trainings/TrainingCard.tsx
import { Training, formatTrainingDate, formatTrainingTimeRange, isTrainingInPast } from "@/entities/Training";
import { useRouter } from "next/router";
import { formatDateForId } from "@/utils/dateTime";
import styles from "./Trainings.module.css";

type Props = {
    training: Training;
};

export default function TrainingCard({ training }: Props) {
    const isPast = isTrainingInPast(training.date, training.startTime);
    const router = useRouter();

    const handleCardClick = () => {
        router.push(`/trainings/${training.id}`);
    };

    const cardClasses = [styles.trainingCard, isPast && styles.trainingCardPast].filter(Boolean).join(" ");

    return (
        <div 
            data-testid={`training-${formatDateForId(training.date)}`}
            className={cardClasses} 
            onClick={handleCardClick}
        >
            <div className={styles.trainingCardHeader}>
                <div className={styles.trainingCardDateTime}>
                    <p className={styles.trainingCardDate}>{formatTrainingDate(training)}</p>
                    <p className={styles.trainingCardTime}>{formatTrainingTimeRange(training)}</p>
                </div>
                {isPast && <div className={styles.trainingCardPastIndicator}>Beendet</div>}
            </div>

            <div className={styles.trainingCardDetails}>
                <div className={styles.trainingCardDetailRow}>
                    <span className={styles.trainingCardDetailLabel}>Ort:</span>
                    <span className={styles.trainingCardDetailValue}>{training.location}</span>
                </div>

                {training.description && (
                    <div className={styles.trainingCardDetailRow}>
                        <span className={styles.trainingCardDetailLabel}>Beschreibung:</span>
                        <span className={styles.trainingCardDetailValue}>{training.description}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
