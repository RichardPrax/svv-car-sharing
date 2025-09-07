import { useState } from "react";
import { useRouter } from "next/router";
import { LoadingSpinner, Modal } from "@/components/ui";
import { TrainingDetail, EditTrainingForm, DeleteTrainingConfirm } from "@/components/trainings";
import { useTrainingDetail, useUpdateTraining, useDeleteTraining } from "@/hooks/trainings";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { Training } from "@/entities/Training";
import { formatDateForId } from "@/utils/dateTime";
import styles from "../../styles/Pages.module.css";

export default function TrainingDetailPage() {
    const router = useRouter();
    const { trainingId } = router.query;
    const { training, loading, error } = useTrainingDetail(trainingId);
    const { updateTraining, loading: updateLoading } = useUpdateTraining();
    const { deleteTraining, loading: deleteLoading } = useDeleteTraining();
    const { hasRole, hasAdminAccess } = useRoleGuard();
    const hasTrainerAccess = hasRole("TRAINER") || hasRole("ADMIN") || hasAdminAccess();
    
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleBackClick = () => {
        router.push("/training");
    };

    const handleEdit = () => {
        setShowEditForm(true);
    };

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const handleUpdateTraining = async (updatedTraining: Training) => {
        try {
            await updateTraining(updatedTraining);
            setShowEditForm(false);
            router.reload(); // Refresh the page to show updated data
        } catch (error) {
            // Error is handled by the hook
        }
    };

    const handleDeleteTraining = async () => {
        try {
            if (training) {
                await deleteTraining(training.id);
                setShowDeleteConfirm(false);
                router.push("/training");
            }
        } catch (error) {
            // Error is handled by the hook
        }
    };

    // Wait until router is ready
    if (!router.isReady) {
        return (
            <div className={styles.pageContainerFullHeight}>
                <div className={styles.pageWrapper}>
                    <div className={styles.loadingSection}>
                        <LoadingSpinner message="Lade Seite..." />
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className={styles.pageContainerFullHeight}>
                <div className={styles.pageWrapper}>
                    <div className={styles.loadingSection}>
                        <LoadingSpinner message="Lade Training..." />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !training) {
        return (
            <div className={styles.errorContainer}>
                <p style={{ color: "#dc2626", textAlign: "center" }}>{error || "Training nicht gefunden"}</p>
                <button onClick={handleBackClick} className={styles.backButton}>
                    Zurück zur Übersicht
                </button>
            </div>
        );
    }

    return (
        <>
            <div data-testid={`training-${formatDateForId(training.date)}-detail`} className={styles.pageContainerFullHeight}>
                <div className={styles.pageWrapper}>
                    {/* Header with Back Button */}
                    <div className={styles.matchHeaderTop}>
                        <button 
                            data-testid={`training-${formatDateForId(training.date)}-back`}
                            onClick={handleBackClick} 
                            className={styles.backButton}
                        >
                            ← Zurück
                        </button>
                    </div>

                    {/* Training Detail */}
                    <TrainingDetail
                        training={training}
                        onEdit={hasTrainerAccess ? handleEdit : undefined}
                        onDelete={hasTrainerAccess ? handleDelete : undefined}
                        canEdit={hasTrainerAccess}
                    />
                </div>
            </div>

            {/* Edit Training Modal */}
            {showEditForm && training && (
                <Modal 
                    isOpen={showEditForm}
                    onClose={() => setShowEditForm(false)}
                    title="Training bearbeiten"
                >
                    <EditTrainingForm
                        training={training}
                        onSubmit={handleUpdateTraining}
                        onCancel={() => setShowEditForm(false)}
                        loading={updateLoading}
                    />
                </Modal>
            )}

            {/* Delete Training Modal */}
            {showDeleteConfirm && training && (
                <Modal 
                    isOpen={showDeleteConfirm}
                    onClose={() => setShowDeleteConfirm(false)}
                    title="Training löschen"
                >
                    <DeleteTrainingConfirm
                        training={training}
                        onConfirm={handleDeleteTraining}
                        onCancel={() => setShowDeleteConfirm(false)}
                        loading={deleteLoading}
                    />
                </Modal>
            )}
        </>
    );
}
