// src/components/NextMatchCard.tsx
import { MatchDay } from "@/entities/MatchDay";
import { useRouter } from "next/router";

type Props = {
    match: MatchDay;
};

// Helper function to format date from YYYY-MM-DD to DD.MM.YYYY
const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};

// Helper function to format time
const formatTime = (timeStr: string): string => {
    // Remove seconds if present (e.g., "15:30:00" -> "15:30")
    const timeWithoutSeconds = timeStr.substring(0, 5);
    return `Beginn: ${timeWithoutSeconds}`;
};

export default function NextMatchCard({ match }: Props) {
    const router = useRouter();

    const handleCardClick = () => {
        router.push(`/match/${match.id}`);
    };

    return (
        <div
            className="next-match-card"
            onClick={handleCardClick}
            style={{
                backgroundColor: "var(--card-background)",
                borderColor: "var(--card-border)",
                borderWidth: "2px",
                borderStyle: "solid",
                borderRadius: "var(--radius-lg)",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                padding: "var(--spacing-xl)",
                width: "100%",
                maxWidth: "600px",
                margin: "0 auto",
                transition: "all 0.2s ease-in-out",
                background: "linear-gradient(135deg, var(--card-background) 0%, #f1f5f9 100%)",
                cursor: "pointer",
            }}
        >
            <div className="next-match-card__content">
                <div
                    className="next-match-card__header"
                    style={{
                        textAlign: "center",
                        marginBottom: "var(--spacing-lg)",
                    }}
                >
                    {" "}
                    <p
                        className="next-match-card__date"
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: "700",
                            color: "var(--text-primary)",
                            margin: "0 0 var(--spacing-xs) 0",
                            lineHeight: "1.4",
                        }}
                    >
                        {formatDate(match.date)}
                    </p>
                    <p
                        className="next-match-card__time"
                        style={{
                            fontSize: "1.125rem",
                            color: "var(--text-accent)",
                            fontWeight: "600",
                            margin: "0",
                        }}
                    >
                        {formatTime(match.time)}
                    </p>
                </div>

                <div
                    className="next-match-card__details"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "var(--spacing-lg)",
                        textAlign: "center",
                    }}
                >
                    <div className="next-match-card__detail">
                        <span
                            style={{
                                fontSize: "0.875rem",
                                fontWeight: "600",
                                color: "var(--text-secondary)",
                                display: "block",
                                marginBottom: "var(--spacing-xs)",
                                textTransform: "uppercase",
                                letterSpacing: "0.025em",
                            }}
                        >
                            Gegner
                        </span>
                        <span
                            style={{
                                fontSize: "1.125rem",
                                fontWeight: "600",
                                color: "var(--text-primary)",
                            }}
                        >
                            {match.opponent}
                        </span>
                    </div>

                    <div className="next-match-card__detail">
                        <span
                            style={{
                                fontSize: "0.875rem",
                                fontWeight: "600",
                                color: "var(--text-secondary)",
                                display: "block",
                                marginBottom: "var(--spacing-xs)",
                                textTransform: "uppercase",
                                letterSpacing: "0.025em",
                            }}
                        >
                            Ort
                        </span>
                        <span
                            style={{
                                fontSize: "1.125rem",
                                fontWeight: "600",
                                color: "var(--text-primary)",
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
