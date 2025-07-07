// src/components/auth/OptimizedAuthGuard.tsx
import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";

interface OptimizedAuthGuardProps {
    children: React.ReactNode;
}

const OptimizedAuthGuard = ({ children }: OptimizedAuthGuardProps) => {
    const { user, loading } = useOptimizedAuth();
    const router = useRouter();

    // Seiten, die ohne Login zugänglich sind - useMemo für Performance
    const publicRoutes = useMemo(() => ["/login"], []);

    useEffect(() => {
        if (loading) return; // Warte bis Loading abgeschlossen ist

        const isPublicRoute = publicRoutes.includes(router.pathname);

        if (!user && !isPublicRoute) {
            // Nicht eingeloggt und nicht auf einer public Route
            router.push("/login");
        } else if (user && router.pathname === "/login") {
            // Eingeloggt aber auf Login-Seite -> zur Startseite
            router.push("/");
        }
    }, [user, loading, router, publicRoutes]);

    // Loading state
    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    fontSize: "1.2rem",
                }}
            >
                Lade...
            </div>
        );
    }

    // Show content für public routes auch ohne user
    const isPublicRoute = publicRoutes.includes(router.pathname);
    if (!user && !isPublicRoute) {
        return null; // Redirect läuft bereits
    }

    return <>{children}</>;
};

export default OptimizedAuthGuard;

