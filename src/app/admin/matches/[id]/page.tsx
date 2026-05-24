import Link from "next/link";
import { notFound } from "next/navigation";
import { getMatch, listParticipants, predictionsForMatch } from "@/lib/queries";
import { formatKickoffFull } from "@/lib/format";
import { saveMatchAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminMatchEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const matchId = Number(id);
  const match = await getMatch(matchId);
  if (!match) notFound();

  const participants = await listParticipants();
  const preds = await predictionsForMatch(matchId);

  return (
    <section>
      <Link
        href="/admin/matches"
        className="text-sm text-neutral-500 hover:underline"
      >
        ← All matches
      </Link>
      <div className="mt-1 mb-6">
        <p className="text-xs text-neutral-500">
          Group {match.group} · {formatKickoffFull(match.kickoff_at)}
        </p>
        <h1 className="text-2xl font-bold mt-1">
          {match.home_team} vs {match.away_team}
        </h1>
      </div>

      <form action={saveMatchAction} className="space-y-6">
        <input type="hidden" name="match_id" value={match.id} />

        <fieldset className="border border-neutral-300 dark:border-neutral-700 rounded-lg p-4">
          <legend className="text-sm font-medium px-1">Final result</legend>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex-1 text-right">{match.home_team}</span>
            <input
              name="result_home"
              type="number"
              min={0}
              max={99}
              defaultValue={match.home_score ?? ""}
              className="w-16 text-center border border-neutral-300 dark:border-neutral-700 rounded px-2 py-1 bg-white dark:bg-neutral-900"
            />
            <span className="text-neutral-500">–</span>
            <input
              name="result_away"
              type="number"
              min={0}
              max={99}
              defaultValue={match.away_score ?? ""}
              className="w-16 text-center border border-neutral-300 dark:border-neutral-700 rounded px-2 py-1 bg-white dark:bg-neutral-900"
            />
            <span className="flex-1">{match.away_team}</span>
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            Leave both blank to mark as not played.
          </p>
        </fieldset>

        <fieldset className="border border-neutral-300 dark:border-neutral-700 rounded-lg p-4">
          <legend className="text-sm font-medium px-1">
            Predictions ({participants.length} participants)
          </legend>
          {participants.length === 0 ? (
            <p className="text-neutral-500 text-sm mt-2">
              Add participants first on the{" "}
              <Link href="/admin/participants" className="underline">
                Participants page
              </Link>
              .
            </p>
          ) : (
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-neutral-500">
                  <tr>
                    <th className="px-2 py-1">Participant</th>
                    <th className="px-2 py-1 text-center" colSpan={3}>
                      Prediction (home – away)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p) => {
                    const pred = preds.get(p.id);
                    return (
                      <tr key={p.id} className="border-t border-neutral-200 dark:border-neutral-800">
                        <td className="px-2 py-1">{p.name}</td>
                        <td className="px-2 py-1 text-right">
                          <input
                            name={`pred_${p.id}_home`}
                            type="number"
                            min={0}
                            max={99}
                            defaultValue={pred?.home_score ?? ""}
                            className="w-14 text-center border border-neutral-300 dark:border-neutral-700 rounded px-1 py-1 bg-white dark:bg-neutral-900"
                          />
                        </td>
                        <td className="px-1 text-neutral-500 text-center">–</td>
                        <td className="px-2 py-1">
                          <input
                            name={`pred_${p.id}_away`}
                            type="number"
                            min={0}
                            max={99}
                            defaultValue={pred?.away_score ?? ""}
                            className="w-14 text-center border border-neutral-300 dark:border-neutral-700 rounded px-1 py-1 bg-white dark:bg-neutral-900"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </fieldset>

        <div className="sticky bottom-4">
          <button
            type="submit"
            className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded px-6 py-3 font-medium shadow-lg"
          >
            Save match
          </button>
        </div>
      </form>
    </section>
  );
}
