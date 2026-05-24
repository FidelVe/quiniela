import Link from "next/link";
import { listMatches, listParticipants } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const participants = await listParticipants();
  const matches = await listMatches();
  const finished = matches.filter((m) => m.status === "finished").length;
  const upcoming = matches
    .filter((m) => m.status === "scheduled")
    .sort((a, b) => a.kickoff_at.localeCompare(b.kickoff_at))
    .slice(0, 5);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Stat label="Participants" value={participants.length} />
        <Stat label="Matches finished" value={`${finished} / ${matches.length}`} />
        <Stat label="Matches remaining" value={matches.length - finished} />
      </div>

      <h2 className="text-lg font-semibold mb-2">Next matches</h2>
      {upcoming.length === 0 ? (
        <p className="text-neutral-500">No upcoming matches.</p>
      ) : (
        <ul className="space-y-1">
          {upcoming.map((m) => (
            <li key={m.id}>
              <Link
                href={`/admin/matches/${m.id}`}
                className="block px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded hover:bg-neutral-100 dark:hover:bg-neutral-900"
              >
                <span className="text-xs text-neutral-500 mr-3">Group {m.group}</span>
                {m.home_team} vs {m.away_team}
                <span className="text-xs text-neutral-500 ml-3">
                  {new Date(m.kickoff_at).toLocaleString()}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
      <div className="text-xs text-neutral-500 uppercase tracking-wide">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}
