// src/components/matches/MatchDayCard.tsx
import { MatchDay } from "@/entities/MatchDay";
import { useRouter } from "next/router";
import { formatDate, formatTime, isMatchInPast } from "@/utils/dateTime";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import GameParticipationButtons from "./GameParticipationButtons";
import { useParticipationOverview } from "@/hooks/matches/useParticipationOverview";
import styles from "./Matches.module.css";

type Props = {
    match: MatchDay;
};

export default function MatchDayCard({ match }: Props) {
    const isPast = isMatchInPast(match.date, match.time);
    const router = useRouter();
    const { user, userProfile } = useOptimizedAuth();
    const { hasPlayerAccess } = useRoleGuard();
    const { overview } = useParticipationOverview({ matchId: match.id });

    const handleCardClick = () => {
        router.push(`/matches/${match.id}`);
    };

    const handleParticipationClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click when clicking participation buttons
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

                   {/* Participation Summary */}
                   {overview && overview.counts.total > 0 && (
                       <div className={styles.matchCardParticipationSummary}>
                           <span className={styles.matchCardParticipationLabel}>Teilnahme:</span>
                           <div className={styles.matchCardParticipationCounts}>
                               {overview.counts.joining > 0 && (
                                   <span className={styles.matchCardParticipationCount} style={{ color: '#10b981' }}>
                                       👍 {overview.counts.joining}
                                   </span>
                               )}
                               {overview.counts.tentative > 0 && (
                                   <span className={styles.matchCardParticipationCount} style={{ color: '#f59e0b' }}>
                                       ❓ {overview.counts.tentative}
                                   </span>
                               )}
                               {overview.counts.declining > 0 && (
                                   <span className={styles.matchCardParticipationCount} style={{ color: '#ef4444' }}>
                                       👎 {overview.counts.declining}
                                   </span>
                               )}
                           </div>
                       </div>
                   )}

                <div className={styles.matchCardDetailRow}>
                    <span className={styles.matchCardDetailLabel}>Ort:</span>
                    <span className={styles.matchCardDetailValue}>{match.location}</span>
                </div>
            </div>



            {/* Show participation buttons only for players and future matches */}
            {user && hasPlayerAccess() && !isPast && (
                <div onClick={handleParticipationClick}>
                    <GameParticipationButtons 
                        matchDayId={match.id}
                        onParticipationChange={() => {
                            // Optionally trigger a refresh of the match list
                            // This could be passed down as a prop if needed
                        }}
                    />
                </div>
            )}
        </div>
    );
}

