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

  const finished = match.status === "finished";

  return (
    <section>
      <Link
        href="/fixtures"
        className="text-[10px] uppercase tracking-[0.4em] text-mute hover:text-flame transition"
      >
        ← Calendario
      </Link>

      {/* Marcador */}
      <div className="relative my-6 md:my-10 border border-edge bg-coal overflow-hidden pitch-bg">
        <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="display text-[16rem] md:text-[28rem] leading-none text-edge opacity-60">
            {match.group}
          </span>
        </div>

        <div className="relative z-10 p-6 md:p-12">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.4em] text-mute mb-6 md:mb-10">
            <span>Grupo {match.group}</span>
            <span className="hidden sm:inline">{formatKickoffFull(match.kickoff_at)}</span>
            <span className={finished ? "text-jade" : "text-flame"}>
              {finished ? "● Tiempo Final" : "○ Programado"}
            </span>
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-10">
            <div className="text-right">
              <div className="display text-3xl md:text-6xl text-paper leading-tight">
                {match.home_team}
              </div>
            </div>
            <div className="text-center">
              {finished ? (
                <div className="score-num text-5xl md:text-8xl text-paper tabular-nums whitespace-nowrap">
                  {match.home_score}
                  <span className="text-edge mx-2 md:mx-4">–</span>
                  {match.away_score}
                </div>
              ) : (
                <div className="display text-4xl md:text-6xl text-mute">vs</div>
              )}
            </div>
            <div className="text-left">
              <div className="display text-3xl md:text-6xl text-paper leading-tight">
                {match.away_team}
              </div>
            </div>
          </div>
          <div className="sm:hidden mt-6 text-center text-[10px] uppercase tracking-[0.3em] text-mute">
            {formatKickoffFull(match.kickoff_at)}
          </div>
        </div>
      </div>

      <div className="mb-3 flex items-baseline justify-between border-b border-edge pb-3">
        <h2 className="display text-3xl md:text-4xl text-paper">Pronósticos</h2>
        <span className="text-[10px] uppercase tracking-[0.3em] text-mute">
          {preds.size} / {participants.length} registrados
        </span>
      </div>

      <ul>
        {rows.map(({ participant, pred, points, exact }) => (
          <li key={participant.id} className="border-b border-edge group">
            <Link
              href={`/participant/${participant.id}`}
              className="grid grid-cols-[1fr_auto_auto] gap-4 md:gap-6 items-center px-2 py-3 hover:bg-coal transition"
            >
              <span className="text-paper group-hover:text-flame transition truncate">
                {participant.name}
              </span>
              <span className="score-num text-base text-paper min-w-[5rem] text-center">
                {pred ? (
                  <>
                    {pred.home_score}
                    <span className="text-edge mx-1">–</span>
                    {pred.away_score}
                  </>
                ) : (
                  <span className="text-mute">—</span>
                )}
              </span>
              <span
                className={`score-num text-lg w-16 text-right ${
                  exact
                    ? "text-jade glow-jade"
                    : finished
                      ? points > 0
                        ? "text-paper"
                        : "text-mute"
                      : "text-mute"
                }`}
              >
                {finished ? (
                  <>
                    {points}
                    {exact && <span className="ml-1">✦</span>}
                  </>
                ) : (
                  "·"
                )}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
