// src/hooks/rides/useOptimizedCurrentUser.tsx
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";

export function useOptimizedCurrentUser() {
    const { user, loading } = useOptimizedAuth();

    return {
        currentUserId: user?.id || null,
        user,
        loading,
    };
}

