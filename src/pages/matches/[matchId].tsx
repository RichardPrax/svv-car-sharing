// src/pages/matches/[matchId].tsx
import { useRouter } from "next/router";
import { useState } from "react";
import { useMatchDetailBatch } from "@/hooks/matches/useMatchDetailBatch";
import { formatDate, formatTime, formatDateForId } from "@/utils/dateTime";
import { CreateRideForm } from "@/components/forms";
import { RidesList } from "@/components/rides";
import { LoadingSpinner, Modal, Tabs, TabList, Tab, TabPanel, UsersIcon, CarIcon, BagIcon } from "@/components/ui";
import { ParticipationSummary, BringItems } from "@/components/matches";
import styles from "../../styles/Pages.module.css";

export default function MatchDetailPage() {
    const router = useRouter();
    const { matchId } = router.query;
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showExistingRideWarning, setShowExistingRideWarning] = useState(false);

    // Use the new batched hook that fetches all data in one request
    const { 
        match, 
        participationOverview, 
        rides, 
        userRideCheck, 
        userParticipationCheck, 
        loading, 
        error 
    } = useMatchDetailBatch({
        matchId,
        refreshTrigger,
    });

    const handleBackClick = () => {
        router.push("/matches");
    };

    const handleRideCreated = () => {
        setShowCreateForm(false);
        setRefreshTrigger((prev) => prev + 1);
    };

    const handleCancelCreate = () => {
        setShowCreateForm(false);
    };

    const handleShowCreateForm = () => {
        if (userRideCheck?.hasExistingRide) {
            setShowExistingRideWarning(true);
            setTimeout(() => setShowExistingRideWarning(false), 3000);
            return;
        }
        if (userParticipationCheck?.isParticipating) {
            setShowExistingRideWarning(true);
            setTimeout(() => setShowExistingRideWarning(false), 3000);
            return;
        }
        setShowCreateForm(true);
    };

    const handleRideUpdated = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    // Warte bis Router geladen ist
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
                        <LoadingSpinner message="Lade Spieltag..." />
                    </div>
                </div>
            </div>
        );
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
        <div data-testid={`md-${formatDateForId(match.date)}-detail`} className={styles.matchDetailContainer}>
            <div className={styles.matchDetailWrapper}>
                {/* Header with Back Button */}
                <div className={styles.matchHeaderTop}>
                    <button 
                        data-testid={`md-${formatDateForId(match.date)}-back`}
                        onClick={handleBackClick} 
                        className={styles.backButton}
                    >
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

                {/* Tab Navigation */}
                <Tabs defaultTab="participation" className={styles.matchTabs}>
                    <TabList>
                        <Tab 
                            value="participation" 
                            icon={<UsersIcon size={18} />} 
                            badge={participationOverview?.counts.open}
                            data-testid="md-tab-participation"
                        >
                            Teilnahme
                        </Tab>
                        <Tab 
                            value="rides" 
                            icon={<CarIcon size={18} />}
                            data-testid="md-tab-rides"
                        >
                            Fahrten
                        </Tab>
                        <Tab 
                            value="bring-items" 
                            icon={<BagIcon size={18} />}
                            data-testid="md-tab-bring-items"
                        >
                            Mitbringen
                        </Tab>
                    </TabList>

                    <TabPanel value="participation">
                        <div data-testid="md-content-participation">
                            <ParticipationSummary 
                                matchId={match.id}
                                matchDate={match.date}
                                participationOverview={participationOverview}
                            />
                        </div>
                    </TabPanel>

                    <TabPanel value="rides">
                        <div data-testid="md-content-rides" className={styles.ridesTabContent}>
                            <div className={styles.summaryHeader}>
                                <h2 className={styles.summaryTitle}>Fahrten-Übersicht</h2>
                                <div className={styles.summaryActions}>
                                    <button
                                        data-testid="md-create-ride"
                                        onClick={handleShowCreateForm}
                                        disabled={userRideCheck?.hasExistingRide || userParticipationCheck?.isParticipating || loading}
                                        title={
                                            userRideCheck?.hasExistingRide
                                                ? "Sie haben bereits eine Fahrt für diesen Spieltag angeboten"
                                                : userParticipationCheck?.isParticipating
                                                ? "Sie können keine eigene Fahrt anbieten, da Sie bereits als Mitfahrer angemeldet sind"
                                                : "Neue Fahrt anbieten"
                                        }
                                        className={styles.headerActionButton}
                                        style={{
                                            backgroundColor: userRideCheck?.hasExistingRide || userParticipationCheck?.isParticipating ? "#9ca3af" : undefined,
                                            cursor: userRideCheck?.hasExistingRide || userParticipationCheck?.isParticipating ? "not-allowed" : "pointer",
                                            opacity: userRideCheck?.hasExistingRide || userParticipationCheck?.isParticipating ? 0.7 : 1,
                                        }}
                                    >
                                        {loading ? "Überprüfe..." : userRideCheck?.hasExistingRide ? "Bereits angeboten" : userParticipationCheck?.isParticipating ? "Als Mitfahrer angemeldet" : "+ Fahrt anbieten"}
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
                                            {userRideCheck?.hasExistingRide
                                                ? "Sie haben bereits eine Fahrt für diesen Spieltag angeboten"
                                                : "Sie können keine eigene Fahrt anbieten, da Sie bereits als Mitfahrer angemeldet sind"}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <RidesList 
                                matchId={match.id}
                                matchDate={match.date}
                                onRideUpdated={handleRideUpdated}
                                rides={rides}
                                userRideCheck={userRideCheck}
                                userParticipationCheck={userParticipationCheck}
                            />
                        </div>
                    </TabPanel>

                    <TabPanel value="bring-items">
                        <div data-testid="md-content-bring-items">
                            <BringItems matchId={match.id} matchDate={match.date} />
                        </div>
                    </TabPanel>
                </Tabs>

                {/* Modal für CreateRideForm */}
                <Modal isOpen={showCreateForm} onClose={handleCancelCreate} title="Fahrt anbieten" maxWidth="md">
                    <CreateRideForm matchId={match.id} onRideCreated={handleRideCreated} onCancel={handleCancelCreate} />
                </Modal>
            </div>
        </div>
    );
}

