import React from 'react';
import { useParticipationOverview, ParticipationData } from '@/hooks/matches/useParticipationOverview';
import { ThumbsUpIcon, ThumbsDownIcon, QuestionMarkIcon } from '@/components/ui/GameParticipationIcons';
import styles from './Matches.module.css';

interface ParticipationOverviewProps {
    matchId: string;
    refreshTrigger?: number;
}

interface ParticipationSectionProps {
    title: string;
    icon: React.ReactNode;
    participations: ParticipationData[];
    count: number;
    className: string;
}

const ParticipationSection: React.FC<ParticipationSectionProps> = ({ 
    title, 
    icon, 
    participations, 
    count, 
    className 
}) => {
    if (count === 0) return null;

    return (
        <div className={styles.participationSection}>
            <div className={styles.participationSectionHeader}>
                <div className={styles.participationSectionIcon}>
                    {icon}
                </div>
                <h3 className={styles.participationSectionTitle}>
                    {title} ({count})
                </h3>
            </div>
            <div className={styles.participationSectionList}>
                {participations.map((participation) => (
                    <div key={participation.id} className={styles.participationItem}>
                        <div className={styles.participationItemInfo}>
                            <span className={styles.participationItemName}>
                                {participation.player.firstName} {participation.player.lastName}
                            </span>
                            <span className={styles.participationItemRole}>
                                {participation.player.role}
                            </span>
                        </div>
                        <div className={styles.participationItemTime}>
                            {new Date(participation.updatedAt).toLocaleDateString('de-DE', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function ParticipationOverview({ matchId, refreshTrigger }: ParticipationOverviewProps) {
    const { overview, loading, error } = useParticipationOverview({ matchId, refreshTrigger });

    if (loading) {
        return (
            <div className={styles.participationOverviewContainer}>
                <div className={styles.participationOverviewLoading}>
                    Lade Teilnahme-Übersicht...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.participationOverviewContainer}>
                <div className={styles.participationOverviewError}>
                    {error.includes('Database migration')
                        ? 'Teilnahme-System wird eingerichtet...'
                        : 'Teilnahme-Übersicht nicht verfügbar'}
                </div>
            </div>
        );
    }

    if (!overview || overview.counts.total === 0) {
        return (
            <div className={styles.participationOverviewContainer}>
                <div className={styles.participationOverviewEmpty}>
                    <h3 className={styles.participationOverviewEmptyTitle}>Teilnahme-Übersicht</h3>
                    <p className={styles.participationOverviewEmptyText}>
                        Noch keine Teilnahme-Anmeldungen vorhanden.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.participationOverviewContainer}>
            <div className={styles.participationOverviewHeader}>
                <h3 className={styles.participationOverviewTitle}>Teilnahme-Übersicht</h3>
                <div className={styles.participationOverviewStats}>
                    <span className={styles.participationOverviewTotal}>
                        Gesamt: {overview.counts.total}
                    </span>
                </div>
            </div>

            <div className={styles.participationOverviewContent}>
                <ParticipationSection
                    title="Dabei"
                    icon={<ThumbsUpIcon size={20} />}
                    participations={overview.participations.JOINING}
                    count={overview.counts.joining}
                    className={styles.participationSectionJoining}
                />

                <ParticipationSection
                    title="Vielleicht"
                    icon={<QuestionMarkIcon size={20} />}
                    participations={overview.participations.TENTATIVE}
                    count={overview.counts.tentative}
                    className={styles.participationSectionTentative}
                />

                <ParticipationSection
                    title="Nicht dabei"
                    icon={<ThumbsDownIcon size={20} />}
                    participations={overview.participations.DECLINING}
                    count={overview.counts.declining}
                    className={styles.participationSectionDeclining}
                />
            </div>
        </div>
    );
}
