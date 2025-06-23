// src/components/MatchDayList.tsx
import { MatchDay } from "@/entities/MatchDay";
import MatchDayCard from "./MatchDayCard";

type Props = {
  matchDays: MatchDay[];
};

export default function MatchDayList({ matchDays }: Props) {
  return (
    <div className="match-day-list">
      {matchDays.map((match) => (
        <MatchDayCard key={match.id} match={match} />
      ))}
    </div>
  );
}
