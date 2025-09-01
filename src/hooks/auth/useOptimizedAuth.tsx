// src/hooks/auth/useOptimizedAuth.tsx
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { UserProfile } from "@/entities/UserProfile";

interface AuthContextType {
    user: User | null;
    session: Session | null;
    userProfile: UserProfile | null;
    loading: boolean;
    refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Keep emergency timeout as a safety net but with longer duration
    useEffect(() => {
        const emergencyTimeout = setTimeout(() => {
            console.warn("⚠️ Authentication taking too long - forcing completion");
            setLoading(false);
        }, 15000); // 15 seconds maximum

        return () => clearTimeout(emergencyTimeout);
    }, []);

    const fetchUserProfile = useCallback(async (userId: string, retryAttempt = 0): Promise<UserProfile | null> => {
        const maxRetries = 1;
        const retryDelay = 1000; // 1 second
        
        // Check sessionStorage cache first (client-side only)
        if (typeof window !== 'undefined') {
            const cacheKey = `userProfile_${userId}`;
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
                try {
                    const { data, timestamp } = JSON.parse(cached);
                    // Cache for 5 minutes
                    if (Date.now() - timestamp < 5 * 60 * 1000) {
                        return data;
                    } else {
                        sessionStorage.removeItem(cacheKey);
                    }
                } catch {
                    sessionStorage.removeItem(cacheKey);
                }
            }
        }
        
        try {
            const response = await fetch(`/api/user/${userId}`);
            if (!response.ok) {
                if (response.status === 404) {
                    // For newly registered users, the profile might not be available immediately
                    // Retry a few times before giving up
                    if (retryAttempt < maxRetries) {
                        console.log(`User profile not found, retrying in ${retryDelay}ms (attempt ${retryAttempt + 1}/${maxRetries})`);
                        await new Promise(resolve => setTimeout(resolve, retryDelay));
                        return fetchUserProfile(userId, retryAttempt + 1);
                    }
                    return null;
                }
                throw new Error("Failed to fetch user profile");
            }
            
            const data = await response.json();
            
            // Cache in sessionStorage (client-side only)
            if (typeof window !== 'undefined') {
                const cacheKey = `userProfile_${userId}`;
                sessionStorage.setItem(cacheKey, JSON.stringify({
                    data,
                    timestamp: Date.now()
                }));
            }
            
            return data;
        } catch (error) {
            console.error("Error fetching user profile:", error);
            return null;
        }
    }, []);

    const refreshUserProfile = async () => {
        if (user?.id) {
            // Clear cache on refresh
            if (typeof window !== 'undefined') {
                sessionStorage.removeItem(`userProfile_${user.id}`);
            }
            const profile = await fetchUserProfile(user.id);
            setUserProfile(profile);
        }
    };

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            try {
                const {
                    data: { session },
                    error,
                } = await supabase.auth.getSession();

                if (error) {
                    console.warn("Session error (non-critical):", error);
                    // Don't throw on session errors, just continue with null session
                }

                setSession(session);
                setUser(session?.user || null);

                // Fetch user profile if user exists
                if (session?.user?.id) {
                    const profile = await fetchUserProfile(session.user.id);
                    setUserProfile(profile);
                }
            } catch (error) {
                console.error("Error getting initial session:", error);
                // Set user to null even on error to avoid infinite loading
                setSession(null);
                setUser(null);
                setUserProfile(null);
            } finally {
                setLoading(false);
            }
        };

        getInitialSession();

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth state changed:", event);

            setSession(session);
            setUser(session?.user || null);

            if (event === "SIGNED_IN" && session?.user?.id) {
                // Fetch user profile on sign in
                const profile = await fetchUserProfile(session.user.id);
                setUserProfile(profile);
            } else if (event === "SIGNED_OUT") {
                // Clear user profile on sign out
                setUserProfile(null);
            }

            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [fetchUserProfile]);

    const value: AuthContextType = {
        user,
        session,
        userProfile,
        loading,
        refreshUserProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useOptimizedAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useOptimizedAuth must be used within an AuthProvider");
    }
    return context;
}

// Convenience hooks for common use cases
export function useCurrentUser() {
    const { user, loading } = useOptimizedAuth();
    return {
        currentUserId: user?.id || null,
        user,
        loading,
    };
}

export function useUserProfile() {
    const { userProfile, loading, refreshUserProfile } = useOptimizedAuth();
    return {
        profile: userProfile,
        loading,
        refreshUserProfile,
    };
}

