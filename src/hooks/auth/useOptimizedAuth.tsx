// src/hooks/auth/useOptimizedAuth.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
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

    const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
        try {
            const response = await fetch(`/api/user/${userId}`);
            if (!response.ok) {
                if (response.status === 404) {
                    return null;
                }
                throw new Error("Failed to fetch user profile");
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching user profile:", error);
            return null;
        }
    };

    const refreshUserProfile = async () => {
        if (user?.id) {
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
    }, []);

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

