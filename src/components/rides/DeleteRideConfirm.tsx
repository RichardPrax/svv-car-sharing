// src/components/rides/DeleteRideConfirm.tsx
import { Button } from "@/components/forms";
import styles from "../forms/Forms.module.css";

interface DeleteRideConfirmProps {
    loading: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function DeleteRideConfirm({ loading, onConfirm, onCancel }: DeleteRideConfirmProps) {
    return (
        <div className={styles.deleteConfirm}>
            <h4 className={styles.deleteConfirmTitle}>Fahrt wirklich löschen?</h4>
            <p className={styles.deleteConfirmMessage}>
                Alle angemeldeten Mitfahrer werden automatisch ausgetragen. Diese Aktion kann nicht rückgängig gemacht werden.
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
