import React from "react";
import { useParticipationOverview, ParticipationData, ParticipationPlayer } from "@/hooks/matches/useParticipationOverview";
import { ThumbsUpIcon, ThumbsDownIcon, QuestionMarkIcon, ClockIcon } from "@/components/ui/GameParticipationIcons";
import styles from "./ParticipationSummary.module.css";

interface ParticipationSummaryProps {
    matchId: string;
    refreshTrigger?: number;
}

interface ParticipationGroupProps {
    title: string;
    icon: React.ReactNode;
    participations?: ParticipationData[];
    openUsers?: ParticipationPlayer[];
    count: number;
    sectionType?: "participation" | "open";
    color: string;
}

const ParticipationGroup: React.FC<ParticipationGroupProps> = ({ title, icon, participations, openUsers, count, sectionType = "participation", color }) => {
    if (count === 0) return null;

    return (
        <div className={styles.participationGroup}>
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
                {sectionType === "open" ? (
                    <div className={styles.userGrid}>
                        {openUsers?.map((user) => (
                            <div key={user.id} className={styles.userCard}>
                                <span className={styles.userName}>
                                    {user.firstName} {user.lastName}
                                </span>
                                <span className={styles.userRole}>{user.role}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.userGrid}>
                        {participations?.map((participation) => (
                            <div key={participation.id} className={styles.userCard}>
                                <div className={styles.userInfo}>
                                    <span className={styles.userName}>
                                        {participation.player.firstName} {participation.player.lastName}
                                    </span>
                                    <span className={styles.userRole}>{participation.player.role}</span>
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

export default function ParticipationSummary({ matchId, refreshTrigger }: ParticipationSummaryProps) {
    const { overview, loading, error } = useParticipationOverview({ matchId, refreshTrigger });

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <span>Lade Teilnahme-Übersicht...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <span>{error.includes("Database migration") ? "Teilnahme-System wird eingerichtet..." : "Teilnahme-Übersicht nicht verfügbar"}</span>
            </div>
        );
    }

    if (!overview || overview.counts.total === 0) {
        return (
            <div className={styles.emptyContainer}>
                <div className={styles.emptyIcon}>👥</div>
                <h3 className={styles.emptyTitle}>Keine Spieler registriert</h3>
                <p className={styles.emptyText}>Es sind noch keine Spieler im System registriert.</p>
            </div>
        );
    }

    // Count visible groups to determine layout
    const visibleGroups = [overview.counts.joining > 0, overview.counts.tentative > 0, overview.counts.declining > 0, overview.counts.open > 0].filter(Boolean).length;

    const gridClassName = visibleGroups === 4 ? `${styles.participationGroups} ${styles.gridTwoByTwo}` : styles.participationGroups;

    return (
        <div className={styles.participationSummaryContainer}>
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
                    participations={overview.participations.JOINING}
                    count={overview.counts.joining}
                    color="#10b981"
                />

                <ParticipationGroup
                    title="Vielleicht"
                    icon={<QuestionMarkIcon size={20} />}
                    participations={overview.participations.TENTATIVE}
                    count={overview.counts.tentative}
                    color="#f59e0b"
                />

                <ParticipationGroup
                    title="Nicht dabei"
                    icon={<ThumbsDownIcon size={20} />}
                    participations={overview.participations.DECLINING}
                    count={overview.counts.declining}
                    color="#ef4444"
                />

                <ParticipationGroup
                    title="Noch offen"
                    icon={<ClockIcon size={20} />}
                    openUsers={overview.openUsers}
                    count={overview.counts.open}
                    sectionType="open"
                    color="#6b7280"
                />
            </div>
        </div>
    );
}

