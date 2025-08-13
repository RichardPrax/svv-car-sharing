// src/pages/admin/index.tsx
import { useRouter } from "next/router";
import { AdminGuard } from "@/components/admin";
import AppLayout from "@/components/layout/AppLayout";
import { useAdminGuard } from "@/hooks/auth/useRoleGuard";
import styles from "@/styles/Pages.module.css";

export default function AdminDashboardPage() {
    const router = useRouter();
    const { userProfile } = useAdminGuard();

    return (
        <AppLayout>
            <AdminGuard>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Admin Dashboard</h1>
                        <p className={styles.subtitle}>
                            Willkommen, {userProfile?.firstName} {userProfile?.lastName}
                            <span className={styles.badge}>{userProfile?.role === "ADMIN" ? "Administrator" : "Trainer"}</span>
                        </p>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.card} onClick={() => router.push("/admin/users")} role="button" tabIndex={0}>
                            <div className={styles.cardIcon}>👥</div>
                            <h3 className={styles.cardTitle}>Benutzer verwalten</h3>
                            <p className={styles.cardDescription}>Übersicht aller registrierten Benutzer und deren Rollen</p>
                        </div>

                        <div className={`${styles.card} ${styles.cardDisabled}`}>
                            <div className={styles.cardIcon}>🚗</div>
                            <h3 className={styles.cardTitle}>Fahrten verwalten</h3>
                            <p className={styles.cardDescription}>Alle Fahrten einsehen und verwalten (coming soon)</p>
                        </div>

                        <div className={`${styles.card} ${styles.cardDisabled}`}>
                            <div className={styles.cardIcon}>⚽</div>
                            <h3 className={styles.cardTitle}>Spiele verwalten</h3>
                            <p className={styles.cardDescription}>Spielplan und Termine verwalten (coming soon)</p>
                        </div>

                        <div className={`${styles.card} ${styles.cardDisabled}`}>
                            <div className={styles.cardIcon}>📊</div>
                            <h3 className={styles.cardTitle}>Statistiken</h3>
                            <p className={styles.cardDescription}>Übersicht über Nutzung und Statistiken (coming soon)</p>
                        </div>
                    </div>
                </div>
            </AdminGuard>
        </AppLayout>
    );
}

