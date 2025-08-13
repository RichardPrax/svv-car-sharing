// src/components/admin/UsersList.tsx
import { useAdminUsers } from "@/hooks/admin/useAdminUsers";
import { UserRole } from "@/entities/UserProfile";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import styles from "./UsersList.module.css";

const getRoleDisplayName = (role: UserRole): string => {
    switch (role) {
        case UserRole.ADMIN:
            return "Administrator";
        case UserRole.USER:
            return "Benutzer";
        case UserRole.TRAINER:
            return "Trainer";
        case UserRole.PENALTY_MASTER:
            return "Strafenmeister";
        case UserRole.PLAYER:
            return "Spieler";
        default:
            return role;
    }
};

const getRoleClassName = (role: UserRole): string => {
    switch (role) {
        case UserRole.ADMIN:
            return styles.roleAdmin;
        case UserRole.USER:
            return styles.roleUser;
        case UserRole.TRAINER:
            return styles.roleTrainer;
        case UserRole.PENALTY_MASTER:
            return styles.rolePenaltyMaster;
        case UserRole.PLAYER:
            return styles.rolePlayer;
        default:
            return styles.roleUser;
    }
};

export default function UsersList() {
    const { users, loading, error, refresh, totalUsers } = useAdminUsers();

    if (loading) {
        return <LoadingSpinner message="Benutzer werden geladen..." fullScreen />;
    }

    if (error) {
        return (
            <div className={styles.usersContainer}>
                <div className={styles.error}>
                    <p>Fehler beim Laden der Benutzer: {error}</p>
                    <button onClick={refresh} className={styles.refreshButton}>
                        Erneut versuchen
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.usersContainer}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Benutzer-Übersicht</h1>
                    <p className={styles.stats}>
                        {totalUsers} {totalUsers === 1 ? "Benutzer" : "Benutzer"} insgesamt
                    </p>
                </div>
                <button onClick={refresh} className={styles.refreshButton} disabled={loading}>
                    🔄 Aktualisieren
                </button>
            </div>

            {users.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyStateIcon}>👥</div>
                    <p>Keine Benutzer gefunden.</p>
                </div>
            ) : (
                <div className={styles.usersList}>
                    {users.map((user) => (
                        <div key={user.id} className={styles.userItem}>
                            <div className={styles.userInfo}>
                                <div className={styles.userName}>
                                    {user.firstName} {user.lastName}
                                </div>
                                <div className={styles.userDetails}>
                                    <span>ID: {user.id.slice(0, 8)}...</span>
                                    <span>Erstellt: {new Date(user.createdAt).toLocaleDateString("de-DE")}</span>
                                </div>
                            </div>
                            <div className={`${styles.userRole} ${getRoleClassName(user.role)}`}>{getRoleDisplayName(user.role)}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

