import { MatchDayList, NextMatchCard } from "@/components/matches";
import { LoadingSpinner, Icon } from "@/components/ui";
import { useMatches } from "@/hooks/matches/useMatches";
import { isMatchInFuture, sortMatchesByDateTime } from "@/utils/dateTime";
import styles from "../../styles/Pages.module.css";

export default function MatchesPage() {
    const { matchDays, loading, error } = useMatches();

    // Sort all matches by date and time
    const sortedMatchDays = sortMatchesByDateTime(matchDays);

    // Find the next upcoming match
    const nextMatch = sortedMatchDays.find((match) => isMatchInFuture(match.date, match.time));

    if (loading) return <LoadingSpinner message="Lade Spieltage..." fullScreen />;
    if (error) return <p className={styles.errorText}>Fehler beim Laden der Spieltage: {error}</p>;

    return (
        <>
            <div className={styles.pageContainerFullHeight}>
                <div className={styles.pageWrapper}>
                    {/* Page Header */}
                    <section className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>
                            <Icon name="volleyball" size={32} color="#10B981" />
                            Spieltage
                        </h1>
                    </section>

                    {/* Nächster Spieltag Section */}
                    {nextMatch && (
                        <section className={styles.sectionContainer}>
                            <h2 className={styles.sectionTitle}>Nächster Spieltag</h2>
                            <NextMatchCard match={nextMatch} />
                        </section>
                    )}

                    {/* Alle Spieltage Section */}
                    <section>
                        <h2 className={styles.sectionTitle}>Alle Spieltage</h2>
                        <MatchDayList matchDays={sortedMatchDays} />
                    </section>
                </div>
            </div>
        </>
    );
}

