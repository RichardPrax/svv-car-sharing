// src/components/matches/MatchDayCard.tsx
import { MatchDay } from "@/entities/MatchDay";
import { useRouter } from "next/router";
import { useState, useMemo } from "react";
import { formatDate, formatTime, isMatchInPast, formatDateForId } from "@/utils/dateTime";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import GameParticipationButtons from "./GameParticipationButtons";
import { ParticipationOverview } from "@/hooks/matches/useBatchedParticipationOverview";
import { ThumbsUpIcon, ThumbsDownIcon, ClockIcon } from "@/components/ui/GameParticipationIcons";
import styles from "./Matches.module.css";

type Props = {
    match: MatchDay;
    participationOverview?: ParticipationOverview;
    // overviewLoading entfernt, da ungenutzt
    onParticipationChange?: () => void;
};

export default function MatchDayCard({ 
    match, 
    participationOverview, 
    onParticipationChange 
}: Props) {
    const isPast = isMatchInPast(match.date, match.time);
    const router = useRouter();
    const { user } = useOptimizedAuth();
    const { hasPlayerAccess } = useRoleGuard();
    const [participationRefreshTrigger, setParticipationRefreshTrigger] = useState(0);

    // Extract user's participation from the overview data
    const userParticipation = useMemo(() => {
        if (!participationOverview || !user) return null;
        
        const allParticipations = [
            ...participationOverview.participations.JOINING,
            ...participationOverview.participations.DECLINING
        ];
        
        return allParticipations.find(p => p.playerId === user.id) || null;
    }, [participationOverview, user]);

    const handleCardClick = () => {
        router.push(`/matches/${match.id}`);
    };

    const handleParticipationClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click when clicking participation buttons
    };

    const cardClasses = [styles.matchCard, isPast && styles.matchCardPast].filter(Boolean).join(" ");

    return (
        <div 
            data-testid={`md-${formatDateForId(match.date)}`}
            className={cardClasses} 
            onClick={handleCardClick}
        >
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

                {/* Participation Summary - moved below Ort */}
                {participationOverview && participationOverview.counts.total > 0 && (
                    <div className={styles.matchCardParticipationSummary}>
                        <span className={styles.matchCardParticipationLabel}>Teilnahme:</span>
                        <div className={styles.matchCardParticipationCounts}>
                            {participationOverview.counts.joining > 0 && (
                                <span className={styles.matchCardParticipationCount} style={{ color: "#10b981" }}>
                                    <ThumbsUpIcon size={16} />
                                    <span style={{ marginLeft: "4px" }}>{participationOverview.counts.joining}</span>
                                </span>
                            )}
                            {participationOverview.counts.declining > 0 && (
                                <span className={styles.matchCardParticipationCount} style={{ color: "#ef4444" }}>
                                    <ThumbsDownIcon size={16} />
                                    <span style={{ marginLeft: "4px" }}>{participationOverview.counts.declining}</span>
                                </span>
                            )}
                            {participationOverview.counts.open > 0 && (
                                <span className={styles.matchCardParticipationCount} style={{ color: "#6b7280" }}>
                                    <ClockIcon size={16} />
                                    <span style={{ marginLeft: "4px" }}>{participationOverview.counts.open}</span>
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Show participation buttons only for players and future matches */}
            {user && hasPlayerAccess() && !isPast && (
                <div onClick={handleParticipationClick}>
                    <GameParticipationButtons
                        matchDayId={match.id}
                        matchDate={match.date}
                        userParticipation={userParticipation}
                        refreshTrigger={participationRefreshTrigger}
                        onParticipationChange={() => {
                            // Trigger a refresh of the participation overview
                            // Small delay to ensure the API call completes
                            setTimeout(() => {
                                setParticipationRefreshTrigger((prev) => prev + 1);
                                onParticipationChange?.();
                            }, 100);
                        }}
                    />
                </div>
            )}
        </div>
    );
}

