import { MatchDayList, NextMatchCard } from "@/components/matches";
import { useMatches } from "@/hooks/matches/useMatches";
import { isMatchInFuture, sortMatchesByDateTime } from "@/utils/dateTime";

export default function HomePage() {
    const { matchDays, loading, error } = useMatches();

    // Sort all matches by date and time
    const sortedMatchDays = sortMatchesByDateTime(matchDays);

    // Find the next upcoming match
    const nextMatch = sortedMatchDays.find((match) => isMatchInFuture(match.date, match.time));

    if (loading) return <p>Lade...</p>;
    if (error) return <p>Fehler beim Laden der Spieltage: {error}</p>;

    return (
        <div
            style={{
                padding: "var(--spacing-lg) 0",
                minHeight: "100vh",
                backgroundColor: "var(--background)",
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "0 var(--spacing-md)",
                }}
            >
                {/* Nächster Spieltag Section */}
                {nextMatch && (
                    <section style={{ marginBottom: "var(--spacing-xl)" }}>
                        <h2
                            style={{
                                fontSize: "1.75rem",
                                fontWeight: "700",
                                marginBottom: "var(--spacing-lg)",
                                color: "var(--text-primary)",
                                textAlign: "center",
                                padding: "0 var(--spacing-md)",
                            }}
                        >
                            Nächster Spieltag
                        </h2>
                        <NextMatchCard match={nextMatch} />
                    </section>
                )}

                {/* Alle Spieltage Section */}
                <section>
                    <h2
                        style={{
                            fontSize: "1.75rem",
                            fontWeight: "700",
                            marginBottom: "var(--spacing-lg)",
                            color: "var(--text-primary)",
                            textAlign: "center",
                            padding: "0 var(--spacing-md)",
                        }}
                    >
                        Alle Spieltage
                    </h2>
                    <MatchDayList matchDays={sortedMatchDays} />
                </section>
            </div>
        </div>
    );
}

