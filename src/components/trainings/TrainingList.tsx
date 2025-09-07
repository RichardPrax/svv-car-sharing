// src/components/trainings/TrainingList.tsx
import { Training } from "@/entities/Training";
import { useState, useMemo } from "react";
import { useBatchedTrainingParticipationOverview, BatchedTrainingParticipationOverview } from "@/hooks/trainings/useBatchedTrainingParticipationOverview";
import TrainingCard from "./TrainingCard";
import styles from "./Trainings.module.css";

type Props = {
    trainings: Training[];
    loading?: boolean;
    onEdit?: (training: Training) => void;
    onDelete?: (training: Training) => void;
};

export default function TrainingList({ trainings, loading, onEdit, onDelete }: Props) {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    
    // Memoize training IDs to prevent unnecessary re-renders
    const trainingIds = useMemo(() => {
        return trainings.map(training => training.id);
    }, [trainings]);
    
    // Fetch participation overview for all trainings in a single request
    const { overview: batchedOverview } = useBatchedTrainingParticipationOverview({
        trainingIds,
        refreshTrigger,
    });

    const handleParticipationChange = () => {
        // Trigger a refresh of the participation overview
        setTimeout(() => {
            setRefreshTrigger((prev) => prev + 1);
        }, 100);
    };

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
                <TrainingCard 
                    key={training.id} 
                    training={training} 
                    participationOverview={batchedOverview?.[training.id]}
                    onParticipationChange={handleParticipationChange}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
