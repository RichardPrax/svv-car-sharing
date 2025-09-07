// src/pages/trainings/[trainingId].tsx
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Training, formatTrainingDate, formatTrainingTimeRange } from "@/entities/Training";
import { formatDateForId } from "@/utils/dateTime";
import { LoadingSpinner, Tabs, TabList, Tab, TabPanel, UsersIcon } from "@/components/ui";
import { TrainingParticipationSummary } from "@/components/trainings";
import { TrainingParticipationOverview } from "@/hooks/trainings/useBatchedTrainingParticipationOverview";
import styles from "../../styles/Pages.module.css";

export default function TrainingDetailPage() {
    const router = useRouter();
    const { trainingId } = router.query;
    
    const [training, setTraining] = useState<Training | null>(null);
    const [participationOverview, setParticipationOverview] = useState<TrainingParticipationOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTrainingDetails = async () => {
        if (!trainingId || typeof trainingId !== "string") return;

        try {
            setLoading(true);
            setError(null);

            // Fetch training details
            const trainingResponse = await fetch(`/api/trainings/${trainingId}`);
            if (!trainingResponse.ok) {
                throw new Error("Training nicht gefunden");
            }
            const trainingData = await trainingResponse.json();
            
            // Convert date strings to Date objects
            const trainingWithDates = {
                ...trainingData,
                date: new Date(trainingData.date),
                createdAt: new Date(trainingData.createdAt),
                updatedAt: new Date(trainingData.updatedAt),
            };
            setTraining(trainingWithDates);

            // Fetch participation overview
            const participationResponse = await fetch(`/api/trainings/${trainingId}/participation/overview`);
            if (participationResponse.ok) {
                const participationData = await participationResponse.json();
                setParticipationOverview(participationData);
            } else {
                console.warn("Could not fetch participation overview");
                setParticipationOverview(null);
            }

        } catch (err) {
            console.error("Error fetching training details:", err);
            setError(err instanceof Error ? err.message : "Fehler beim Laden des Trainings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (router.isReady && trainingId) {
            fetchTrainingDetails();
        }
    }, [router.isReady, trainingId]);

    const handleBackClick = () => {
        router.push("/training");
    };

    // Wait until router is loaded
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
            <div className={styles.pageContainerFullHeight}>
                <div className={styles.pageWrapper}>
                    <div className={styles.errorContainer}>
                        <p style={{ color: "#dc2626", textAlign: "center" }}>{error || "Training nicht gefunden"}</p>
                        <button onClick={handleBackClick} className={styles.backButton}>
                            Zurück zur Übersicht
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div data-testid={`training-${formatDateForId(training.date)}-detail`} className={styles.matchDetailContainer}>
            <div className={styles.matchDetailWrapper}>
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

                {/* Training Info Card */}
                <div className={styles.matchInfo}>
                    <div className={styles.matchInfoHeader}>
                        <h1 className={styles.matchInfoTitle}>Training</h1>
                        <div className={styles.matchInfoDate}>
                            <span>{formatTrainingDate(training)}</span>
                            <span className={styles.matchInfoTime}>{formatTrainingTimeRange(training)}</span>
                        </div>
                    </div>

                    {training.description && (
                        <div className={styles.matchInfoDetails}>
                            <div className={styles.matchInfoDetail}>
                                <span className={styles.matchInfoDetailLabel}>Beschreibung:</span>
                                <span className={styles.matchInfoDetailValue}>{training.description}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Training Content */}
                <div className={styles.matchContent}>
                    <Tabs defaultActiveTab="participation">
                        <TabList>
                            <Tab id="participation">
                                <UsersIcon size={16} />
                                Teilnahme
                            </Tab>
                        </TabList>

                        <TabPanel id="participation">
                            <TrainingParticipationSummary
                                trainingId={training.id}
                                trainingDate={training.date}
                                participationOverview={participationOverview}
                            />
                        </TabPanel>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
