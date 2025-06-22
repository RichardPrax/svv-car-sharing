// pages/index.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";

type MatchDay = {
  id: string;
  date: string;
  time: string;
  location: string;
  opponent: string;
};

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Spieltage</h1>
      <ul className="space-y-3">
        {matchDays.map((match) => (
          <li key={match.id} className="border rounded p-4">
            <p>
              <strong>Datum:</strong> {match.date}
            </p>
            <p>
              <strong>Zeit:</strong> {match.time}
            </p>
            <p>
              <strong>Ort:</strong> {match.location}
            </p>
            <p>
              <strong>Gegner:</strong> {match.opponent}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
