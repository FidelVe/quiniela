import Link from "next/link";
import { listMatches, predictionCountsByMatch, listParticipants } from "@/lib/queries";
import { formatKickoffFull } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminMatchesPage() {
  const [matches, participants, counts] = await Promise.all([
    listMatches(),
    listParticipants(),
    predictionCountsByMatch(),
  ]);
  const participantCount = participants.length;

  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">Matches</h1>
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 dark:bg-neutral-900 text-left">
            <tr>
              <th className="px-3 py-2">Match</th>
              <th className="px-3 py-2">Kickoff</th>
              <th className="px-3 py-2 text-right">Predictions</th>
              <th className="px-3 py-2 text-right">Result</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((m) => {
              const n = counts.get(m.id) ?? 0;
              return (
                <tr
                  key={m.id}
                  className="border-t border-neutral-200 dark:border-neutral-800"
                >
                  <td className="px-3 py-2">
                    <Link
                      href={`/admin/matches/${m.id}`}
                      className="hover:underline"
                    >
                      <span className="text-xs text-neutral-500 mr-2">{m.group}</span>
                      {m.home_team} vs {m.away_team}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-neutral-500 text-xs">
                    {formatKickoffFull(m.kickoff_at)}
                  </td>
                  <td className="px-3 py-2 text-right text-xs">
                    {n} / {participantCount}
                  </td>
                  <td className="px-3 py-2 text-right font-mono">
                    {m.status === "finished" ? (
                      `${m.home_score}–${m.away_score}`
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
