import { useState } from "react";
import { Icon, Modal } from "@/components/ui";
import { Button } from "@/components/forms";
import { TrainingList, NextTrainingCard, CreateTrainingForm, CreateTrainingSeriesForm, EditTrainingForm, DeleteTrainingConfirm, EditScope } from "@/components/trainings";
import { useTrainings, useCreateTraining, useUpdateTraining, useDeleteTraining, useCreateTrainingSeries } from "@/hooks/trainings";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { Training, CreateTrainingSeriesData } from "@/entities/Training";
import styles from "../styles/Pages.module.css";

export default function TrainingPage() {
    const { trainings, nextTraining, loading, error, refetch } = useTrainings();
    const { createTraining, loading: createLoading } = useCreateTraining();
    const { createTrainingSeries, loading: createSeriesLoading } = useCreateTrainingSeries();
    const { updateTraining, loading: updateLoading } = useUpdateTraining();
    const { deleteTraining, loading: deleteLoading } = useDeleteTraining();
    const { hasRole, hasAdminAccess } = useRoleGuard();
    const hasTrainerAccess = hasRole("TRAINER") || hasRole("ADMIN") || hasAdminAccess();
    
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showCreateSeriesForm, setShowCreateSeriesForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
    // const [createMode, setCreateMode] = useState<'single' | 'series'>('single');

    const handleCreateTraining = async (trainingData: Omit<Training, "id" | "createdAt" | "updatedAt">) => {
        try {
            await createTraining(trainingData);
            setShowCreateForm(false);
            refetch(); // Refresh the training list
        } catch {
            // Error is handled by the hook
        }
    };

    const handleEditTraining = (training: Training) => {
        setSelectedTraining(training);
        setShowEditForm(true);
    };

    const handleDeleteTraining = (training: Training) => {
        setSelectedTraining(training);
        setShowDeleteConfirm(true);
    };

    const handleCreateTrainingSeries = async (seriesData: CreateTrainingSeriesData) => {
        try {
            await createTrainingSeries(seriesData);
            setShowCreateSeriesForm(false);
            refetch(); // Refresh the training list
        } catch {
            // Error is handled by the hook
        }
    };

    const handleUpdateTraining = async (updatedTraining: Training, editScope: EditScope) => {
        try {
            await updateTraining(updatedTraining, editScope);
            setShowEditForm(false);
            setSelectedTraining(null);
            refetch(); // Refresh the training list
        } catch {
            // Error is handled by the hook
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedTraining) return;
        
        try {
            await deleteTraining(selectedTraining.id);
            setShowDeleteConfirm(false);
            setSelectedTraining(null);
            refetch(); // Refresh the training list
        } catch {
            // Error is handled by the hook
        }
    };

    const handleCancelEdit = () => {
        setShowEditForm(false);
        setSelectedTraining(null);
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
        setSelectedTraining(null);
    };

    return (
        <>
            <div className={styles.pageContainerFullHeight}>
                <div className={styles.pageWrapper}>
                    {/* Page Header */}
                    <section className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>
                            <Icon name="runner" size={32} color="#3ecf8e" />
                            Training
                        </h1>
                        {hasTrainerAccess && (
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <Button 
                                    onClick={() => setShowCreateForm(true)}
                                    variant="primary"
                                >
                                    <Icon name="plus" size={16} color="currentColor" />
                                    <span style={{ marginLeft: '6px' }}>Einzelnes Training</span>
                                </Button>
                                <Button 
                                    onClick={() => setShowCreateSeriesForm(true)}
                                    variant="secondary"
                                >
                                    <Icon name="calendar" size={16} color="currentColor" />
                                    <span style={{ marginLeft: '6px' }}>Trainings-Serie</span>
                                </Button>
                            </div>
                        )}
                    </section>

                    {/* Next Training Card */}
                    {nextTraining && (
                        <section className={styles.sectionContainer}>
                            <h2 className={styles.sectionTitle}>Nächstes Training</h2>
                            <NextTrainingCard training={nextTraining} loading={loading} />
                        </section>
                    )}

                    {/* Training List */}
                    <section>
                        <h2 className={styles.sectionTitle}>Alle Trainings</h2>
                        {error && (
                            <div className={styles.errorSection}>
                                <p className={styles.errorText}>{error}</p>
                            </div>
                        )}
                        <TrainingList 
                            trainings={trainings} 
                            loading={loading} 
                            onEdit={handleEditTraining}
                            onDelete={handleDeleteTraining}
                        />
                    </section>
                </div>
            </div>

            {/* Create Training Modal */}
            {showCreateForm && (
                <Modal 
                    isOpen={showCreateForm}
                    onClose={() => setShowCreateForm(false)}
                    title="Neues Training erstellen"
                >
                    <CreateTrainingForm
                        onSubmit={handleCreateTraining}
                        onCancel={() => setShowCreateForm(false)}
                        loading={createLoading}
                    />
                </Modal>
            )}

            {/* Create Training Series Modal */}
            {showCreateSeriesForm && (
                <Modal 
                    isOpen={showCreateSeriesForm}
                    onClose={() => setShowCreateSeriesForm(false)}
                    title="Neue Trainings-Serie erstellen"
                >
                    <CreateTrainingSeriesForm
                        onSubmit={handleCreateTrainingSeries}
                        onCancel={() => setShowCreateSeriesForm(false)}
                        loading={createSeriesLoading}
                    />
                </Modal>
            )}

            {/* Edit Training Modal */}
            {showEditForm && selectedTraining && (
                <Modal 
                    isOpen={showEditForm}
                    onClose={handleCancelEdit}
                    title="Training bearbeiten"
                >
                    <EditTrainingForm
                        training={selectedTraining}
                        onSubmit={handleUpdateTraining}
                        onCancel={handleCancelEdit}
                        loading={updateLoading}
                    />
                </Modal>
            )}

            {/* Delete Training Modal */}
            {showDeleteConfirm && selectedTraining && (
                <Modal 
                    isOpen={showDeleteConfirm}
                    onClose={handleCancelDelete}
                    title="Training löschen"
                >
                    <DeleteTrainingConfirm
                        training={selectedTraining}
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                        loading={deleteLoading}
                    />
                </Modal>
            )}
        </>
    );
}

