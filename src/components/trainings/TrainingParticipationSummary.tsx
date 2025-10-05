import { TrainingParticipationData, TrainingParticipationPlayer, TrainingParticipationOverview } from "@/hooks/trainings/useBatchedTrainingParticipationOverview";
import { ThumbsUpIcon, ThumbsDownIcon, ClockIcon } from "@/components/ui/GameParticipationIcons";
import { getPositionDisplayName, getPositionColor, VolleyballPosition } from "@/entities/UserProfile";
import React from "react";
import styles from "./TrainingParticipationSummary.module.css";

// Helper function to safely convert string position to enum
const getPositionEnum = (position: string): VolleyballPosition => {
    if (Object.values(VolleyballPosition).includes(position as VolleyballPosition)) {
        return position as VolleyballPosition;
    }
    return VolleyballPosition.MB; // Default fallback
};

interface TrainingParticipationSummaryProps {
    trainingId: string;
    trainingDate: string | Date;
    refreshTrigger?: number;
    participationOverview?: TrainingParticipationOverview | null;
}

interface ParticipationGroupProps {
    title: string;
    icon: React.ReactNode;
    participations?: TrainingParticipationData[];
    openUsers?: TrainingParticipationPlayer[];
    count: number;
    sectionType?: "participation" | "open";
    color: string;
    testIdPrefix: string;
    groupType: string;
}

const ParticipationGroup: React.FC<ParticipationGroupProps> = ({ title, icon, participations, openUsers, count, sectionType = "participation", color, testIdPrefix, groupType }) => {
    return (
        <div className={styles.participationGroup} data-testid={`${testIdPrefix}-group-${groupType}`}>
            <div className={styles.groupHeader} style={{ borderLeftColor: color }}>
                <div className={styles.groupIcon} style={{ color }}>
                    {icon}
                </div>
                <div className={styles.groupInfo}>
                    <h3 className={styles.groupTitle}>{title}</h3>
                    <span className={styles.groupCount}>
                        {count} {count === 1 ? "Person" : "Personen"}
                    </span>
                </div>
            </div>

            <div className={styles.groupContent}>
                {count === 0 ? null : sectionType === "open" ? (
                    <div className={styles.userGrid}>
                        {openUsers?.map((user, index) => (
                            <div key={user.id} className={styles.userCard} data-testid={`${testIdPrefix}-user-${groupType}-${index}`}>
                                <div className={styles.userInfo}>
                                    <span className={styles.userName}>
                                        {user.firstName} {user.lastName}
                                    </span>
                                    {user.playerPositions && user.playerPositions.length > 0 && (
                                        <div className={styles.userPositions}>
                                            {user.playerPositions.map((position) => (
                                                <span
                                                    key={position.id}
                                                    className={`${styles.positionBadge} ${position.isPrimary ? styles.primaryPosition : styles.secondaryPosition}`}
                                                    style={{ 
                                                        backgroundColor: getPositionColor(getPositionEnum(position.position)),
                                                        color: 'white'
                                                    }}
                                                    title={`${getPositionDisplayName(getPositionEnum(position.position))} ${position.isPrimary ? '(Hauptposition)' : '(Nebenposition)'}`}
                                                >
                                                    {position.position}
                                                    {position.isPrimary && <span className={styles.primaryIndicator}>★</span>}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.userGrid}>
                        {participations?.map((participation, index) => (
                            <div key={participation.id} className={styles.userCard} data-testid={`${testIdPrefix}-user-${groupType}-${index}`}>
                                <div className={styles.userInfo}>
                                    <span className={styles.userName}>
                                        {participation.player.firstName} {participation.player.lastName}
                                    </span>
                                    {participation.player.playerPositions && participation.player.playerPositions.length > 0 && (
                                        <div className={styles.userPositions}>
                                            {participation.player.playerPositions.map((position) => (
                                                <span
                                                    key={position.id}
                                                    className={`${styles.positionBadge} ${position.isPrimary ? styles.primaryPosition : styles.secondaryPosition}`}
                                                    style={{ 
                                                        backgroundColor: getPositionColor(getPositionEnum(position.position)),
                                                        color: 'white'
                                                    }}
                                                    title={`${getPositionDisplayName(getPositionEnum(position.position))} ${position.isPrimary ? '(Hauptposition)' : '(Nebenposition)'}`}
                                                >
                                                    {position.position}
                                                    {position.isPrimary && <span className={styles.primaryIndicator}>★</span>}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {participation.reason && <div className={styles.userReason}>{participation.reason}</div>}
                                <div className={styles.userTime}>
                                    {new Date(participation.updatedAt).toLocaleDateString("de-DE", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default function TrainingParticipationSummary({ participationOverview }: TrainingParticipationSummaryProps) {
    // Use passed data if available, otherwise show loading
    if (!participationOverview) {
        return (
            <div className={styles.loadingContainer} data-testid="training-participation-loading">
                <div className={styles.loadingSpinner}></div>
                <span>Lade Teilnahme-Übersicht...</span>
            </div>
        );
    }

    const overview = participationOverview;

    if (overview.counts.total === 0) {
        return (
            <div className={styles.emptyContainer} data-testid="training-participation-empty">
                <div className={styles.emptyIcon}>👥</div>
                <h3 className={styles.emptyTitle}>Keine Spieler registriert</h3>
                <p className={styles.emptyText}>Es sind noch keine Spieler im System registriert.</p>
            </div>
        );
    }

    // Always show all three groups for consistent layout
    const gridClassName = `${styles.participationGroups} ${styles.gridThreeColumns}`;

    return (
        <div className={styles.participationSummaryContainer} data-testid="training-participation-summary">
            <div className={styles.summaryHeader}>
                <h2 className={styles.summaryTitle}>Teilnahme-Übersicht</h2>
                <div className={styles.summaryStats}>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>{overview.counts.total - overview.counts.open}</span>
                        <span className={styles.statLabel}>Antworten</span>
                    </div>
                    <div className={styles.statDivider}>/</div>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>{overview.counts.total}</span>
                        <span className={styles.statLabel}>Gesamt</span>
                    </div>
                </div>
            </div>

            <div className={gridClassName}>
                <ParticipationGroup
                    title="Dabei"
                    icon={<ThumbsUpIcon size={20} />}
                    participations={overview.participation.JOINING}
                    count={overview.counts.joining}
                    color="#10b981"
                    testIdPrefix="training"
                    groupType="joining"
                />

                <ParticipationGroup
                    title="Nicht dabei"
                    icon={<ThumbsDownIcon size={20} />}
                    participations={overview.participation.DECLINING}
                    count={overview.counts.declining}
                    color="#ef4444"
                    testIdPrefix="training"
                    groupType="declining"
                />

                <ParticipationGroup
                    title="Noch offen"
                    icon={<ClockIcon size={20} />}
                    openUsers={overview.participation.OPEN}
                    count={overview.counts.open}
                    sectionType="open"
                    color="#6b7280"
                    testIdPrefix="training"
                    groupType="open"
                />
            </div>
        </div>
    );
}
