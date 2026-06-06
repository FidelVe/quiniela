import Link from "next/link";
import { leaderboard, officialTotalGoals } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const [rows, officialGoals] = await Promise.all([
    leaderboard(),
    officialTotalGoals(),
  ]);
  const maxPoints = rows[0]?.points ?? 0;

  return (
    <section>
      <header className="mb-10 md:mb-14 flex items-end justify-between gap-6 border-b border-edge pb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.5em] text-flame mb-2">La Tabla</p>
          <h1 className="display text-7xl md:text-[9rem] text-paper">Posiciones</h1>
        </div>
        <div className="hidden md:block text-right text-xs uppercase tracking-[0.3em] text-mute">
          <p>Fase de grupos</p>
          <p className="mt-1">2026 · Norteamérica</p>
        </div>
      </header>

      {rows.length === 0 ? (
        <EmptyState />
      ) : (
        <ol className="border-t border-edge">
          {rows.map((r, i) => {
            const rank = i + 1;
            const isFirst = rank === 1;
            const isSecond = rank === 2;
            const isThird = rank === 3;
            const rankColor = isFirst
              ? "text-flame glow-flame"
              : isSecond
                ? "text-bone"
                : isThird
                  ? "text-clay"
                  : "text-edge";
            return (
              <li key={r.participant_id} className="border-b border-edge group">
                <Link
                  href={`/participant/${r.participant_id}`}
                  className="grid grid-cols-[3.5rem_1fr_auto] md:grid-cols-[5rem_1fr_auto] items-center gap-4 md:gap-6 px-2 md:px-3 py-4 md:py-6 transition-colors hover:bg-coal"
                >
                  <span className={`display text-5xl md:text-7xl tabular-nums text-right ${rankColor}`}>
                    {rank.toString().padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <div className="text-lg md:text-2xl font-medium text-paper group-hover:text-flame transition-colors truncate">
                      {r.name}
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-mute">
                      <span>{r.exact_count} exactos</span>
                      <span>{r.total_goals} goles</span>
                      {r.exact_count > 0 && (
                        <span className="text-jade glow-jade">✦</span>
                      )}
                      {maxPoints > 0 && r.points > 0 && (
                        <span className="hidden md:inline-flex h-[2px] flex-1 max-w-32 bg-edge relative overflow-hidden">
                          <span
                            className="absolute inset-y-0 left-0 bg-flame"
                            style={{ width: `${(r.points / maxPoints) * 100}%` }}
                          />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="score-num text-3xl md:text-5xl text-paper">{r.points}</div>
                    <div className="text-[10px] uppercase tracking-[0.4em] text-mute mt-0.5">pts</div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.4em] text-mute">
        <p>Desempate — Marcadores exactos · luego goles totales más cercanos al real</p>
        <p>
          Goles oficiales — <span className="text-paper">{officialGoals}</span>
        </p>
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="border border-edge bg-coal px-6 py-16 text-center">
      <p className="display text-3xl text-mute">Aún sin participantes</p>
      <p className="text-[10px] uppercase tracking-[0.4em] text-mute mt-2">
        Agrégalos desde la consola de administración
      </p>
    </div>
  );
}
