// src/components/matches/BringItems.tsx
import React, { useState } from "react";
import { useBringItems } from "@/hooks/matches/useBringItems";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";
import { CreateBringItemForm } from "@/components/forms";
import { DeleteBringItemConfirm } from "@/components/matches";
import { Modal } from "@/components/ui";
import { BringItem } from "@/entities/BringItem";
import styles from "./BringItems.module.css";

interface BringItemsProps {
    matchId: string;
}

export default function BringItems({ matchId }: BringItemsProps) {
    const { user } = useOptimizedAuth();
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const { bringItems, loading, error, deleteBringItem } = useBringItems({ matchId, refreshTrigger });

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [deleteItem, setDeleteItem] = useState<BringItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleItemCreated = () => {
        setShowCreateForm(false);
        // Trigger refresh to show the new item
        setRefreshTrigger((prev) => prev + 1);
    };

    const handleCancelCreate = () => {
        setShowCreateForm(false);
    };

    const handleDeleteClick = (item: BringItem) => {
        setDeleteItem(item);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteItem || !user) return;

        setIsDeleting(true);
        try {
            await deleteBringItem(deleteItem.id, user.id);
            setDeleteItem(null);
        } catch (err) {
            console.error("Error deleting bring item:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteItem(null);
    };

    const getUserDisplayName = (firstName: string, lastName: string) => {
        return `${firstName} ${lastName}`;
    };

    const isUserItem = (itemUserId: string) => {
        return user?.id === itemUserId;
    };

    if (loading && bringItems.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>🎒 Was müssen wir mitbringen?</h2>
                </div>
                <div className={styles.loading}>Lade Mitbringen-Liste...</div>
            </div>
        );
    }

    return (
        <>
            <div className={styles.container}>
                {error && <div className={styles.error}>{error}</div>}

                {/* Add Item Button */}
                {user && (
                    <div className={styles.addSection}>
                        <button onClick={() => setShowCreateForm(true)} className={styles.addButton}>
                            ➕ Etwas mitbringen
                        </button>
                    </div>
                )}

                {/* Items List */}
                <div className={styles.itemsList}>
                    {bringItems.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>📝</div>
                            <h3 className={styles.emptyTitle}>Noch keine Einträge</h3>
                            <p className={styles.emptyText}>
                                {user ? "Sei der Erste und trage ein, was du mitbringen möchtest!" : "Melde dich an, um etwas zur Liste hinzuzufügen."}
                            </p>
                        </div>
                    ) : (
                        <>
                            {bringItems.map((item) => (
                                <div key={item.id} className={styles.item}>
                                    <div className={styles.itemHeader}>
                                        <span className={styles.itemName}>{item.itemName}</span>
                                        <div className={styles.itemMeta}>
                                            <span className={styles.itemUser}>✅ {getUserDisplayName(item.user.firstName, item.user.lastName)}</span>
                                            {isUserItem(item.userId) && (
                                                <button onClick={() => handleDeleteClick(item)} className={styles.deleteButton} title="Löschen">
                                                    🗑️
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {item.description && <p className={styles.itemDescription}>{item.description}</p>}
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>

            {/* Create Item Modal */}
            <Modal isOpen={showCreateForm} onClose={handleCancelCreate} title="Etwas mitbringen" maxWidth="md">
                <CreateBringItemForm matchId={matchId} onItemCreated={handleItemCreated} onCancel={handleCancelCreate} />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={!!deleteItem} onClose={handleDeleteCancel} title="Item löschen" maxWidth="sm">
                {deleteItem && <DeleteBringItemConfirm itemName={deleteItem.itemName} loading={isDeleting} onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} />}
            </Modal>
        </>
    );
}

