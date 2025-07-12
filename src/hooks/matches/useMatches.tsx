// src/hooks/matches/useMatches.tsx
import { useEffect, useState } from "react";
import { MatchDay } from "@/entities/MatchDay";
import { sortMatchesByDateTime, isMatchInFuture } from "@/utils/dateTime";

export function useMatches() {
    const [matchDays, setMatchDays] = useState<MatchDay[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await fetch("/api/matches");

                if (!response.ok) {
                    throw new Error("Fehler beim Laden der Spieltage");
                }

                const data = await response.json();
                setMatchDays(data);
            } catch (err) {
                console.error("Error fetching matches:", err);
                setError("Fehler beim Laden der Spieltage");
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    const sortedMatchDays = sortMatchesByDateTime(matchDays);
    const nextMatch = sortedMatchDays.find((match) => isMatchInFuture(match.date, match.time));

    return {
        matchDays: sortedMatchDays,
        nextMatch,
        loading,
        error,
    };
}

