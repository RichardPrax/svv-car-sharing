import { ParticipationData, ParticipationPlayer, ParticipationOverview } from "@/hooks/matches/useBatchedParticipationOverview";
import { ThumbsUpIcon, ThumbsDownIcon, ClockIcon } from "@/components/ui/GameParticipationIcons";
import { getPositionDisplayName, getPositionColor, VolleyballPosition } from "@/entities/UserProfile";
import React, { useState } from "react";
import { useOptimizedAuth } from "@/hooks/auth/useOptimizedAuth";
import { GameParticipationStatus } from "@/hooks/matches/useGameParticipation";
import DeclineReasonModal from "./DeclineReasonModal";
import JoinInfoModal from "./JoinInfoModal";
import styles from "./ParticipationSummary.module.css";

// Helper function to safely convert string position to enum
const getPositionEnum = (position: string): VolleyballPosition => {
    if (Object.values(VolleyballPosition).includes(position as VolleyballPosition)) {
        return position as VolleyballPosition;
    }
    return VolleyballPosition.MB; // Default fallback
};

interface ParticipationSummaryProps {
    matchId: string;
    matchDate: string | Date;
    refreshTrigger?: number;
    participationOverview?: ParticipationOverview | null;
}

interface ParticipationGroupProps {
    title: string;
    icon: React.ReactNode;
    participations?: ParticipationData[];
    openUsers?: ParticipationPlayer[];
    count: number;
    sectionType?: "participation" | "open";
    color: string;
    testIdPrefix: string;
    groupType: string;
    onClick?: () => void;
    isClickable?: boolean;
    isCurrentState?: boolean;
}

