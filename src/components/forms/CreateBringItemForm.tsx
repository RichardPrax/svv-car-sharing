// src/components/forms/CreateBringItemForm.tsx
import { useState } from "react";
import { FormField, Input, Textarea, Button } from "@/components/forms";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";
import { useBringItems } from "@/hooks/matches/useBringItems";
import styles from "./Forms.module.css";

type Props = {
    matchId: string;
    onItemCreated: () => void;
    onCancel: () => void;
};

export default function CreateBringItemForm({ matchId, onItemCreated, onCancel }: Props) {
    const { user } = useOptimizedAuth();
    const { addBringItem } = useBringItems({ matchId });

    const [itemName, setItemName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
        <div className={styles.rideForm} data-testid="create-bring-item-form">
            {error && <div className={styles.rideFormError} data-testid="create-bring-item-form-error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className={styles.rideFormGrid}>
                    <FormField label="Was möchtest du mitbringen?">
                        <Input 
                            type="text" 
                            required 
                            placeholder="z.B. Trikots, Getränke, Bälle, Erste Hilfe..." 
                            value={itemName} 
                            onChange={(e) => setItemName(e.target.value)}
                            data-testid="create-bring-item-name"
                        />
                    </FormField>

                    <FormField label="Beschreibung (optional)">
                        <Textarea 
                            placeholder="Weitere Details zu dem Item..." 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            rows={3}
                            data-testid="create-bring-item-description"
                        />
                    </FormField>

                    <div className={styles.rideFormActions}>
                        <Button 
                            type="submit" 
                            variant="primary" 
                            disabled={loading || !itemName.trim()} 
                            className={styles.rideFormButton}
                            data-testid="create-bring-item-submit"
                        >
                            {loading ? "Wird hinzugefügt..." : "Hinzufügen"}
                        </Button>
                        <Button 
                            type="button" 
                            variant="secondary" 
                            onClick={onCancel} 
                            disabled={loading} 
                            className={styles.rideFormButton}
                            data-testid="create-bring-item-cancel"
                        >
                            Abbrechen
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}

