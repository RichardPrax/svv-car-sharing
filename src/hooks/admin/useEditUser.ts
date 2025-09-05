// src/hooks/admin/useEditUser.ts
import { useState, useCallback } from "react";
import { UserProfileWithPositions, UserRole, VolleyballPosition, getAssignableRoles } from "@/entities/UserProfile";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";

interface EditUserFormData {
    role: UserRole;
    primaryPosition?: VolleyballPosition | "";
    secondaryPosition?: VolleyballPosition | "";
}

interface UseEditUserOptions {
    user: UserProfileWithPositions;
    onSuccess?: () => void;
}

interface EditUserPositionData {
    primaryPosition?: VolleyballPosition | "";
    secondaryPosition?: VolleyballPosition | "";
}

export function useEditUser({ user, onSuccess }: UseEditUserOptions) {
    const { userProfile: currentUserProfile, session } = useOptimizedAuth();

    const [formData, setFormData] = useState<EditUserFormData>({
        role: user.role,
        primaryPosition: user.playerPositions.find((p) => p.isPrimary)?.position || "",
        secondaryPosition: user.playerPositions.find((p) => !p.isPrimary)?.position || "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get assignable roles based on current user's role
    const assignableRoles = currentUserProfile ? getAssignableRoles(currentUserProfile.role) : [];

    const handleChange = useCallback((field: keyof EditUserFormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        setError(null);
    }, []);

    const handleSubmit = useCallback(
        async (e: React.FormEvent, positionData?: EditUserPositionData) => {
            e.preventDefault();

            if (!session?.access_token) {
                setError("Nicht authentifiziert");
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const updateData = {
                    role: formData.role,
                    primaryPosition: positionData?.primaryPosition || formData.primaryPosition,
                    secondaryPosition: positionData?.secondaryPosition || formData.secondaryPosition,
                };

                const response = await fetch(`/api/admin/users/${user.id}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updateData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Fehler beim Aktualisieren des Benutzers");
                }

                onSuccess?.();
            } catch (err) {
                console.error("Error updating user:", err);
                setError(err instanceof Error ? err.message : "Fehler beim Aktualisieren des Benutzers");
            } finally {
                setLoading(false);
            }
        },
        [formData, session?.access_token, user.id, onSuccess]
    );

    return {
        formData,
        loading,
        error,
        assignableRoles,
        handleChange,
        handleSubmit,
    };
}

