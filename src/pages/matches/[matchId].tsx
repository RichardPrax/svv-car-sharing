// src/pages/matches/[matchId].tsx
import { useRouter } from "next/router";
import { useMatchDetailBatch } from "@/hooks/matches/useMatchDetailBatch";
import { formatDate, formatTime, formatDateForId } from "@/utils/dateTime";
import { RidesList } from "@/components/rides";
import { LoadingSpinner, Tabs, TabList, Tab, TabPanel, UsersIcon, CarIcon, BagIcon } from "@/components/ui";
import { ParticipationSummary, BringItems } from "@/components/matches";
import styles from "../../styles/Pages.module.css";

export default function MatchDetailPage() {
    const router = useRouter();
    const { matchId } = router.query;

    // Use the new batched hook that fetches all data in one request
    const { 
        match, 
        participationOverview, 
        loading, 
        error 
    } = useMatchDetailBatch({
        matchId,
    });

    const handleBackClick = () => {
        router.push("/matches");
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
                            <RidesList 
                                matchId={match.id}
                                matchDate={match.date}
                            />
                        </div>
                    </TabPanel>

                    <TabPanel value="bring-items">
                        <div data-testid="md-content-bring-items">
                            <BringItems matchId={match.id} />
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    );
}

