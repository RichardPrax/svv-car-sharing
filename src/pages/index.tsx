import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { MatchDay } from "@/entities/MatchDay";
import MatchDayList from "@/components/MatchDayList";
import NextMatchCard from "@/components/NextMatchCard";

export default function HomePage() {
  const [matchDays, setMatchDays] = useState<MatchDay[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUserAndData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const { data } = await supabase.from("match_days").select("*");
      if (data) setMatchDays(data);
      setLoading(false);
    };

    getUserAndData();
  }, []);

  // Helper function to check if match is in the future
  const isMatchInFuture = (dateStr: string, timeStr: string): boolean => {
    const now = new Date();
    const matchDate = new Date(`${dateStr} ${timeStr}`);
    return matchDate > now;
  };

  // Sort all matches by date and time
  const sortedMatchDays = matchDays.sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  // Find the next upcoming match
  const nextMatch = sortedMatchDays.find((match) =>
    isMatchInFuture(match.date, match.time)
  );

  if (loading) return <p>Lade...</p>;

  return (
    <div
      style={{
        padding: "var(--spacing-lg) 0",
        minHeight: "100vh",
        backgroundColor: "var(--background)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 var(--spacing-md)",
        }}
      >
        {/* Nächster Spieltag Section */}
        {nextMatch && (
          <section style={{ marginBottom: "var(--spacing-xl)" }}>
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                marginBottom: "var(--spacing-lg)",
                color: "var(--text-primary)",
                textAlign: "center",
                padding: "0 var(--spacing-md)",
              }}
            >
              Nächster Spieltag
            </h2>
            <NextMatchCard match={nextMatch} />
          </section>
        )}

        {/* Alle Spieltage Section */}
        <section>
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: "700",
              marginBottom: "var(--spacing-lg)",
              color: "var(--text-primary)",
              textAlign: "center",
              padding: "0 var(--spacing-md)",
            }}
          >
            Alle Spieltage
          </h2>
          <MatchDayList matchDays={sortedMatchDays} />
        </section>
      </div>
    </div>
  );
}
