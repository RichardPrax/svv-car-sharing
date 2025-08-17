// src/pages/matches/[matchId].tsx
import { useRouter } from "next/router";
import { useState } from "react";
import { useMatchDetail } from "@/hooks/matches/useMatchDetail";
import { useUserRideCheck, useUserParticipationCheck } from "@/hooks/rides";
import { formatDate, formatTime } from "@/utils/dateTime";
import { CreateRideForm } from "@/components/forms";
import { RidesList } from "@/components/rides";
import { LoadingSpinner, Modal } from "@/components/ui";
import { ParticipationOverview } from "@/components/matches";
import styles from "../../styles/Pages.module.css";

export default function MatchDetailPage() {
    const router = useRouter();
    const { matchId } = router.query;
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showExistingRideWarning, setShowExistingRideWarning] = useState(false);

    const { match, loading, error } = useMatchDetail(matchId);
    const {
        hasExistingRide,
        loading: checkingRide,
        recheckExistingRide,
    } = useUserRideCheck({
        matchId: matchId as string,
        refreshTrigger,
    });
    const { isParticipating, recheckParticipation } = useUserParticipationCheck({
        matchId: matchId as string,
        refreshTrigger,
    });

    const handleBackClick = () => {
        router.push("/matches");
    };

    const handleRideCreated = () => {
        setShowCreateForm(false);
        setRefreshTrigger((prev) => prev + 1);
        recheckExistingRide();
        recheckParticipation();
    };

    const handleCancelCreate = () => {
        setShowCreateForm(false);
    };

    const handleShowCreateForm = () => {
        if (hasExistingRide) {
            setShowExistingRideWarning(true);
            setTimeout(() => setShowExistingRideWarning(false), 3000);
            return;
        }
        if (isParticipating) {
            setShowExistingRideWarning(true);
            setTimeout(() => setShowExistingRideWarning(false), 3000);
            return;
        }
        setShowCreateForm(true);
    };

    const handleRideUpdated = () => {
        setRefreshTrigger((prev) => prev + 1);
        recheckExistingRide();
        recheckParticipation();
    };

    // Warte bis Router geladen ist
    if (!router.isReady) {
        return <LoadingSpinner message="Lade Seite..." fullScreen />;
    }

    if (loading) {
        return <LoadingSpinner message="Lade Spieltag..." fullScreen />;
    }

    if (error || !match) {
        return (
            <div className={styles.errorContainer}>
                <p style={{ color: "#dc2626", textAlign: "center" }}>{error || "Spieltag nicht gefunden"}</p>
                <button onClick={handleBackClick} className={styles.backButton}>
                    Zurück zur Übersicht
                </button>
            </div>
        );
    }

    return (
        <div className={styles.matchDetailContainer}>
            <div className={styles.matchDetailWrapper}>
                {/* Header with Back Button */}
                <div className={styles.matchHeaderTop}>
                    <button onClick={handleBackClick} className={styles.backButton}>
                        ← Zurück
                    </button>
                </div>

                {/* Match Info Card */}
                <div className={styles.matchInfo}>
                    <h1 className={styles.matchTitle}>{formatDate(match.date)}</h1>

                    <div className={styles.matchInfoGrid}>
                        <div className={styles.matchInfoItem}>
                            <h3 className={styles.matchInfoLabel}>Zeit</h3>
                            <p className={styles.matchInfoValue}>{formatTime(match.time)}</p>
                        </div>

                        <div className={styles.matchInfoItem}>
                            <h3 className={styles.matchInfoLabel}>Gegner</h3>
                            <p className={styles.matchInfoValue}>{match.opponent}</p>
                        </div>

                        <div className={styles.matchInfoItem}>
                            <h3 className={styles.matchInfoLabel}>Ort</h3>
                            <p className={styles.matchInfoValue}>{match.location}</p>
                        </div>
                    </div>
                </div>

                {/* Participation Overview Section */}
                <ParticipationOverview matchId={match.id} refreshTrigger={refreshTrigger} />

                {/* Rides Section */}
                <div className={styles.ridesSection}>
                    <div className={styles.ridesSectionHeader}>
                        <h2 className={styles.ridesSectionTitle}>Fahrten</h2>
                        <div style={{ position: "relative" }}>
                            <button
                                onClick={handleShowCreateForm}
                                disabled={hasExistingRide || isParticipating || checkingRide}
                                title={
                                    hasExistingRide
                                        ? "Sie haben bereits eine Fahrt für diesen Spieltag angeboten"
                                        : isParticipating
                                        ? "Sie können keine eigene Fahrt anbieten, da Sie bereits als Mitfahrer angemeldet sind"
                                        : "Neue Fahrt anbieten"
                                }
                                className={styles.createRideButton}
                                style={{
                                    backgroundColor: hasExistingRide || isParticipating ? "#9ca3af" : "var(--text-accent)",
                                    cursor: hasExistingRide || isParticipating ? "not-allowed" : "pointer",
                                    opacity: hasExistingRide || isParticipating ? 0.7 : 1,
                                }}
                            >
                                {checkingRide ? "Überprüfe..." : hasExistingRide ? "Bereits angeboten" : isParticipating ? "Als Mitfahrer angemeldet" : "+ Fahrt anbieten"}
                            </button>

                            {showExistingRideWarning && (
                                <div
                                    className={styles.warningAlert}
                                    style={{
                                        position: "absolute",
                                        top: "calc(100% + 8px)",
                                        right: "0",
                                        fontSize: "0.875rem",
                                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                        zIndex: 10,
                                        maxWidth: "300px",
                                        whiteSpace: "normal",
                                    }}
                                >
                                    {hasExistingRide
                                        ? "Sie haben bereits eine Fahrt für diesen Spieltag angeboten"
                                        : "Sie können keine eigene Fahrt anbieten, da Sie bereits als Mitfahrer angemeldet sind"}
                                </div>
                            )}
                        </div>
                    </div>

                    <RidesList matchId={match.id} refreshTrigger={refreshTrigger} onRideUpdated={handleRideUpdated} />
                </div>

                {/* Modal für CreateRideForm */}
                <Modal isOpen={showCreateForm} onClose={handleCancelCreate} title="Fahrt anbieten" maxWidth="md">
                    <CreateRideForm matchId={match.id} onRideCreated={handleRideCreated} onCancel={handleCancelCreate} />
                </Modal>
            </div>
        </div>
    );
}
