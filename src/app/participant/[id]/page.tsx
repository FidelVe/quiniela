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
  let predictionsMade = 0;
  for (const m of matches) {
    const p = preds.get(m.id);
    if (p) predictionsMade++;
    total += pointsFor(p, m);
    if (isExact(p, m)) exact++;
  }

  return (
    <section>
      <Link
        href="/"
        className="text-[10px] uppercase tracking-[0.4em] text-mute hover:text-flame transition"
      >
        ← Standings
      </Link>

      {/* Header card */}
      <div className="relative my-6 md:my-10 border border-edge bg-coal overflow-hidden pitch-bg">
        <div className="p-6 md:p-12">
          <p className="text-[10px] uppercase tracking-[0.5em] text-flame mb-3">Participant</p>
          <h1 className="display text-5xl md:text-8xl text-paper leading-[0.85] break-words">
            {participant.name}
          </h1>
          <div className="mt-8 md:mt-12 grid grid-cols-3 gap-4 md:gap-10">
            <Stat label="Points" value={total} accent="flame" />
            <Stat label="Exact" value={exact} accent="jade" />
            <Stat label="Predictions" value={`${predictionsMade}/${matches.length}`} accent="paper" />
          </div>
        </div>
      </div>

      <h2 className="display text-2xl md:text-3xl text-paper mb-3 border-b border-edge pb-3">
        All matches
      </h2>
      <ul>
        {matches.map((m) => {
          const p = preds.get(m.id);
          const pts = pointsFor(p, m);
          const ex = isExact(p, m);
          const finished = m.status === "finished";
          return (
            <li key={m.id} className="border-b border-edge group">
              <Link
                href={`/match/${m.id}`}
                className="grid grid-cols-[2.25rem_1fr_auto] md:grid-cols-[2.5rem_1fr_5rem_5rem_3rem] gap-2 md:gap-4 items-center px-2 py-3 hover:bg-coal transition"
              >
                <GroupChip letter={m.group} />
                <div className="min-w-0">
                  <div className="text-sm md:text-base text-paper group-hover:text-flame transition truncate">
                    {m.home_team} <span className="text-mute">vs</span> {m.away_team}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-mute mt-0.5">
                    {formatKickoffFull(m.kickoff_at)}
                  </div>
                </div>
                <div className="hidden md:block text-right">
                  <div className="text-[9px] uppercase tracking-[0.3em] text-mute mb-1">Pick</div>
                  <div className="score-num text-sm text-paper">
                    {p ? (
                      <>{p.home_score}<span className="text-edge mx-1">–</span>{p.away_score}</>
                    ) : (
                      <span className="text-mute">—</span>
                    )}
                  </div>
                </div>
                <div className="hidden md:block text-right">
                  <div className="text-[9px] uppercase tracking-[0.3em] text-mute mb-1">Final</div>
                  <div className="score-num text-sm">
                    {finished ? (
                      <span className={ex ? "text-jade glow-jade" : "text-paper"}>
                        {m.home_score}<span className="text-edge mx-1">–</span>{m.away_score}
                      </span>
                    ) : (
                      <span className="text-mute">—</span>
                    )}
                  </div>
                </div>
                <div className="md:hidden text-right">
                  <div className="score-num text-xs text-paper">
                    {p ? `${p.home_score}–${p.away_score}` : <span className="text-mute">—</span>}
                  </div>
                  <div className="score-num text-xs mt-0.5">
                    {finished ? (
                      <span className={ex ? "text-jade" : "text-mute"}>
                        {m.home_score}–{m.away_score}
                      </span>
                    ) : (
                      <span className="text-mute">—</span>
                    )}
                  </div>
                </div>
                <div className={`text-right hidden md:block score-num text-base ${ex ? "text-jade glow-jade" : finished && pts > 0 ? "text-paper" : "text-mute"}`}>
                  {finished ? (
                    <>
                      {pts}
                      {ex && <span className="ml-0.5">✦</span>}
                    </>
                  ) : (
                    "·"
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: "flame" | "jade" | "paper";
}) {
  const colorClass =
    accent === "flame" ? "text-flame glow-flame" : accent === "jade" ? "text-jade glow-jade" : "text-paper";
  return (
    <div>
      <div className={`score-num text-4xl md:text-6xl ${colorClass} tabular-nums leading-none`}>
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-[0.4em] text-mute mt-2">{label}</div>
    </div>
  );
}

function GroupChip({ letter }: { letter: string }) {
  return (
    <span className="display flex items-center justify-center w-8 h-8 md:w-9 md:h-9 border border-edge bg-coal text-flame text-base md:text-lg">
      {letter}
    </span>
  );
}
