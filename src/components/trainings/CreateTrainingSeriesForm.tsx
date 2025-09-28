// src/components/trainings/CreateTrainingSeriesForm.tsx
import { useState } from "react";
import { CreateTrainingSeriesData, getWeekStart } from "@/entities/Training";
import styles from "./Trainings.module.css";

type Props = {
    onSubmit: (series: CreateTrainingSeriesData) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
};

const WEEKDAYS = [
    { value: 1, label: 'Montag' },
    { value: 2, label: 'Dienstag' },
    { value: 3, label: 'Mittwoch' },
    { value: 4, label: 'Donnerstag' },
    { value: 5, label: 'Freitag' },
    { value: 6, label: 'Samstag' },
    { value: 7, label: 'Sonntag' },
];

export default function CreateTrainingSeriesForm({ onSubmit, onCancel, loading }: Props) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        weekdays: [] as number[],
        startTime: "",
        endTime: "",
        startWeek: "",
        endWeek: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.weekdays.length || !formData.startTime || !formData.endTime || !formData.startWeek || !formData.endWeek) {
            alert("Bitte füllen Sie alle Pflichtfelder aus.");
            return;
        }

        // Validate that end week is after start week
        const startWeek = new Date(formData.startWeek);
        const endWeek = new Date(formData.endWeek);
        
        if (endWeek < startWeek) {
            alert("Die Endwoche muss nach der Startwoche liegen.");
            return;
        }

        // Validate that start time is before end time
        if (formData.startTime >= formData.endTime) {
            alert("Die Startzeit muss vor der Endzeit liegen.");
            return;
        }

        await onSubmit({
            name: formData.name || undefined,
            description: formData.description || undefined,
            weekdays: formData.weekdays,
            startTime: formData.startTime,
            endTime: formData.endTime,
            startWeek: getWeekStart(startWeek),
            endWeek: getWeekStart(endWeek),
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleWeekdayChange = (weekday: number) => {
        setFormData(prev => ({
            ...prev,
            weekdays: prev.weekdays.includes(weekday)
                ? prev.weekdays.filter(w => w !== weekday)
                : [...prev.weekdays, weekday].sort()
        }));
    };

    const getPreviewText = () => {
        if (!formData.weekdays.length || !formData.startWeek || !formData.endWeek) {
            return "";
        }

        const startWeek = new Date(formData.startWeek);
        const endWeek = new Date(formData.endWeek);
        const weekdayNames = formData.weekdays.map(w => WEEKDAYS.find(wd => wd.value === w)?.label).join(', ');
        
        const weeks = Math.ceil((endWeek.getTime() - startWeek.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
        const totalTrainings = weeks * formData.weekdays.length;

        return `${weekdayNames} für ${weeks} Wochen (ca. ${totalTrainings} Trainings)`;
    };

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Neue Trainings-Serie erstellen</h2>
            
            <form onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                    <div className={styles.formField}>
                        <label className={styles.formLabel} htmlFor="name">Name (optional)</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={styles.formInput}
                            placeholder="z.B. Wintertraining 2024"
                        />
                    </div>

                    <div className={styles.formField}>
                        <label className={styles.formLabel} htmlFor="description">Beschreibung (optional)</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={styles.formTextarea}
                            placeholder="Zusätzliche Informationen zur Trainings-Serie"
                            rows={3}
                        />
                    </div>
                </div>

                <div className={styles.formField}>
                    <label className={styles.formLabel}>Trainingstage *</label>
                    <div className={styles.weekdayGrid}>
                        {WEEKDAYS.map(weekday => (
                            <label key={weekday.value} className={styles.weekdayLabel}>
                                <input
                                    type="checkbox"
                                    checked={formData.weekdays.includes(weekday.value)}
                                    onChange={() => handleWeekdayChange(weekday.value)}
                                    className={styles.weekdayCheckbox}
                                />
                                <span className={styles.weekdayText}>{weekday.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className={styles.formGrid}>
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
                        />
                    </div>
                </div>

                <div className={styles.formGrid}>
                    <div className={styles.formField}>
                        <label className={styles.formLabel} htmlFor="startWeek">Startwoche *</label>
                        <input
                            type="date"
                            id="startWeek"
                            name="startWeek"
                            value={formData.startWeek}
                            onChange={handleChange}
                            className={styles.formInput}
                            required
                        />
                    </div>

                    <div className={styles.formField}>
                        <label className={styles.formLabel} htmlFor="endWeek">Endwoche *</label>
                        <input
                            type="date"
                            id="endWeek"
                            name="endWeek"
                            value={formData.endWeek}
                            onChange={handleChange}
                            className={styles.formInput}
                            required
                        />
                    </div>
                </div>

                {getPreviewText() && (
                    <div className={styles.previewContainer}>
                        <h4 className={styles.previewTitle}>Vorschau:</h4>
                        <p className={styles.previewText}>{getPreviewText()}</p>
                    </div>
                )}

                <div className={styles.formActions}>
                    <button
                        type="button"
                        onClick={onCancel}
                        className={styles.cancelButton}
                        disabled={loading}
                    >
                        Abbrechen
                    </button>
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? "Erstelle..." : "Serie erstellen"}
                    </button>
                </div>
            </form>
        </div>
    );
}




