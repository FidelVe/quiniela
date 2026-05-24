import Link from "next/link";
import { notFound } from "next/navigation";
import { getParticipant, listMatches, predictionsForParticipant } from "@/lib/queries";
import { pointsFor, isExact } from "@/lib/scoring";
import { formatKickoffFull } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ParticipantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pid = Number(id);
  const participant = await getParticipant(pid);
  if (!participant) notFound();

  const matches = await listMatches();
  const preds = await predictionsForParticipant(pid);

  let total = 0;
  let exact = 0;
  for (const m of matches) {
    const p = preds.get(m.id);
    total += pointsFor(p, m);
    if (isExact(p, m)) exact++;
  }

  return (
    <section>
      <div className="mb-6">
        <Link href="/" className="text-sm text-neutral-500 hover:underline">
          ← Leaderboard
        </Link>
        <h1 className="text-2xl font-bold mt-1">{participant.name}</h1>
        <p className="text-sm text-neutral-500 mt-1">
          {total} points · {exact} exact scores
        </p>
      </div>

      <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 dark:bg-neutral-900 text-left">
            <tr>
              <th className="px-3 py-2">Match</th>
              <th className="px-3 py-2">Kickoff</th>
              <th className="px-3 py-2 text-right">Prediction</th>
              <th className="px-3 py-2 text-right">Result</th>
              <th className="px-3 py-2 text-right">Points</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((m) => {
              const p = preds.get(m.id);
              const pts = pointsFor(p, m);
              const ex = isExact(p, m);
              return (
                <tr
                  key={m.id}
                  className="border-t border-neutral-200 dark:border-neutral-800"
                >
                  <td className="px-3 py-2">
                    <Link href={`/match/${m.id}`} className="hover:underline">
                      {m.home_team} vs {m.away_team}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-neutral-500 text-xs">
                    {formatKickoffFull(m.kickoff_at)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono">
                    {p ? `${p.home_score}–${p.away_score}` : <span className="text-neutral-400">—</span>}
                  </td>
                  <td className="px-3 py-2 text-right font-mono">
                    {m.status === "finished" ? `${m.home_score}–${m.away_score}` : <span className="text-neutral-400">—</span>}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {m.status === "finished" ? (
                      <span className={ex ? "font-bold text-green-600" : ""}>
                        {pts}
                        {ex && " ★"}
                      </span>
                    ) : (
                      <span className="text-neutral-400">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
