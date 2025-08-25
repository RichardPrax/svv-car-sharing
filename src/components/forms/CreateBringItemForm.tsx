// src/components/forms/CreateBringItemForm.tsx
import { useState } from "react";
import { FormField, Input, Textarea, Button } from "@/components/forms";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";
import { CreateBringItemData } from "@/entities/BringItem";
import styles from "./Forms.module.css";

type Props = {
    matchId: string;
    onItemCreated: () => void;
    onCancel: () => void;
};

export default function CreateBringItemForm({ matchId, onItemCreated, onCancel }: Props) {
    const { user } = useOptimizedAuth();

    const [itemName, setItemName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addBringItem = async (data: CreateBringItemData) => {
        const response = await fetch(`/api/matches/${matchId}/bring-items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to add bring item");
        }

        return response.json();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user || !itemName.trim()) return;

        setLoading(true);
        setError(null);

        try {
            await addBringItem({
                userId: user.id,
                itemName: itemName.trim(),
                description: description.trim() || undefined,
            });

            onItemCreated();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Fehler beim Hinzufügen des Items");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.rideForm}>
            {error && <div className={styles.rideFormError}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className={styles.rideFormGrid}>
                    <FormField label="Was möchtest du mitbringen?">
                        <Input type="text" required placeholder="z.B. Trikots, Getränke, Bälle, Erste Hilfe..." value={itemName} onChange={(e) => setItemName(e.target.value)} />
                    </FormField>

                    <FormField label="Beschreibung (optional)">
                        <Textarea placeholder="Weitere Details zu dem Item..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
                    </FormField>

                    <div className={styles.rideFormActions}>
                        <Button type="submit" variant="primary" disabled={loading || !itemName.trim()} className={styles.rideFormButton}>
                            {loading ? "Wird hinzugefügt..." : "Hinzufügen"}
                        </Button>
                        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading} className={styles.rideFormButton}>
                            Abbrechen
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}

