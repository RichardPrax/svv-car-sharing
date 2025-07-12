// src/hooks/matches/useMatchDetail.tsx
import { useEffect, useState } from "react";
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
                const response = await fetch(`/api/matches/${matchId}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        setError("Spieltag nicht gefunden");
                    } else {
                        throw new Error("Fehler beim Laden des Spieltags");
                    }
                    return;
                }

                const data = await response.json();
                setMatch(data);
            } catch (err) {
                console.error("Error fetching match:", err);
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

