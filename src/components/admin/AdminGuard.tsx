// src/components/admin/AdminGuard.tsx
import { ReactNode } from "react";
import { useRouter } from "next/router";
import { useAdminGuard } from "@/hooks/auth/useRoleGuard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import styles from "./AdminGuard.module.css";

interface AdminGuardProps {
    children: ReactNode;
    fallback?: ReactNode;
}

export default function AdminGuard({ children, fallback }: AdminGuardProps) {
    const { isAuthorized, loading, userProfile } = useAdminGuard();
    const router = useRouter();

    // Show loading while checking authorization
    if (loading) {
        return <LoadingSpinner message="Berechtigung wird geprüft..." fullScreen />;
    }

    // Show unauthorized message if user is not admin
    if (!isAuthorized) {
        if (fallback) {
            return <>{fallback}</>;
        }

        return (
            <div className={styles.adminGuard}>
                <div className={styles.unauthorized}>
                    <div className={styles.unauthorizedIcon}>🔒</div>
                    <h2 className={styles.unauthorizedTitle}>Zugriff verweigert</h2>
                    <p className={styles.unauthorizedText}>
                        Du benötigst Administrator-Rechte, um auf diesen Bereich zuzugreifen.
                        {userProfile && (
                            <>
                                <br />
                                Deine aktuelle Rolle: <strong>{userProfile.role}</strong>
                            </>
                        )}
                    </p>
                    <button className={styles.backButton} onClick={() => router.push("/")}>
                        Zurück zur Startseite
                    </button>
                </div>
            </div>
        );
    }

    // User is authorized, render children
    return <>{children}</>;
}

