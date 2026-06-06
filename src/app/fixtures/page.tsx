import Link from "next/link";
import { listMatches } from "@/lib/queries";
import { formatKickoff, kickoffDayKey, TIME_ZONE } from "@/lib/format";
import { ShareActions } from "@/components/share-actions";

export const dynamic = "force-dynamic";

function stripPeriod(s: string): string {
  return s.replace(/\.$/, "");
}

export default async function FixturesPage() {
  const matches = await listMatches();

  const byDate = new Map<string, typeof matches>();
  for (const m of matches) {
    const day = kickoffDayKey(m.kickoff_at);
    if (!byDate.has(day)) byDate.set(day, []);
    byDate.get(day)!.push(m);
  }

  return (
    <section>
      <header className="mb-10 md:mb-14 flex items-end justify-between gap-6 border-b border-edge pb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.5em] text-flame mb-2">Todos los partidos</p>
          <h1 className="display text-7xl md:text-[9rem] text-paper">Calendario</h1>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="hidden md:block text-right text-xs uppercase tracking-[0.3em] text-mute">
            <p>72 partidos</p>
            <p className="mt-1">Solo fase de grupos</p>
          </div>
          <ShareActions title="Calendario — Quiniela 26" />
        </div>
      </header>

      <div className="space-y-12">
        {[...byDate.entries()].map(([day, dayMatches]) => {
          const date = new Date(dayMatches[0].kickoff_at);
          const dow = stripPeriod(
            date.toLocaleDateString("es", { weekday: "short", timeZone: TIME_ZONE })
          ).toUpperCase();
          const dnum = Number(day.slice(8, 10));
          const mo = stripPeriod(
            date.toLocaleDateString("es", { month: "short", timeZone: TIME_ZONE })
          ).toUpperCase();
          return (
            <div key={day}>
              <div className="flex items-baseline gap-4 mb-3">
                <span className="display text-5xl md:text-7xl text-paper tabular-nums">
                  {dnum}
                </span>
                <div className="flex flex-col leading-none gap-1">
                  <span className="text-[10px] tracking-[0.4em] text-flame uppercase">{dow}</span>
                  <span className="text-[10px] tracking-[0.4em] text-mute uppercase">{mo}</span>
                </div>
                <span className="ml-auto text-[10px] tracking-[0.4em] text-mute uppercase">
                  {dayMatches.length} {dayMatches.length === 1 ? "partido" : "partidos"}
                </span>
              </div>
              <ul className="border-t border-edge">
                {dayMatches.map((m) => {
                  const finished = m.status === "finished";
                  return (
                    <li key={m.id} className="border-b border-edge group">
                      <Link
                        href={`/match/${m.id}`}
                        className="grid grid-cols-[2.25rem_3.5rem_1fr_auto_1fr_2rem] md:grid-cols-[2.5rem_4rem_1fr_auto_1fr_2.5rem] gap-2 md:gap-4 items-center px-2 py-3 md:py-4 hover:bg-coal transition"
                      >
                        <GroupChip letter={m.group} />
                        <span className="score-num text-xs text-mute">
                          {formatKickoff(m.kickoff_at)}
                        </span>
                        <span className="text-right text-sm md:text-base text-paper group-hover:text-flame transition truncate">
                          {m.home_team}
                        </span>
                        <span className="score-num text-base md:text-lg min-w-[5rem] text-center">
                          {finished ? (
                            <span className="text-paper">
                              {m.home_score}
                              <span className="text-edge mx-1">–</span>
                              {m.away_score}
                            </span>
                          ) : (
                            <span className="text-mute text-[10px] uppercase tracking-[0.3em]">
                              vs
                            </span>
                          )}
                        </span>
                        <span className="text-sm md:text-base text-paper group-hover:text-flame transition truncate">
                          {m.away_team}
                        </span>
                        <span
                          className={`text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-right ${
                            finished ? "text-jade" : "text-mute"
                          }`}
                        >
                          {finished ? "FIN" : "—"}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function GroupChip({ letter }: { letter: string }) {
  return (
    <span className="display flex items-center justify-center w-8 h-8 md:w-9 md:h-9 border border-edge bg-coal text-flame text-base md:text-lg">
      {letter}
    </span>
  );
}
