// src/components/forms/EditRideForm.tsx
import { RideWithDetails } from "@/entities/Ride";
import { FormField, Input, Select, Textarea, Button } from "@/components/forms";
import { useEditRide } from "@/hooks/rides";

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
        <div
            style={{
                backgroundColor: "var(--card-background)",
                border: "1px solid var(--card-border)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--spacing-lg)",
                marginTop: "var(--spacing-lg)",
                maxWidth: "100%",
                overflow: "hidden",
            }}
        >
            <h3
                style={{
                    fontSize: "1.125rem",
                    fontWeight: "700",
                    color: "var(--text-primary)",
                    marginBottom: "var(--spacing-lg)",
                    textAlign: "center",
                }}
            >
                Fahrt bearbeiten
            </h3>

            {error && (
                <div
                    style={{
                        backgroundColor: "#fef2f2",
                        color: "#dc2626",
                        padding: "var(--spacing-sm)",
                        borderRadius: "var(--radius-sm)",
                        marginBottom: "var(--spacing-md)",
                        fontSize: "0.875rem",
                    }}
                >
                    {error}
                </div>
            )}

            {showDeleteConfirm ? (
                <div
                    style={{
                        textAlign: "center",
                        padding: "var(--spacing-lg)",
                    }}
                >
                    <h4
                        style={{
                            fontSize: "1rem",
                            fontWeight: "600",
                            color: "#dc2626",
                            marginBottom: "var(--spacing-md)",
                        }}
                    >
                        Fahrt wirklich löschen?
                    </h4>
                    <p
                        style={{
                            fontSize: "0.875rem",
                            color: "var(--text-secondary)",
                            marginBottom: "var(--spacing-lg)",
                            lineHeight: 1.5,
                        }}
                    >
                        Diese Aktion kann nicht rückgängig gemacht werden. Die Fahrt und alle Anmeldungen werden permanent gelöscht.
                    </p>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "var(--spacing-xs)",
                            justifyContent: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} disabled={loading} style={{ flex: 1, minWidth: "80px" }}>
                            Abbrechen
                        </Button>
                        <Button variant="danger" onClick={handleDeleteConfirm} disabled={loading} style={{ flex: 1, minWidth: "100px" }}>
                            {loading ? "Wird gelöscht..." : "Endgültig löschen"}
                        </Button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div
                        style={{
                            display: "grid",
                            gap: "var(--spacing-md)",
                        }}
                    >
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

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--spacing-sm)",
                                marginTop: "var(--spacing-md)",
                            }}
                        >
                            <Button type="submit" variant="primary" disabled={loading} style={{ width: "100%" }}>
                                {loading ? "Wird gespeichert..." : "Änderungen speichern"}
                            </Button>
                            <Button type="button" variant="secondary" onClick={onCancel} disabled={loading} style={{ width: "100%" }}>
                                Abbrechen
                            </Button>
                            <Button type="button" variant="danger" onClick={() => setShowDeleteConfirm(true)} disabled={loading} style={{ width: "100%" }}>
                                Fahrt löschen
                            </Button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}

