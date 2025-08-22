// src/components/admin/UsersList.tsx
import React from "react";
import { useAdminUsers } from "@/hooks/admin/useAdminUsers";
import { UserRole, UserProfile } from "@/entities/UserProfile";
import { UserEditHandler, UserDeleteHandler } from "./types";
import { UsersListSkeleton } from "@/components/ui/SkeletonLoader";
import { Icon } from "@/components/ui";
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
    const { users, loading, error, refresh } = useAdminUsers();

    const handleEdit: UserEditHandler = (user) => {
        // TODO: Implementierung für Benutzer bearbeiten
        alert(`Bearbeiten: ${user.firstName} ${user.lastName}`);
    };

    const handleDelete: UserDeleteHandler = (user) => {
        // TODO: Implementierung für Benutzer löschen
        alert(`Löschen: ${user.firstName} ${user.lastName}`);
    };

    return (
        <div className={styles.usersContainer}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>
                    <Icon name="users" size={32} color="var(--primary)" />
                    Benutzer-Übersicht
                </h1>
            </div>

            {loading ? (
                <UsersListSkeleton count={6} />
            ) : error ? (
                <div className={styles.error}>
                    <p>Fehler beim Laden der Benutzer: {error}</p>
                    <button onClick={refresh} className={styles.errorButton}>
                        Erneut versuchen
                    </button>
                </div>
            ) : users.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyStateIcon}>
                        <Icon name="users" size={48} color="var(--text-muted)" />
                    </div>
                    <p>Keine Benutzer gefunden.</p>
                </div>
            ) : (
                <div className={styles.usersList}>
                    {users.map((user: UserProfile) => (
                        <div key={user.id} className={styles.userItem}>
                            <div className={styles.userItemContent}>
                                <div className={styles.userHeader}>
                                    <div className={styles.userInfo}>
                                        <div className={styles.userName}>
                                            {user.firstName} {user.lastName}
                                        </div>
                                    </div>
                                    <div className={styles.userActions}>
                                        <div className={`${styles.userRole} ${getRoleClassName(user.role)}`}>
                                            {getRoleDisplayName(user.role)}
                                        </div>
                                        <div className={styles.actionButtons}>
                                            <button 
                                                onClick={() => handleEdit(user)}
                                                className={styles.editButton}
                                                title="Benutzer bearbeiten"
                                                type="button"
                                                aria-label={`${user.firstName} ${user.lastName} bearbeiten`}
                                            >
                                                <Icon name="edit" size={16} color="currentColor" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(user)}
                                                className={styles.deleteButton}
                                                title="Benutzer löschen"
                                                type="button"
                                                aria-label={`${user.firstName} ${user.lastName} löschen`}
                                            >
                                                <Icon name="delete" size={16} color="currentColor" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

