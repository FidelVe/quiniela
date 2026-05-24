import Link from "next/link";
import { listMatches, listParticipants } from "@/lib/queries";
import { formatKickoffFull } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [participants, matches] = await Promise.all([listParticipants(), listMatches()]);
  const finished = matches.filter((m) => m.status === "finished").length;
  const upcoming = matches
    .filter((m) => m.status === "scheduled")
    .sort((a, b) => a.kickoff_at.localeCompare(b.kickoff_at))
    .slice(0, 5);

  return (
    <section>
      <header className="mb-10 flex items-end justify-between border-b border-edge pb-4">
        <h1 className="display text-5xl md:text-7xl text-paper leading-none">Dashboard</h1>
        <span className="hidden md:block text-[10px] uppercase tracking-[0.4em] text-mute">
          Control room
        </span>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-14">
        <Stat label="Participants" value={participants.length} accent="paper" />
        <Stat label="Played" value={`${finished} / ${matches.length}`} accent="jade" />
        <Stat label="Remaining" value={matches.length - finished} accent="flame" />
      </div>

      <div className="flex items-baseline justify-between mb-4 border-b border-edge pb-3">
        <h2 className="display text-2xl md:text-3xl text-paper">Next kickoffs</h2>
        <Link
          href="/admin/matches"
          className="text-[10px] uppercase tracking-[0.3em] text-mute hover:text-flame transition"
        >
          All matches →
        </Link>
      </div>

      {upcoming.length === 0 ? (
        <p className="text-mute uppercase tracking-widest text-xs">No upcoming matches.</p>
      ) : (
        <ul>
          {upcoming.map((m) => (
            <li key={m.id} className="border-b border-edge group">
              <Link
                href={`/admin/matches/${m.id}`}
                className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 px-2 py-4 hover:bg-coal transition"
              >
                <span className="display flex items-center justify-center w-9 h-9 border border-edge bg-coal text-flame text-lg">
                  {m.group}
                </span>
                <div className="min-w-0">
                  <div className="text-paper group-hover:text-flame transition truncate">
                    {m.home_team} <span className="text-mute">vs</span> {m.away_team}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-mute mt-1">
                    {formatKickoffFull(m.kickoff_at)}
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-mute group-hover:text-flame transition">
                  Enter →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
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
  accent: "paper" | "jade" | "flame";
}) {
  const colorClass =
    accent === "jade" ? "text-jade glow-jade" : accent === "flame" ? "text-flame glow-flame" : "text-paper";
  return (
    <div className="border border-edge bg-coal p-5 md:p-6 relative pitch-bg">
      <div className="text-[10px] uppercase tracking-[0.4em] text-mute mb-3">{label}</div>
      <div className={`display text-5xl md:text-6xl ${colorClass} tabular-nums leading-none`}>
        {value}
      </div>
    </div>
  );
}
