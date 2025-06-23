import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { MatchDay } from "@/entities/MatchDay";
import MatchDayList from "@/components/MatchDayList";

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
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            marginBottom: "var(--spacing-xl)",
            color: "var(--text-primary)",
            textAlign: "center",
            padding: "0 var(--spacing-md)",
          }}
        >
          Spieltage
        </h1>
        <MatchDayList matchDays={matchDays} />
      </div>
    </div>
  );
}
