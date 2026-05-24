import Link from "next/link";
import { notFound } from "next/navigation";
import { getMatch, listParticipants, predictionsForMatch } from "@/lib/queries";
import { pointsFor, isExact } from "@/lib/scoring";
import { formatKickoffFull } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const matchId = Number(id);
  const match = await getMatch(matchId);
  if (!match) notFound();

  const participants = await listParticipants();
  const preds = await predictionsForMatch(matchId);

  const rows = participants
    .map((p) => {
      const pred = preds.get(p.id);
      return {
        participant: p,
        pred,
        points: pointsFor(pred, match),
        exact: isExact(pred, match),
      };
    })
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return a.participant.name.localeCompare(b.participant.name);
    });

  return (
    <section>
      <div className="mb-6">
        <p className="text-xs text-neutral-500">
          Group {match.group} · {formatKickoffFull(match.kickoff_at)}
        </p>
        <h1 className="text-2xl font-bold mt-1">
          {match.home_team}{" "}
          <span className="font-mono text-neutral-500">
            {match.status === "finished" ? `${match.home_score}–${match.away_score}` : "vs"}
          </span>{" "}
          {match.away_team}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          {match.status === "finished" ? "Final result" : "Awaiting result"}
        </p>
      </div>

      <h2 className="text-lg font-semibold mb-2">Predictions ({preds.size}/{participants.length})</h2>
      <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 dark:bg-neutral-900 text-left">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2 text-right">Prediction</th>
              <th className="px-3 py-2 text-right">Points</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ participant, pred, points, exact }) => (
              <tr
                key={participant.id}
                className="border-t border-neutral-200 dark:border-neutral-800"
              >
                <td className="px-3 py-2">
                  <Link href={`/participant/${participant.id}`} className="hover:underline">
                    {participant.name}
                  </Link>
                </td>
                <td className="px-3 py-2 text-right font-mono">
                  {pred ? `${pred.home_score}–${pred.away_score}` : <span className="text-neutral-400">—</span>}
                </td>
                <td className="px-3 py-2 text-right">
                  {match.status === "finished" ? (
                    <span className={exact ? "font-bold text-green-600" : ""}>
                      {points}
                      {exact && " ★"}
                    </span>
                  ) : (
                    <span className="text-neutral-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
