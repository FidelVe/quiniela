import Link from "next/link";
import { leaderboard } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const rows = await leaderboard();

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      {rows.length === 0 ? (
        <p className="text-neutral-500">No participants yet. Add some in the admin panel.</p>
      ) : (
        <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-neutral-100 dark:bg-neutral-900 text-left">
              <tr>
                <th className="px-3 py-2 w-12">#</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2 text-right">Points</th>
                <th className="px-3 py-2 text-right">Exact</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.participant_id} className="border-t border-neutral-200 dark:border-neutral-800">
                  <td className="px-3 py-2 text-neutral-500">{i + 1}</td>
                  <td className="px-3 py-2">
                    <Link href={`/participant/${r.participant_id}`} className="hover:underline">
                      {r.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-right font-medium">{r.points}</td>
                  <td className="px-3 py-2 text-right text-neutral-500">{r.exact_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-neutral-500 mt-3">
        Tiebreaker: more exact-score predictions, then alphabetical.
      </p>
    </section>
  );
}
