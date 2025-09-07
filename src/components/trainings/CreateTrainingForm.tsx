// src/components/trainings/CreateTrainingForm.tsx
import { useState } from "react";
import { Training } from "@/entities/Training";
import styles from "./Trainings.module.css";

type Props = {
    onSubmit: (training: Omit<Training, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
};

export default function CreateTrainingForm({ onSubmit, onCancel, loading }: Props) {
    const [formData, setFormData] = useState({
        date: "",
        startTime: "",
        endTime: "",
        location: "",
        description: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.date || !formData.startTime || !formData.endTime || !formData.location) {
            alert("Bitte füllen Sie alle Pflichtfelder aus.");
            return;
        }

        await onSubmit({
            date: new Date(formData.date),
            startTime: formData.startTime,
            endTime: formData.endTime,
            location: formData.location,
            description: formData.description || null,
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Neues Training erstellen</h2>
            
            <form onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                    <div className={styles.formField}>
                        <label className={styles.formLabel} htmlFor="date">Datum *</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className={styles.formInput}
                            required
                        />
                    </div>

                    <div className={styles.formField}>
                        <label className={styles.formLabel} htmlFor="location">Ort *</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className={styles.formInput}
                            placeholder="z.B. Vereinsheim"
                            required
                        />
                    </div>

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

                <div className={styles.formField}>
                    <label className={styles.formLabel} htmlFor="description">Beschreibung</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className={styles.formTextarea}
                        placeholder="Zusätzliche Informationen zum Training..."
                    />
                </div>

                <div className={styles.formActions}>
                    <button
                        type="button"
                        onClick={onCancel}
                        className={`${styles.formButton} ${styles.formButtonSecondary}`}
                        disabled={loading}
                    >
                        Abbrechen
                    </button>
                    <button
                        type="submit"
                        className={`${styles.formButton} ${styles.formButtonPrimary}`}
                        disabled={loading}
                    >
                        {loading ? "Erstelle..." : "Training erstellen"}
                    </button>
                </div>
            </form>
        </div>
    );
}
