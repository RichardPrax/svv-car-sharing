// src/hooks/matches/useMatches.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MatchDay } from "@/entities/MatchDay";
import { sortMatchesByDateTime, isMatchInFuture } from "@/utils/dateTime";

export function useMatches() {
    const [matchDays, setMatchDays] = useState<MatchDay[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const { data, error: fetchError } = await supabase.from("match_days").select("*");

                if (fetchError) {
                    console.error("Error fetching matches:", fetchError);
                    setError("Fehler beim Laden der Spieltage");
                    return;
                }

                setMatchDays(data || []);
            } catch (err) {
                console.error("Error:", err);
                setError("Ein unerwarteter Fehler ist aufgetreten");
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
