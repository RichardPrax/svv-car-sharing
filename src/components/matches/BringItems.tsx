// src/components/matches/BringItems.tsx
import { useState } from "react";
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
            <div className={styles.bringItemsContainer}>
                <div className={styles.summaryHeader}>
                    <h2 className={styles.summaryTitle}>Mitbringen-Übersicht</h2>
                    <div className={styles.summaryActions}>
                        {user && (
                            <button onClick={() => setShowCreateForm(true)} className={styles.headerActionButton}>
                                ➕ Etwas mitbringen
                            </button>
                        )}
                    </div>
                </div>
                <div className={styles.container}>
                    <div className={styles.loading}>Lade Mitbringen-Liste...</div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.bringItemsContainer}>
            <div className={styles.summaryHeader}>
                <h2 className={styles.summaryTitle}>Mitbringen-Übersicht</h2>
                <div className={styles.summaryActions}>
                    {user && (
                        <button onClick={() => setShowCreateForm(true)} className={styles.headerActionButton}>
                            ➕ Etwas mitbringen
                        </button>
                    )}
                </div>
            </div>

            <div className={styles.container}>
                {error && <div className={styles.error}>{error}</div>}

                {/* Items List */}
                <div className={styles.itemsList}>
                    {bringItems.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyText}>Noch keine Einträge</p>
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
        </div>
    );
}

