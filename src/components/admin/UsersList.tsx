// src/components/admin/UsersList.tsx
import { useState } from "react";
import { useAdminUsers, useDeleteUser } from "@/hooks/admin";
import { UserRole, UserProfileWithPositions, VolleyballPosition, getPositionDisplayName, getPositionColor, hasAdminAccess } from "@/entities/UserProfile";
import { UserEditHandler, UserDeleteHandler } from "./types";
import { UsersListSkeleton } from "@/components/ui/SkeletonLoader";
import { Icon } from "@/components/ui";
import { Modal } from "@/components/ui";
import { DeleteUserConfirm } from "@/components/admin";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";
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
    const { userProfile: currentUserProfile } = useOptimizedAuth();
    const { users, loading, error, refresh } = useAdminUsers();
    const { deleteUser, isDeleting } = useDeleteUser();
    const [deleteUserToDelete, setDeleteUserToDelete] = useState<UserProfileWithPositions | null>(null);

    // Check if current user has admin access
    const canDeleteUsers = currentUserProfile && hasAdminAccess(currentUserProfile);

    const handleEdit: UserEditHandler = (user) => {
        // TODO: Implementierung für Benutzer bearbeiten
        alert(`Bearbeiten: ${user.firstName} ${user.lastName}`);
    };

    const handleDeleteClick: UserDeleteHandler = (user) => {
        if (!canDeleteUsers) return;
        setDeleteUserToDelete(user);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteUserToDelete || !currentUserProfile) return;

        try {
            await deleteUser(deleteUserToDelete.id);
            setDeleteUserToDelete(null);
            refresh(); // Refresh the users list
        } catch (err) {
            console.error("Error deleting user:", err);
            // Error is already handled in the hook, we just close the modal
            setDeleteUserToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteUserToDelete(null);
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
                    {users.map((user: UserProfileWithPositions) => (
                        <div key={user.id} className={styles.userItem}>
                            <div className={styles.userItemContent}>
                                <div className={styles.userHeader}>
                                    <div className={styles.userInfo}>
                                        <div className={styles.userName}>
                                            {user.firstName} {user.lastName}
                                        </div>
                                        {user.playerPositions && user.playerPositions.length > 0 && (
                                            <div className={styles.userPositions}>
                                                {user.playerPositions.map((position) => (
                                                    <span
                                                        key={position.id}
                                                        className={`${styles.positionBadge} ${position.isPrimary ? styles.primaryPosition : styles.secondaryPosition}`}
                                                        style={{
                                                            backgroundColor: getPositionColor(position.position as VolleyballPosition),
                                                            color: "white",
                                                        }}
                                                        title={`${getPositionDisplayName(position.position as VolleyballPosition)} ${
                                                            position.isPrimary ? "(Hauptposition)" : "(Nebenposition)"
                                                        }`}
                                                    >
                                                        {position.position}
                                                        {position.isPrimary && <span className={styles.primaryIndicator}>★</span>}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.userActions}>
                                        <div className={`${styles.userRole} ${getRoleClassName(user.role)}`}>{getRoleDisplayName(user.role)}</div>
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
                                                onClick={() => handleDeleteClick(user)}
                                                className={styles.deleteButton}
                                                title="Benutzer löschen"
                                                type="button"
                                                aria-label={`${user.firstName} ${user.lastName} löschen`}
                                                disabled={!canDeleteUsers || user.id === currentUserProfile?.id}
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

            {/* Delete Confirmation Modal */}
            <Modal isOpen={!!deleteUserToDelete} onClose={handleDeleteCancel} title="Benutzer löschen" maxWidth="md" data-testid="delete-user-modal">
                {deleteUserToDelete && <DeleteUserConfirm user={deleteUserToDelete} loading={isDeleting} onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} />}
            </Modal>
        </div>
    );
}

