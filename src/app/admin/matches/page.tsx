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
  const finished = matches.filter((m) => m.status === "finished").length;

  return (
    <section>
      <header className="flex items-end justify-between mb-10 border-b border-edge pb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.5em] text-flame mb-2">Todo el calendario</p>
          <h1 className="display text-5xl md:text-7xl text-paper leading-none">Partidos</h1>
        </div>
        <div className="text-right text-[10px] uppercase tracking-[0.3em] text-mute">
          <p>{matches.length} en total</p>
          <p className="mt-1 text-jade">{finished} jugados</p>
        </div>
      </header>

      <ul className="border-t border-edge">
        {matches.map((m) => {
          const n = counts.get(m.id) ?? 0;
          const allEntered = participantCount > 0 && n === participantCount;
          const isFinished = m.status === "finished";
          return (
            <li key={m.id} className="border-b border-edge group">
              <Link
                href={`/admin/matches/${m.id}`}
                className="grid grid-cols-[2.5rem_1fr_auto] md:grid-cols-[2.5rem_1fr_auto_5rem] gap-3 md:gap-5 items-center px-2 py-3 hover:bg-coal transition"
              >
                <span className="display flex items-center justify-center w-9 h-9 border border-edge bg-coal text-flame text-base">
                  {m.group}
                </span>
                <div className="min-w-0">
                  <div className="text-paper group-hover:text-flame transition truncate text-sm md:text-base">
                    {m.home_team} <span className="text-mute text-xs">vs</span> {m.away_team}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-mute mt-0.5">
                    {formatKickoffFull(m.kickoff_at)}
                  </div>
                </div>
                <div className="text-right text-xs flex items-center gap-2">
                  <span
                    className={`score-num ${allEntered ? "text-jade" : n > 0 ? "text-paper" : "text-mute"}`}
                  >
                    {n}
                  </span>
                  <span className="text-mute">/ {participantCount}</span>
                </div>
                <div className="hidden md:block score-num text-right">
                  {isFinished ? (
                    <span className="text-jade">
                      {m.home_score}
                      <span className="text-edge mx-1">–</span>
                      {m.away_score}
                    </span>
                  ) : (
                    <span className="text-mute text-[10px] uppercase tracking-[0.3em]">
                      Programado
                    </span>
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
