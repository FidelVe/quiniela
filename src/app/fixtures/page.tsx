import Link from "next/link";
import { listMatches } from "@/lib/queries";
import { formatKickoff } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function FixturesPage() {
  const matches = await listMatches();

  const byDate = new Map<string, typeof matches>();
  for (const m of matches) {
    const day = new Date(m.kickoff_at).toISOString().slice(0, 10);
    if (!byDate.has(day)) byDate.set(day, []);
    byDate.get(day)!.push(m);
  }

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Fixtures</h1>
      <div className="space-y-6">
        {[...byDate.entries()].map(([day, dayMatches]) => (
          <div key={day}>
            <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-2">
              {new Date(day).toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h2>
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              {dayMatches.map((m) => (
                <Link
                  key={m.id}
                  href={`/match/${m.id}`}
                  className="flex items-center px-3 py-2 border-t first:border-t-0 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                >
                  <span className="text-xs text-neutral-500 w-20">
                    Group {m.group}
                  </span>
                  <span className="text-xs text-neutral-500 w-24">
                    {formatKickoff(m.kickoff_at)}
                  </span>
                  <span className="flex-1 text-right">{m.home_team}</span>
                  <span className="px-3 font-mono">
                    {m.status === "finished"
                      ? `${m.home_score}–${m.away_score}`
                      : "vs"}
                  </span>
                  <span className="flex-1">{m.away_team}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
