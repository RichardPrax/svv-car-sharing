// src/components/trainings/DeleteTrainingConfirm.tsx
import { Training, formatTrainingDate, formatTrainingTimeRange } from "@/entities/Training";
import styles from "./Trainings.module.css";

type Props = {
    training: Training;
    onConfirm: () => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
};

export default function DeleteTrainingConfirm({ training, onConfirm, onCancel, loading }: Props) {
    return (
        <div className={styles.deleteConfirm}>
            <div className={styles.deleteConfirmIcon}>⚠️</div>
            
            <h3 className={styles.deleteConfirmTitle}>Training löschen?</h3>
            
            <p className={styles.deleteConfirmMessage}>
                Möchten Sie das Training vom <strong>{formatTrainingDate(training)}</strong> um <strong>{formatTrainingTimeRange(training)}</strong> wirklich löschen?
                <br /><br />
                Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            
            <div className={styles.deleteConfirmActions}>
                <button
                    onClick={onCancel}
                    className={`${styles.formButton} ${styles.formButtonSecondary}`}
                    disabled={loading}
                >
                    Abbrechen
                </button>
                <button
                    onClick={onConfirm}
                    className={`${styles.formButton} ${styles.formButtonDanger}`}
                    disabled={loading}
                >
                    {loading ? "Lösche..." : "Löschen"}
                </button>
            </div>
        </div>
    );
}
