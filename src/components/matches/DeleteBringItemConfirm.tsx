// src/components/matches/DeleteBringItemConfirm.tsx
import { Button } from "@/components/forms";
import styles from "../forms/Forms.module.css";

interface DeleteBringItemConfirmProps {
    itemName: string;
    loading: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function DeleteBringItemConfirm({ itemName, loading, onConfirm, onCancel }: DeleteBringItemConfirmProps) {
    return (
        <div className={styles.deleteConfirm}>
            <h4 className={styles.deleteConfirmTitle}>Item wirklich löschen?</h4>
            <p className={styles.deleteConfirmMessage}>
                Möchten Sie &quot;<strong>{itemName}</strong>&quot; wirklich aus der Mitbringen-Liste entfernen? Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className={styles.deleteConfirmActions}>
                <Button variant="secondary" onClick={onCancel} disabled={loading} className={styles.deleteConfirmButton}>
                    Abbrechen
                </Button>
                <Button variant="danger" onClick={onConfirm} disabled={loading} className={styles.deleteConfirmButtonDanger}>
                    {loading ? "Wird gelöscht..." : "Endgültig löschen"}
                </Button>
            </div>
        </div>
    );
}

