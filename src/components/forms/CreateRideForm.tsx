// src/components/forms/CreateRideForm.tsx
import { FormField, Input, Select, Textarea, Button } from "@/components/forms";
import { useCreateRide } from "@/hooks/rides";
import styles from "./Forms.module.css";

type Props = {
    matchId: string;
    onRideCreated: () => void;
    onCancel: () => void;
};

export default function CreateRideForm({ matchId, onRideCreated, onCancel }: Props) {
    const { formData, loading, error, handleChange, handleSubmit } = useCreateRide({
        matchId,
        onSuccess: onRideCreated,
    });

    return (
        <div className={styles.rideForm} data-testid="create-ride-form">
            {error && <div className={styles.rideFormError} data-testid="create-ride-form-error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className={styles.rideFormGrid}>
                    <FormField label="Abfahrtszeit">
                        <Input 
                            type="time" 
                            required 
                            value={formData.departureTime} 
                            onChange={(e) => handleChange("departureTime", e.target.value)}
                            data-testid="create-ride-departure-time"
                        />
                    </FormField>

                    <FormField label="Abfahrtsort">
                        <Input
                            type="text"
                            required
                            placeholder="z.B. Hauptbahnhof, Meine Adresse..."
                            value={formData.departureLocation}
                            onChange={(e) => handleChange("departureLocation", e.target.value)}
                            data-testid="create-ride-departure-location"
                        />
                    </FormField>

                    <FormField label="Verfügbare Plätze">
                        <Select 
                            value={formData.availableSeats} 
                            onChange={(e) => handleChange("availableSeats", parseInt(e.target.value))}
                            data-testid="create-ride-available-seats"
                        >
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
                            data-testid="create-ride-additional-info"
                        />
                    </FormField>

                    <div className={styles.rideFormActions}>
                        <Button 
                            type="submit" 
                            variant="primary" 
                            disabled={loading} 
                            className={styles.rideFormButton}
                            data-testid="create-ride-submit"
                        >
                            {loading ? "Wird erstellt..." : "Fahrt anbieten"}
                        </Button>
                        <Button 
                            type="button" 
                            variant="secondary" 
                            onClick={onCancel} 
                            disabled={loading} 
                            className={styles.rideFormButton}
                            data-testid="create-ride-cancel"
                        >
                            Abbrechen
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}

