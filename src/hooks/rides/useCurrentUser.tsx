// src/hooks/rides/useCurrentUser.tsx
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";

export function useCurrentUser() {
    const { user, loading } = useOptimizedAuth();
    
    return { 
        currentUserId: user?.id || null, 
        loading 
    };
}
