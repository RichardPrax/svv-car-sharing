// src/components/admin/DeleteUserConfirm.tsx
import { Button } from "@/components/forms";
import { UserProfileWithPositions } from "@/entities/UserProfile";
import styles from "../forms/Forms.module.css";

interface DeleteUserConfirmProps {
    user: UserProfileWithPositions;
    loading: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function DeleteUserConfirm({ user, loading, onConfirm, onCancel }: DeleteUserConfirmProps) {
    const userName = `${user.firstName} ${user.lastName}`;

    return (
        <div className={styles.deleteConfirm}>
            <h4 className={styles.deleteConfirmTitle}>Benutzer wirklich löschen?</h4>
            <p className={styles.deleteConfirmMessage}>
                Möchten Sie den Benutzer &quot;<strong>{userName}</strong>&quot; wirklich aus dem System entfernen?
            </p>
            <div className={styles.deleteWarning}>
                <p>
                    <strong>⚠️ Achtung:</strong> Diese Aktion kann nicht rückgängig gemacht werden!
                </p>
            </div>
            <div className={styles.deleteConfirmActions}>
                <Button variant="secondary" onClick={onCancel} disabled={loading} className={styles.deleteConfirmButton} data-testid="delete-user-cancel">
                    Abbrechen
                </Button>
                <Button variant="danger" onClick={onConfirm} disabled={loading} className={styles.deleteConfirmButtonDanger} data-testid="delete-user-confirm">
                    {loading ? "Wird gelöscht..." : "Endgültig löschen"}
                </Button>
            </div>
        </div>
    );
}

