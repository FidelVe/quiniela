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
        className="text-[10px] uppercase tracking-[0.4em] text-mute hover:text-flame transition"
      >
        ← All matches
      </Link>

      <form action={saveMatchAction} className="mt-2">
        <input type="hidden" name="match_id" value={match.id} />

        {/* Scoreboard with final-result inputs */}
        <div className="relative my-6 md:my-8 border border-edge bg-coal overflow-hidden pitch-bg">
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          >
            <span className="display text-[14rem] md:text-[22rem] leading-none text-edge opacity-60">
              {match.group}
            </span>
          </div>
          <div className="relative z-10 p-6 md:p-10">
            <div className="text-[10px] uppercase tracking-[0.4em] text-flame mb-6">
              Final result · Group {match.group} · {formatKickoffFull(match.kickoff_at)}
            </div>
            <div className="grid grid-cols-[1fr_auto_auto_auto_1fr] items-center gap-2 md:gap-6">
              <div className="display text-xl md:text-4xl text-paper text-right truncate">
                {match.home_team}
              </div>
              <ScoreInput name="result_home" defaultValue={match.home_score} />
              <span className="display text-2xl md:text-4xl text-edge">–</span>
              <ScoreInput name="result_away" defaultValue={match.away_score} />
              <div className="display text-xl md:text-4xl text-paper text-left truncate">
                {match.away_team}
              </div>
            </div>
            <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-mute text-center">
              Leave both blank to mark as not played
            </p>
          </div>
        </div>

        {/* Predictions grid */}
        <div className="flex items-baseline justify-between mb-3 border-b border-edge pb-3">
          <h2 className="display text-2xl md:text-3xl text-paper">Predictions</h2>
          <span className="text-[10px] uppercase tracking-[0.3em] text-mute">
            {participants.length} {participants.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        {participants.length === 0 ? (
          <div className="border border-edge bg-coal px-6 py-12 text-center">
            <p className="display text-2xl text-mute">No participants</p>
            <p className="text-[10px] uppercase tracking-[0.4em] text-mute mt-2">
              Add them on the{" "}
              <Link href="/admin/participants" className="text-flame hover:underline">
                Participants
              </Link>{" "}
              page first
            </p>
          </div>
        ) : (
          <ul>
            {participants.map((p, i) => {
              const pred = preds.get(p.id);
              return (
                <li
                  key={p.id}
                  className="grid grid-cols-[2rem_1fr_auto_auto_auto] items-center gap-2 md:gap-4 px-2 py-2 border-b border-edge hover:bg-coal/60 transition"
                >
                  <span className="score-num text-[10px] text-mute text-right">
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="text-paper truncate text-sm md:text-base">{p.name}</span>
                  <PredInput name={`pred_${p.id}_home`} defaultValue={pred?.home_score} />
                  <span className="text-edge text-lg">–</span>
                  <PredInput name={`pred_${p.id}_away`} defaultValue={pred?.away_score} />
                </li>
              );
            })}
          </ul>
        )}

        {/* Sticky save bar */}
        <div className="sticky bottom-4 mt-8 z-20 flex justify-center">
          <button
            type="submit"
            className="display block w-full md:w-auto md:px-16 py-4 bg-flame text-ink hover:bg-paper transition tracking-[0.2em] text-lg shadow-[0_12px_40px_-4px_rgba(255,106,31,0.55)]"
          >
            Save match
          </button>
        </div>
      </form>
    </section>
  );
}

function ScoreInput({ name, defaultValue }: { name: string; defaultValue: number | null }) {
  return (
    <input
      name={name}
      type="number"
      inputMode="numeric"
      min={0}
      max={99}
      defaultValue={defaultValue ?? ""}
      placeholder="–"
      className="score-num w-14 md:w-20 text-center bg-ink border border-edge focus:border-flame text-paper text-4xl md:text-5xl py-2 outline-none transition"
    />
  );
}

function PredInput({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue: number | null | undefined;
}) {
  return (
    <input
      name={name}
      type="number"
      inputMode="numeric"
      min={0}
      max={99}
      defaultValue={defaultValue ?? ""}
      placeholder="–"
      className="score-num w-11 md:w-14 text-center bg-ink border border-edge focus:border-flame text-paper text-lg md:text-xl py-1.5 outline-none transition placeholder:text-edge"
    />
  );
}
