// src/components/matches/NextMatchCard.tsx
import { MatchDay } from "@/entities/MatchDay";
import { useRouter } from "next/router";
import { formatDate, formatTime } from "@/utils/dateTime";
import styles from "./Matches.module.css";

type Props = {
    match: MatchDay;
};

export default function NextMatchCard({ match }: Props) {
    const router = useRouter();

    const handleCardClick = () => {
        router.push(`/matches/${match.id}`);
    };

    return (
        <div className={styles.nextMatchCard} onClick={handleCardClick}>
            <div className={styles.nextMatchCardHeader}>
                <p className={styles.nextMatchCardDate}>{formatDate(match.date)}</p>
                <p className={styles.nextMatchCardTime}>{formatTime(match.time)}</p>
            </div>

            <div className={styles.nextMatchCardDetails}>
                <div className={styles.nextMatchCardDetail}>
                    <span className={styles.nextMatchCardDetailLabel}>Gegner</span>
                    <span className={styles.nextMatchCardDetailValue}>{match.opponent}</span>
                </div>

                <div className={styles.nextMatchCardDetail}>
                    <span className={styles.nextMatchCardDetailLabel}>Ort</span>
                    <span className={styles.nextMatchCardDetailValue}>{match.location}</span>
                </div>
            </div>
        </div>
    );
}

