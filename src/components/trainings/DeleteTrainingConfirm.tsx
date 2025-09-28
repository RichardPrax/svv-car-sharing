// src/components/trainings/DeleteTrainingConfirm.tsx
import { useState } from "react";
import { Training, formatTrainingDate, formatTrainingTimeRange, isPartOfSeries, DeleteScope } from "@/entities/Training";
import styles from "./Trainings.module.css";

type Props = {
    training: Training;
    onConfirm: (scope: DeleteScope) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
};

export default function DeleteTrainingConfirm({ training, onConfirm, onCancel, loading }: Props) {
    const [deleteScope, setDeleteScope] = useState<DeleteScope>('single');
    const isSeriesTraining = isPartOfSeries(training);

    const handleConfirm = async () => {
        await onConfirm(deleteScope);
    };

    return (
        <div className={styles.deleteConfirm}>
            <div className={styles.deleteConfirmIcon}>⚠️</div>
            
            <h3 className={styles.deleteConfirmTitle}>Training löschen?</h3>
            
            {isSeriesTraining && (
                <div className={styles.editScopeSelector}>
                    <h4 className={styles.editScopeTitle}>Löschbereich</h4>
                    <div className={styles.editScopeOptions}>
                        <label className={styles.editScopeOption}>
                            <input
                                type="radio"
                                name="deleteScope"
                                value="single"
                                checked={deleteScope === 'single'}
                                onChange={(e) => setDeleteScope(e.target.value as DeleteScope)}
                                className={styles.editScopeRadio}
                            />
                            <span className={styles.editScopeLabel}>
                                Nur dieses Training
                                <small className={styles.editScopeDescription}>
                                    Löscht nur das ausgewählte Training vom {formatTrainingDate(training)}
                                </small>
                            </span>
                        </label>
                        <label className={styles.editScopeOption}>
                            <input
                                type="radio"
                                name="deleteScope"
                                value="future"
                                checked={deleteScope === 'future'}
                                onChange={(e) => setDeleteScope(e.target.value as DeleteScope)}
                                className={styles.editScopeRadio}
                            />
                            <span className={styles.editScopeLabel}>
                                Dieses und alle folgenden
                                <small className={styles.editScopeDescription}>
                                    Löscht dieses Training und alle zukünftigen in der Serie
                                </small>
                            </span>
                        </label>
                        <label className={styles.editScopeOption}>
                            <input
                                type="radio"
                                name="deleteScope"
                                value="series"
                                checked={deleteScope === 'series'}
                                onChange={(e) => setDeleteScope(e.target.value as DeleteScope)}
                                className={styles.editScopeRadio}
                            />
                            <span className={styles.editScopeLabel}>
                                Gesamte Serie
                                <small className={styles.editScopeDescription}>
                                    Löscht alle Trainings in der Serie
                                </small>
                            </span>
                        </label>
                    </div>
                </div>
            )}
            
            <p className={styles.deleteConfirmMessage}>
                {deleteScope === 'single' ? (
                    <>
                        Möchten Sie das Training vom <strong>{formatTrainingDate(training)}</strong> um <strong>{formatTrainingTimeRange(training)}</strong> wirklich löschen?
                    </>
                ) : deleteScope === 'future' ? (
                    <>
                        Möchten Sie das Training vom <strong>{formatTrainingDate(training)}</strong> und <strong>alle folgenden Trainings</strong> in der Serie wirklich löschen?
                    </>
                ) : (
                    <>
                        Möchten Sie <strong>alle Trainings</strong> in der Serie wirklich löschen?
                    </>
                )}
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
                    onClick={handleConfirm}
                    className={`${styles.formButton} ${styles.formButtonDanger}`}
                    disabled={loading}
                >
                    {loading ? "Lösche..." : "Löschen"}
                </button>
            </div>
        </div>
    );
}