const ParticipationGroup: React.FC<ParticipationGroupProps> = ({ 
    title, 
    icon, 
    participations, 
    openUsers, 
    count, 
    sectionType = "participation", 
    color, 
    testIdPrefix, 
    groupType,
    onClick,
    isClickable = false,
    isCurrentState = false
}) => {
    const headerClassName = `${styles.groupHeader} ${isClickable ? styles.groupHeaderClickable : ''} ${isCurrentState ? styles.groupHeaderActive : ''}`;
    
    // Generate active state styles based on the group's color
    const headerStyle = isCurrentState ? {
        backgroundColor: `${color}15`, // 15 is hex for ~8% opacity
        borderBottom: `2px solid ${color}`
    } : {};
    
    return (
        <div className={styles.participationGroup} data-testid={`${testIdPrefix}-group-${groupType}`} style={{ borderLeftColor: color }}>
            <div 
                className={headerClassName}
                style={headerStyle}
                onClick={isClickable ? onClick : undefined}
                role={isClickable ? "button" : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onKeyDown={isClickable ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onClick?.();
                    }
                } : undefined}
                title={isClickable ? `${title} auswählen` : undefined}
            >
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

export default function ParticipationSummary({ matchId, matchDate, participationOverview }: ParticipationSummaryProps) {
    const { user, session } = useOptimizedAuth();
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<GameParticipationStatus | null>(null);
    const [updating, setUpdating] = useState(false);

    // Use passed data if available, otherwise show loading
    if (!participationOverview) {
        return (
            <div className={styles.loadingContainer} data-testid="md-participation-loading">
                <div className={styles.loadingSpinner}></div>
                <span>Lade Teilnahme-Übersicht...</span>
            </div>
        );
    }

    const overview = participationOverview;

    if (overview.counts.total === 0) {
        return (
            <div className={styles.emptyContainer} data-testid="md-participation-empty">
                <div className={styles.emptyIcon}>👥</div>
                <h3 className={styles.emptyTitle}>Keine Spieler registriert</h3>
                <p className={styles.emptyText}>Es sind noch keine Spieler im System registriert.</p>
            </div>
        );
    }

    // Determine current user's participation state
    const currentUserParticipation = overview.participations.JOINING.find(p => p.playerId === user?.id) 
        || overview.participations.DECLINING.find(p => p.playerId === user?.id);
    
    const currentUserStatus = currentUserParticipation?.status || null;
    const isUserInOpenState = !currentUserParticipation && overview.openUsers.some(u => u.id === user?.id);

    // Check if match is in the past
    const matchDateObj = new Date(matchDate);
    const isPastMatch = matchDateObj < new Date();

    // Only make clickable if user is logged in, is a player, and match is not in the past
    const isClickable = !!(user && !isPastMatch);

    const updateParticipation = async (status: GameParticipationStatus, reason?: string) => {
        setUpdating(true);

        try {
            const token = session?.access_token;
            if (!token) {
                return { error: "No access token available" };
            }

            const body: { status: GameParticipationStatus; reason?: string } = { status };
            if (reason && reason.trim()) {
                body.reason = reason.trim();
            }

            const response = await fetch(`/api/matches/${matchId}/participation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                // Reload the page to refresh all data
                window.location.reload();
                return { success: true };
            } else {
                const errorData = await response.json();
                return { error: errorData.error || "Failed to update participation" };
            }
        } catch (err) {
            console.error("Error updating participation:", err);
            return { error: "Network error" };
        } finally {
            setUpdating(false);
        }
    };

    const removeParticipation = async () => {
        setUpdating(true);

        try {
            const token = session?.access_token;
            if (!token) {
                return { error: "No access token available" };
            }

            const response = await fetch(`/api/matches/${matchId}/participation/${user?.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                // Reload the page to refresh all data
                window.location.reload();
                return { success: true };
            } else {
                const errorData = await response.json();
                return { error: errorData.error || "Failed to remove participation" };
            }
        } catch (err) {
            console.error("Error removing participation:", err);
            return { error: "Network error" };
        } finally {
            setUpdating(false);
        }
    };

    const handleGroupClick = async (targetStatus: GameParticipationStatus | "OPEN") => {
        if (!isClickable || updating) return;

        // If clicking current state, remove participation (set to open)
        if (
            (targetStatus === "JOINING" && currentUserStatus === "JOINING") ||
            (targetStatus === "DECLINING" && currentUserStatus === "DECLINING")
        ) {
            await removeParticipation();
            return;
        }

        // If clicking "open" state and user is already open, do nothing
        if (targetStatus === "OPEN" && isUserInOpenState) {
            return;
        }

        // For DECLINING status, show modal to get reason (required)
        if (targetStatus === "DECLINING") {
            setPendingStatus(targetStatus);
            setShowDeclineModal(true);
            return;
        }

        // For JOINING status, show modal to optionally add info
        if (targetStatus === "JOINING") {
            setPendingStatus(targetStatus);
            setShowJoinModal(true);
            return;
        }

        // For OPEN status (clicking on "Noch offen"), remove participation
        if (targetStatus === "OPEN") {
            await removeParticipation();
        }
    };

    const handleDeclineConfirm = async (reason: string) => {
        if (!pendingStatus) return;

        await updateParticipation(pendingStatus, reason);
        setShowDeclineModal(false);
        setPendingStatus(null);
    };

    const handleJoinConfirm = async (info?: string) => {
        if (!pendingStatus) return;

        await updateParticipation(pendingStatus, info);
        setShowJoinModal(false);
        setPendingStatus(null);
    };

    const handleModalClose = () => {
        setShowDeclineModal(false);
        setShowJoinModal(false);
        setPendingStatus(null);
    };

    // Always show all three groups for consistent layout
    const gridClassName = `${styles.participationGroups} ${styles.gridThreeColumns}`;

    return (
        <div className={styles.participationSummaryContainer} data-testid="md-participation-summary">
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
                    testIdPrefix="md"
                    groupType="joining"
                    onClick={() => handleGroupClick("JOINING")}
                    isClickable={isClickable}
                    isCurrentState={currentUserStatus === "JOINING"}
                />

                <ParticipationGroup
                    title="Nicht dabei"
                    icon={<ThumbsDownIcon size={20} />}
                    participations={overview.participations.DECLINING}
                    count={overview.counts.declining}
                    color="#ef4444"
                    testIdPrefix="md"
                    groupType="declining"
                    onClick={() => handleGroupClick("DECLINING")}
                    isClickable={isClickable}
                    isCurrentState={currentUserStatus === "DECLINING"}
                />

                <ParticipationGroup
                    title="Noch offen"
                    icon={<ClockIcon size={20} />}
                    openUsers={overview.openUsers}
                    count={overview.counts.open}
                    sectionType="open"
                    color="#6b7280"
                    testIdPrefix="md"
                    groupType="open"
                    onClick={() => handleGroupClick("OPEN")}
                    isClickable={isClickable}
                    isCurrentState={isUserInOpenState}
                />
            </div>

            <DeclineReasonModal 
                isOpen={showDeclineModal} 
                onClose={handleModalClose} 
                onConfirm={handleDeclineConfirm} 
                isLoading={updating} 
                statusType={pendingStatus} 
            />
            <JoinInfoModal 
                isOpen={showJoinModal} 
                onClose={handleModalClose} 
                onConfirm={handleJoinConfirm} 
                isLoading={updating} 
            />
        </div>
    );
}

