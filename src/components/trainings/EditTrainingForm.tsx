// src/components/trainings/EditTrainingForm.tsx
import { useState, useEffect } from "react";
import { Training, isPartOfSeries, EditScope } from "@/entities/Training";
import styles from "./Trainings.module.css";

type Props = {
    training: Training;
    onSubmit: (training: Training, scope: EditScope) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
};

export default function EditTrainingForm({ training, onSubmit, onCancel, loading }: Props) {
    const [formData, setFormData] = useState({
        date: "",
        startTime: "",
        endTime: "",
    });
    const [editScope, setEditScope] = useState<EditScope>('single');
    
    const isSeriesTraining = isPartOfSeries(training);

    useEffect(() => {
        if (training) {
            // Format date for input field (YYYY-MM-DD)
            const dateString = new Date(training.date).toISOString().split('T')[0];
            
            setFormData({
                date: dateString,
                startTime: training.startTime,
                endTime: training.endTime,
            });
        }
    }, [training]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.date || !formData.startTime || !formData.endTime) {
            alert("Bitte füllen Sie alle Pflichtfelder aus.");
            return;
        }

        await onSubmit({
            ...training,
            date: new Date(formData.date),
            startTime: formData.startTime,
            endTime: formData.endTime,
        }, editScope);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <>
            {isSeriesTraining && (
                <div className={styles.editScopeSelector} data-testid="tr-edit-scope-selector">
                    <div className={styles.editScopeOptions}>
                        <label className={styles.editScopeOption}>
                            <input
                                type="radio"
                                name="editScope"
                                value="single"
                                checked={editScope === 'single'}
                                onChange={(e) => setEditScope(e.target.value as EditScope)}
                                className={styles.editScopeRadio}
                                data-testid="tr-edit-scope-single"
                            />
                            <span className={styles.editScopeLabel}>
                                Nur dieses Training
                                <small className={styles.editScopeDescription}>
                                    Ändert nur das ausgewählte Training
                                </small>
                            </span>
                        </label>
                        <label className={styles.editScopeOption}>
                            <input
                                type="radio"
                                name="editScope"
                                value="future"
                                checked={editScope === 'future'}
                                onChange={(e) => setEditScope(e.target.value as EditScope)}
                                className={styles.editScopeRadio}
                                data-testid="tr-edit-scope-future"
                            />
                            <span className={styles.editScopeLabel}>
                                Dieses und alle folgenden
                                <small className={styles.editScopeDescription}>
                                    Ändert dieses Training und alle zukünftigen in der Serie
                                </small>
                            </span>
                        </label>
                        <label className={styles.editScopeOption}>
                            <input
                                type="radio"
                                name="editScope"
                                value="series"
                                checked={editScope === 'series'}
                                onChange={(e) => setEditScope(e.target.value as EditScope)}
                                className={styles.editScopeRadio}
                                data-testid="tr-edit-scope-series"
                            />
                            <span className={styles.editScopeLabel}>
                                Gesamte Serie
                                <small className={styles.editScopeDescription}>
                                    Ändert alle Trainings in der Serie (nur Zeit wird geändert)
                                </small>
                            </span>
                        </label>
                    </div>
                </div>
            )}
            
            <form onSubmit={handleSubmit} data-testid="tr-edit-form">
                {/* Date field - full width row */}
                <div className={styles.formField}>
                    <label className={styles.formLabel} htmlFor="date">Datum *</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className={styles.formInput}
                        disabled={editScope === 'series'}
                        required
                        data-testid="tr-edit-date"
                    />
                    {editScope === 'series' && (
                        <small className={styles.fieldNote}>
                            Datum kann nicht für die gesamte Serie geändert werden
                        </small>
                    )}
                </div>

                {/* Time fields - same row */}
                <div className={styles.timeFieldsRow}>
                    <div className={styles.formField}>
                        <label className={styles.formLabel} htmlFor="startTime">Startzeit *</label>
                        <input
                            type="time"
                            id="startTime"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            className={styles.formInput}
                            required
                            data-testid="tr-edit-start-time"
                        />
                    </div>

                    <div className={styles.formField}>
                        <label className={styles.formLabel} htmlFor="endTime">Endzeit *</label>
                        <input
                            type="time"
                            id="endTime"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            className={styles.formInput}
                            required
                            data-testid="tr-edit-end-time"
                        />
                    </div>
                </div>


                <div className={styles.formActions}>
                    <button
                        type="button"
                        onClick={onCancel}
                        className={`${styles.formButton} ${styles.formButtonSecondary}`}
                        disabled={loading}
                        data-testid="tr-edit-cancel"
                    >
                        Abbrechen
                    </button>
                    <button
                        type="submit"
                        className={`${styles.formButton} ${styles.formButtonPrimary}`}
                        disabled={loading}
                        data-testid="tr-edit-submit"
                    >
                        {loading ? "Speichere..." : "Änderungen speichern"}
                    </button>
                </div>
            </form>
        </>
    );
}
