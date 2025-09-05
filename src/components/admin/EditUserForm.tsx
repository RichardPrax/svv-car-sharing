// src/components/admin/EditUserForm.tsx
import { useState } from "react";
import { UserProfileWithPositions, UserRole, VolleyballPosition, getPositionDisplayName } from "@/entities/UserProfile";
import { FormField, Input, Select, Button } from "@/components/forms";
import { useEditUser } from "@/hooks/admin";
import styles from "./EditUserForm.module.css";

type Props = {
    user: UserProfileWithPositions;
    onUserUpdated: () => void;
    onCancel: () => void;
};

const getRoleDisplayName = (role: UserRole): string => {
    switch (role) {
        case UserRole.ADMIN:
            return "Administrator";
        case UserRole.TRAINER:
            return "Trainer";
        case UserRole.PENALTY_MASTER:
            return "Strafenmeister";
        case UserRole.PLAYER:
            return "Spieler";
        default:
            return role;
    }
};

export default function EditUserForm({ user, onUserUpdated, onCancel }: Props) {
    const { formData, loading, error, assignableRoles, handleChange, handleSubmit } = useEditUser({
        user,
        onSuccess: onUserUpdated,
    });

    const [primaryPosition, setPrimaryPosition] = useState<VolleyballPosition | "">(user.playerPositions.find((p) => p.isPrimary)?.position || "");
    const [secondaryPosition, setSecondaryPosition] = useState<VolleyballPosition | "">(user.playerPositions.find((p) => !p.isPrimary)?.position || "");

    const handlePositionChange = (type: "primary" | "secondary", value: VolleyballPosition | "") => {
        if (type === "primary") {
            setPrimaryPosition(value);
            handleChange("primaryPosition", value);
        } else {
            setSecondaryPosition(value);
            handleChange("secondaryPosition", value);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(e, { primaryPosition, secondaryPosition });
    };

    return (
        <div className={styles.editUserForm}>
            {error && <div className={styles.editUserFormError}>{error}</div>}

            <form onSubmit={handleFormSubmit} data-testid="edit-user-form">
                <div className={styles.editUserFormGrid}>
                    <FormField label="Vorname">
                        <Input type="text" value={user.firstName} disabled className={styles.disabledInput} data-testid="edit-user-first-name" />
                    </FormField>

                    <FormField label="Nachname">
                        <Input type="text" value={user.lastName} disabled className={styles.disabledInput} data-testid="edit-user-last-name" />
                    </FormField>

                    <FormField label="Rolle">
                        <Select value={formData.role} onChange={(e) => handleChange("role", e.target.value as UserRole)} data-testid="edit-user-role">
                            {assignableRoles.map((role) => (
                                <option key={role} value={role}>
                                    {getRoleDisplayName(role)}
                                </option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField label="Hauptposition (optional)">
                        <Select
                            value={primaryPosition}
                            onChange={(e) => handlePositionChange("primary", e.target.value as VolleyballPosition | "")}
                            data-testid="edit-user-primary-position"
                        >
                            <option value="">Keine Position ausgewählt</option>
                            {Object.values(VolleyballPosition).map((position) => (
                                <option key={position} value={position}>
                                    {position} - {getPositionDisplayName(position)}
                                </option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField label="Nebenposition (optional)">
                        <Select
                            value={secondaryPosition}
                            onChange={(e) => handlePositionChange("secondary", e.target.value as VolleyballPosition | "")}
                            data-testid="edit-user-secondary-position"
                        >
                            <option value="">Keine Position ausgewählt</option>
                            {Object.values(VolleyballPosition)
                                .filter((position) => position !== primaryPosition) // Verhindere doppelte Auswahl
                                .map((position) => (
                                    <option key={position} value={position}>
                                        {position} - {getPositionDisplayName(position)}
                                    </option>
                                ))}
                        </Select>
                    </FormField>

                    <div className={styles.editUserFormActions}>
                        <Button type="submit" variant="primary" disabled={loading} className={styles.editUserFormButton} data-testid="edit-user-submit">
                            {loading ? "Wird gespeichert..." : "Änderungen speichern"}
                        </Button>
                        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading} className={styles.editUserFormButton} data-testid="edit-user-cancel">
                            Abbrechen
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}

