// src/components/matches/MatchDayCard.tsx
import { MatchDay } from "@/entities/MatchDay";
import { useRouter } from "next/router";
import { formatDate, formatTime, isMatchInPast } from "@/utils/dateTime";

type Props = {
    match: MatchDay;
};

export default function MatchDayCard({ match }: Props) {
    const isPast = isMatchInPast(match.date, match.time);
    const router = useRouter();

    const handleCardClick = () => {
        router.push(`/matches/${match.id}`);
    };

    return (
        <div
            className={`match-card ${isPast ? "match-card--past" : ""}`}
            onClick={handleCardClick}
            style={{
                backgroundColor: isPast ? "var(--card-past-background)" : "var(--card-background)",
                borderColor: isPast ? "var(--card-past-border)" : "var(--card-border)",
                borderWidth: "1px",
                borderStyle: "solid",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--card-shadow)",
                padding: "var(--spacing-lg)",
                width: "100%",
                transition: "all 0.2s ease-in-out",
                cursor: "pointer",
            }}
        >
            <div className="match-card__content">
                <div className="match-card__header">
                    <div className="match-card__date-time">
                        <p
                            className="match-card__date"
                            style={{
                                fontSize: "1.125rem",
                                fontWeight: "700",
                                color: "var(--text-primary)",
                                margin: "0 0 var(--spacing-xs) 0",
                                lineHeight: "1.4",
                            }}
                        >
                            {formatDate(match.date)}
                        </p>
                        <p
                            className="match-card__time"
                            style={{
                                fontSize: "0.875rem",
                                color: "var(--text-secondary)",
                                margin: "0",
                            }}
                        >
                            {formatTime(match.time)}
                        </p>
                    </div>
                    {isPast && (
                        <div
                            className="match-card__past-indicator"
                            style={{
                                fontSize: "0.75rem",
                                color: "var(--text-accent)",
                                fontWeight: "600",
                                backgroundColor: "var(--card-past-border)",
                                padding: "var(--spacing-xs) var(--spacing-sm)",
                                borderRadius: "var(--radius-sm)",
                                whiteSpace: "nowrap",
                            }}
                        >
                            Beendet
                        </div>
                    )}
                </div>

                <div
                    className="match-card__details"
                    style={{
                        marginTop: "var(--spacing-md)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-xs)",
                    }}
                >
                    <div className="match-card__detail-row">
                        <span
                            style={{
                                fontSize: "0.875rem",
                                fontWeight: "600",
                                color: "var(--text-primary)",
                            }}
                        >
                            Gegner:
                        </span>
                        <span
                            style={{
                                fontSize: "0.875rem",
                                color: "var(--text-secondary)",
                                marginLeft: "var(--spacing-xs)",
                            }}
                        >
                            {match.opponent}
                        </span>
                    </div>

                    <div className="match-card__detail-row">
                        <span
                            style={{
                                fontSize: "0.875rem",
                                fontWeight: "600",
                                color: "var(--text-primary)",
                            }}
                        >
                            Ort:
                        </span>
                        <span
                            style={{
                                fontSize: "0.875rem",
                                color: "var(--text-secondary)",
                                marginLeft: "var(--spacing-xs)",
                            }}
                        >
                            {match.location}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

