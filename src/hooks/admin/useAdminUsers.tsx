// src/hooks/admin/useAdminUsers.tsx
import { useState, useEffect, useCallback } from "react";
import { UserProfileWithPositions } from "@/entities/UserProfile";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";

interface AdminUsersResponse {
    users: UserProfileWithPositions[];
    total: number;
    requestedBy: {
        id: string;
        name: string;
        role: string;
    };
}

export function useAdminUsers() {
    const [users, setUsers] = useState<UserProfileWithPositions[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { session } = useOptimizedAuth();

    const fetchUsers = useCallback(async () => {
        if (!session?.access_token) {
            setError("No access token available");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch("/api/admin/users", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data: AdminUsersResponse = await response.json();
            setUsers(data.users);
        } catch (err) {
            console.error("Error fetching admin users:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    }, [session?.access_token]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const refresh = () => {
        fetchUsers();
    };

    return {
        users,
        loading,
        error,
        refresh,
        totalUsers: users.length,
    };
}

