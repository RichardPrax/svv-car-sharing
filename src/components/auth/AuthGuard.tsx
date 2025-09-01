// src/components/auth/AuthGuard.tsx
import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";
import { LoadingSpinner } from "@/components/ui";

interface AuthGuardProps {
    children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
    const { user, loading } = useOptimizedAuth();
    const router = useRouter();

    // Seiten, die ohne Login zugänglich sind - useMemo für Performance
    const publicRoutes = useMemo(() => ["/login"], []);

    useEffect(() => {
        // Nur redirect, keine zusätzlichen Auth-Calls
        if (!loading) {
            if (!user) {
                // Nicht eingeloggt und nicht auf einer public Route
                if (!publicRoutes.includes(router.pathname)) {
                    router.push("/login");
                }
            }
        }
    }, [user, loading, router, publicRoutes]);

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

