// src/components/matches/MatchDayCard.tsx
import { MatchDay } from "@/entities/MatchDay";
import { useRouter } from "next/router";
import { formatDate, formatTime, isMatchInPast } from "@/utils/dateTime";
import styles from "./Matches.module.css";

type Props = {
    match: MatchDay;
};

export default function MatchDayCard({ match }: Props) {
    const isPast = isMatchInPast(match.date, match.time);
    const router = useRouter();

    const handleCardClick = () => {
        router.push(`/matches/${match.id}`);
    };

    const cardClasses = [styles.matchCard, isPast && styles.matchCardPast].filter(Boolean).join(" ");

    return (
        <div className={cardClasses} onClick={handleCardClick}>
            <div className={styles.matchCardHeader}>
                <div className={styles.matchCardDateTime}>
                    <p className={styles.matchCardDate}>{formatDate(match.date)}</p>
                    <p className={styles.matchCardTime}>{formatTime(match.time)}</p>
                </div>
                {isPast && <div className={styles.matchCardPastIndicator}>Beendet</div>}
            </div>

            <div className={styles.matchCardDetails}>
                <div className={styles.matchCardDetailRow}>
                    <span className={styles.matchCardDetailLabel}>Gegner:</span>
                    <span className={styles.matchCardDetailValue}>{match.opponent}</span>
                </div>

                <div className={styles.matchCardDetailRow}>
                    <span className={styles.matchCardDetailLabel}>Ort:</span>
                    <span className={styles.matchCardDetailValue}>{match.location}</span>
                </div>
            </div>
        </div>
    );
}

