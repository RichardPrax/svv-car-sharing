// src/components/forms/CreateRideForm.tsx
import { FormField, Input, Select, Textarea, Button } from "@/components/forms";
import { useCreateRide } from "@/hooks/rides/useCreateRide";

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
                Fahrt anbieten
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

            <form onSubmit={handleSubmit}>
                <div
                    style={{
                        display: "grid",
                        gap: "var(--spacing-md)",
                    }}
                >
                    <FormField label="Abfahrtszeit">
                        <Input type="time" required value={formData.departure_time} onChange={(e) => handleChange("departure_time", e.target.value)} />
                    </FormField>

                    <FormField label="Abfahrtsort">
                        <Input
                            type="text"
                            required
                            placeholder="z.B. Hauptbahnhof, Meine Adresse..."
                            value={formData.departure_location}
                            onChange={(e) => handleChange("departure_location", e.target.value)}
                        />
                    </FormField>

                    <FormField label="Verfügbare Plätze">
                        <Select value={formData.available_seats} onChange={(e) => handleChange("available_seats", parseInt(e.target.value))}>
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
                            value={formData.additional_info}
                            onChange={(e) => handleChange("additional_info", e.target.value)}
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
                            {loading ? "Wird erstellt..." : "Fahrt anbieten"}
                        </Button>
                        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading} style={{ width: "100%" }}>
                            Abbrechen
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
