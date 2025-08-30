// src/components/forms/EditRideForm.tsx
import { RideWithDetails } from "@/entities/Ride";
import { FormField, Input, Select, Textarea, Button } from "@/components/forms";
import { useEditRide } from "@/hooks/rides";
import styles from "./Forms.module.css";

type Props = {
    ride: RideWithDetails;
    onRideUpdated: () => void;
    onCancel: () => void;
};

export default function EditRideForm({ ride, onRideUpdated, onCancel }: Props) {
    const { formData, loading, error, handleChange, handleSubmit } = useEditRide({
        ride,
        onSuccess: onRideUpdated,
    });

    return (
        <div className={styles.rideForm}>
            {error && <div className={styles.rideFormError}>{error}</div>}

            <form onSubmit={handleSubmit} data-testid="edit-ride-form">
                <div className={styles.rideFormGrid}>
                        <FormField label="Abfahrtszeit">
                            <Input type="time" required value={formData.departureTime} onChange={(e) => handleChange("departureTime", e.target.value)} data-testid="edit-ride-departure-time" />
                        </FormField>

                        <FormField label="Abfahrtsort">
                            <Input
                                type="text"
                                required
                                placeholder="z.B. Hauptbahnhof, Meine Adresse..."
                                value={formData.departureLocation}
                                onChange={(e) => handleChange("departureLocation", e.target.value)}
                                data-testid="edit-ride-departure-location"
                            />
                        </FormField>

                        <FormField label="Verfügbare Plätze">
                            <Select value={formData.availableSeats} onChange={(e) => handleChange("availableSeats", parseInt(e.target.value))} data-testid="edit-ride-available-seats">
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
                                data-testid="edit-ride-additional-info"
                            />
                        </FormField>

                        <div className={styles.rideFormActions}>
                            <Button type="submit" variant="primary" disabled={loading} className={styles.rideFormButton} data-testid="edit-ride-submit">
                                {loading ? "Wird gespeichert..." : "Änderungen speichern"}
                            </Button>
                            <Button type="button" variant="secondary" onClick={onCancel} disabled={loading} className={styles.rideFormButton} data-testid="edit-ride-cancel">
                                Abbrechen
                            </Button>
                        </div>
                    </div>
                </form>
        </div>
    );
}

