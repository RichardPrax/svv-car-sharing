// src/hooks/matches/useMatchDetail.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MatchDay } from "@/entities/MatchDay";

export function useMatchDetail(matchId: string | string[] | undefined) {
    const [match, setMatch] = useState<MatchDay | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMatch = async () => {
            // Warte bis matchId verfügbar ist (Router ist geladen)
            if (!matchId) {
                setLoading(true);
                return;
            }

            if (Array.isArray(matchId)) {
                setError("Ungültige Match-ID");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const { data, error: fetchError } = await supabase.from("match_days").select("*").eq("id", matchId).single();

                if (fetchError) {
                    console.error("Error fetching match:", fetchError);
                    setError("Spieltag nicht gefunden");
                    return;
                }

                setMatch(data);
            } catch (err) {
                console.error("Error:", err);
                setError("Ein unerwarteter Fehler ist aufgetreten");
            } finally {
                setLoading(false);
            }
        };

        fetchMatch();
    }, [matchId]);

    return {
        match,
        loading,
        error,
    };
}

