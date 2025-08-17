import React, { useMemo } from 'react';
import { useGameParticipation, GameParticipationStatus } from '@/hooks/matches/useGameParticipation';
import { ThumbsUpIcon, ThumbsDownIcon, QuestionMarkIcon } from '@/components/ui/GameParticipationIcons';
import styles from './Matches.module.css';

interface GameParticipationButtonsProps {
  matchDayId: string;
  refreshTrigger?: number;
  onParticipationChange?: () => void;
}

export default function GameParticipationButtons({ 
  matchDayId, 
  refreshTrigger, 
  onParticipationChange 
}: GameParticipationButtonsProps) {
  const { 
    participation, 
    loading, 
    error,
    updating, 
    updateParticipation, 
    removeParticipation 
  } = useGameParticipation({ matchDayId, refreshTrigger });

  const handleParticipationClick = async (status: GameParticipationStatus) => {
    // If clicking the same status, remove participation
    if (participation?.status === status) {
      const result = await removeParticipation();
      if (result.success) {
        onParticipationChange?.();
      }
      return;
    }

    // Otherwise, update to new status
    const result = await updateParticipation(status);
    if (result.success) {
      onParticipationChange?.();
    }
  };

  const buttonClasses = useMemo(() => ({
    joining: `${styles.participationButton} ${participation?.status === 'JOINING' ? styles.participationButtonActive : ''} ${styles.participationButtonJOINING}`.trim(),
    tentative: `${styles.participationButton} ${participation?.status === 'TENTATIVE' ? styles.participationButtonActive : ''} ${styles.participationButtonTENTATIVE}`.trim(),
    declining: `${styles.participationButton} ${participation?.status === 'DECLINING' ? styles.participationButtonActive : ''} ${styles.participationButtonDECLINING}`.trim(),
  }), [participation?.status]);

  // Show buttons immediately, with loading state overlay if needed
  const showLoadingOverlay = loading && !participation;

  // If there's an error, show a simple message
  if (error) {
    return (
      <div className={styles.participationButtonsContainer}>
        <div className={styles.participationButtonsLoading}>
          {error.includes('Database migration') 
            ? 'Teilnahme-System wird eingerichtet...' 
            : 'Teilnahme-System nicht verfügbar'}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.participationButtonsContainer}>
      {showLoadingOverlay && (
        <div className={styles.participationButtonsLoading}>Lade...</div>
      )}
      <div className={styles.participationButtonsLabel}>Teilnahme:</div>
      <div className={styles.participationButtons}>
        <button
          className={buttonClasses.joining}
          onClick={() => handleParticipationClick('JOINING')}
          disabled={updating}
          title="Ich komme zum Spiel"
          aria-label="Ich komme zum Spiel"
        >
          <ThumbsUpIcon size={20} />
          <span className={styles.participationButtonText}>Dabei</span>
        </button>

        <button
          className={buttonClasses.tentative}
          onClick={() => handleParticipationClick('TENTATIVE')}
          disabled={updating}
          title="Ich bin mir nicht sicher"
          aria-label="Ich bin mir nicht sicher"
        >
          <QuestionMarkIcon size={20} />
          <span className={styles.participationButtonText}>Vielleicht</span>
        </button>

        <button
          className={buttonClasses.declining}
          onClick={() => handleParticipationClick('DECLINING')}
          disabled={updating}
          title="Ich kann nicht kommen"
          aria-label="Ich kann nicht kommen"
        >
          <ThumbsDownIcon size={20} />
          <span className={styles.participationButtonText}>Nicht dabei</span>
        </button>
      </div>
    </div>
  );
}
