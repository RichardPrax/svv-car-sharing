// src/components/MatchDayCard.tsx
import { MatchDay } from "@/entities/MatchDay";

type Props = {
  match: MatchDay;
};

function isMatchInPast(dateStr: string, timeStr: string): boolean {
  const today = new Date();
  const matchDate = new Date(`${dateStr} ${timeStr}`);
  return matchDate < today;
}

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

export default function MatchDayCard({ match }: Props) {
  const isPast = isMatchInPast(match.date, match.time);

  return (
    <div
      className={`match-card ${isPast ? "match-card--past" : ""}`}
      style={{
        backgroundColor: isPast
          ? "var(--card-past-background)"
          : "var(--card-background)",
        borderColor: isPast ? "var(--card-past-border)" : "var(--card-border)",
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--card-shadow)",
        padding: "var(--spacing-lg)",
        width: "100%",
        transition: "all 0.2s ease-in-out",
      }}
    >
      <div className="match-card__content">
        <div className="match-card__header">
          <div className="match-card__date-time">
            {" "}
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
