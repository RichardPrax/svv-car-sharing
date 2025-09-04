// src/hooks/admin/useDeleteUser.ts
import { useState } from "react";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";

export function useDeleteUser() {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { session } = useOptimizedAuth();

    const deleteUser = async (userId: string): Promise<void> => {
        if (!session?.access_token) {
            throw new Error("No access token available");
        }

        setIsDeleting(true);
        setError(null);

        try {
            const response = await fetch(`/api/user/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to delete user";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        deleteUser,
        isDeleting,
        error,
    };
}

