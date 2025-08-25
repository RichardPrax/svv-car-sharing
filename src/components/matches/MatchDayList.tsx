// src/components/matches/MatchDayList.tsx
import { MatchDay } from "@/entities/MatchDay";
import { useState, useMemo } from "react";
import MatchDayCard from "./MatchDayCard";
import { useBatchedParticipationOverview } from "@/hooks/matches/useBatchedParticipationOverview";
import styles from "./Matches.module.css";

type Props = {
    matchDays: MatchDay[];
};

export default function MatchDayList({ matchDays }: Props) {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    
    // Memoize match IDs to prevent unnecessary re-renders
    const matchIds = useMemo(() => {
        return matchDays.map(match => match.id);
    }, [matchDays]);
    
    // Fetch participation overview for all matches in a single request
    const { overview: batchedOverview } = useBatchedParticipationOverview({
        matchIds,
        refreshTrigger,
    });

    const handleParticipationChange = () => {
        // Trigger a refresh of the participation overview
        setTimeout(() => {
            setRefreshTrigger((prev) => prev + 1);
        }, 100);
    };

    return (
        <div className={styles.matchDayList}>
            {matchDays.map((match) => (
                <MatchDayCard 
                    key={match.id} 
                    match={match} 
                    participationOverview={batchedOverview?.[match.id]}
                    onParticipationChange={handleParticipationChange}
                />
            ))}
        </div>
    );
}

