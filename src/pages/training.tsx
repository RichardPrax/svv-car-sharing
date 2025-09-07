import { useState } from "react";
import { Icon, Modal } from "@/components/ui";
import { Button } from "@/components/forms";
import { TrainingList, NextTrainingCard, CreateTrainingForm } from "@/components/trainings";
import { useTrainings, useCreateTraining } from "@/hooks/trainings";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { Training } from "@/entities/Training";
import styles from "../styles/Pages.module.css";

export default function TrainingPage() {
    const { trainings, nextTraining, loading, error, refetch } = useTrainings();
    const { createTraining, loading: createLoading } = useCreateTraining();
    const { hasRole, hasAdminAccess } = useRoleGuard();
    const hasTrainerAccess = hasRole("TRAINER") || hasRole("ADMIN") || hasAdminAccess();
    const [showCreateForm, setShowCreateForm] = useState(false);

    const handleCreateTraining = async (trainingData: Omit<Training, "id" | "createdAt" | "updatedAt">) => {
        try {
            await createTraining(trainingData);
            setShowCreateForm(false);
            refetch(); // Refresh the training list
        } catch (error) {
            // Error is handled by the hook
        }
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
                            <Button 
                                onClick={() => setShowCreateForm(true)}
                                variant="primary"
                            >
                                ➕ Training erstellen
                            </Button>
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
                        <TrainingList trainings={trainings} loading={loading} />
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
        </>
    );
}

