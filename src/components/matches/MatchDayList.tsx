// src/components/matches/MatchDayList.tsx
import { MatchDay } from "@/entities/MatchDay";
import MatchDayCard from "./MatchDayCard";
import styles from "./Matches.module.css";

type Props = {
    matchDays: MatchDay[];
};

export default function MatchDayList({ matchDays }: Props) {
    return (
        <div className={styles.matchDayList}>
            {matchDays.map((match) => (
                <MatchDayCard key={match.id} match={match} />
            ))}
        </div>
    );
}

