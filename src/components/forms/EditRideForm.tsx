// src/components/forms/EditRideForm.tsx
import { RideWithDetails } from "@/entities/Ride";
import { FormField, Input, Select, Textarea, Button } from "@/components/forms";
import { useEditRide } from "@/hooks/rides";
import styles from "./Forms.module.css";

type Props = {
    ride: RideWithDetails;
    onRideUpdated: () => void;
    onCancel: () => void;
    onDelete: () => void;
};

export default function EditRideForm({ ride, onRideUpdated, onCancel, onDelete }: Props) {
    const { formData, loading, error, showDeleteConfirm, handleChange, handleSubmit, setShowDeleteConfirm, handleDeleteConfirm } = useEditRide({
        ride,
        onSuccess: onRideUpdated,
        onDelete,
    });

    return (
        <div className={styles.rideForm}>
            <h3 className={styles.rideFormTitle}>Fahrt bearbeiten</h3>

            {error && <div className={styles.rideFormError}>{error}</div>}

            {showDeleteConfirm ? (
                <div className={styles.deleteConfirm}>
                    <h4 className={styles.deleteConfirmTitle}>Fahrt wirklich löschen?</h4>
                    <p className={styles.deleteConfirmMessage}>Diese Aktion kann nicht rückgängig gemacht werden. Die Fahrt und alle Anmeldungen werden permanent gelöscht.</p>
                    <div className={styles.deleteConfirmActions}>
                        <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} disabled={loading} className={styles.deleteConfirmButton}>
                            Abbrechen
                        </Button>
                        <Button variant="danger" onClick={handleDeleteConfirm} disabled={loading} className={styles.deleteConfirmButtonDanger}>
                            {loading ? "Wird gelöscht..." : "Endgültig löschen"}
                        </Button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className={styles.rideFormGrid}>
                        <FormField label="Abfahrtszeit">
                            <Input type="time" required value={formData.departureTime} onChange={(e) => handleChange("departureTime", e.target.value)} />
                        </FormField>

                        <FormField label="Abfahrtsort">
                            <Input
                                type="text"
                                required
                                placeholder="z.B. Hauptbahnhof, Meine Adresse..."
                                value={formData.departureLocation}
                                onChange={(e) => handleChange("departureLocation", e.target.value)}
                            />
                        </FormField>

                        <FormField label="Verfügbare Plätze">
                            <Select value={formData.availableSeats} onChange={(e) => handleChange("availableSeats", parseInt(e.target.value))}>
                                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                                    <option key={num} value={num}>
                                        {num} {num === 1 ? "Platz" : "Plätze"}
                                    </option>
                                ))}
                            </Select>
                        </FormField>

                        <FormField label="Zusätzliche Informationen (optional)">
                            <Textarea
                                placeholder="z.B. Rückfahrt um 18:00, bringe Bälle mit..."
                                value={formData.additionalInfo}
                                onChange={(e) => handleChange("additionalInfo", e.target.value)}
                                rows={3}
                            />
                        </FormField>

                        <div className={styles.rideFormActions}>
                            <Button type="submit" variant="primary" disabled={loading} className={styles.rideFormButton}>
                                {loading ? "Wird gespeichert..." : "Änderungen speichern"}
                            </Button>
                            <Button type="button" variant="secondary" onClick={onCancel} disabled={loading} className={styles.rideFormButton}>
                                Abbrechen
                            </Button>
                            <Button type="button" variant="danger" onClick={() => setShowDeleteConfirm(true)} disabled={loading} className={styles.rideFormButton}>
                                Fahrt löschen
                            </Button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}

