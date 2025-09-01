// src/hooks/auth/useAuthenticatedFetch.ts
import { useOptimizedAuth } from "./useOptimizedAuth";

export function useAuthenticatedFetch() {
    const { session } = useOptimizedAuth();

    const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
        const headers = new Headers(options.headers);

        // Add auth header if session exists
        if (session?.access_token) {
            headers.set('Authorization', `Bearer ${session.access_token}`);
        }

        return fetch(url, {
            ...options,
            headers,
        });
    };

    return { authenticatedFetch, isAuthenticated: !!session };
}
