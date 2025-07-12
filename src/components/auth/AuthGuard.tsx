// src/components/auth/AuthGuard.tsx
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { LoadingSpinner } from "@/components/ui";

interface AuthGuardProps {
    children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Seiten, die ohne Login zugänglich sind - useMemo für Performance
    const publicRoutes = useMemo(() => ["/login"], []);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();

                if (user) {
                    setUser(user);
                } else {
                    // Nicht eingeloggt und nicht auf einer public Route
                    if (!publicRoutes.includes(router.pathname)) {
                        router.push("/login");
                        return;
                    }
                }
            } catch (error) {
                console.error("Auth check error:", error);
                if (!publicRoutes.includes(router.pathname)) {
                    router.push("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        checkUser();

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "SIGNED_IN" && session?.user) {
                setUser(session.user);
                // Redirect to homepage after login
                if (router.pathname === "/login") {
                    router.push("/");
                }
            } else if (event === "SIGNED_OUT") {
                setUser(null);
                router.push("/login");
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [router, publicRoutes]);

    // Loading state
    if (loading) {
        return <LoadingSpinner message="Authentifizierung..." fullScreen />;
    }

    // If on login page, show it regardless of auth state
    if (publicRoutes.includes(router.pathname)) {
        return <>{children}</>;
    }

    // If not authenticated and not on a public route, don't render anything
    // (redirect will happen in useEffect)
    if (!user) {
        return null;
    }

    // User is authenticated, show the protected content
    return <>{children}</>;
};

export default AuthGuard;

