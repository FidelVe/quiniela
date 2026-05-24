"use server";

import { revalidatePath } from "next/cache";
import { query, withClient } from "@/lib/db";

function parseScore(v: FormDataEntryValue | null): number | null {
  if (v === null) return null;
  const s = String(v).trim();
  if (s === "") return null;
  const n = Number(s);
  if (!Number.isInteger(n) || n < 0 || n > 99) return null;
  return n;
}

export async function saveMatchAction(formData: FormData) {
  const matchId = Number(formData.get("match_id"));
  if (!matchId) return;

  const homeScore = parseScore(formData.get("result_home"));
  const awayScore = parseScore(formData.get("result_away"));
  const status =
    homeScore !== null && awayScore !== null ? "finished" : "scheduled";

  await query(
    `UPDATE matches SET home_score = $1, away_score = $2, status = $3 WHERE id = $4`,
    [homeScore, awayScore, status, matchId]
  );

  // Collect prediction inputs. Format: pred_<participantId>_home / _away
  const upserts: Array<{ pid: number; home: number; away: number }> = [];
  const deletes: number[] = [];

  const seen = new Set<number>();
  for (const [key] of formData.entries()) {
    const m = key.match(/^pred_(\d+)_home$/);
    if (!m) continue;
    const pid = Number(m[1]);
    if (seen.has(pid)) continue;
    seen.add(pid);

    const h = parseScore(formData.get(`pred_${pid}_home`));
    const a = parseScore(formData.get(`pred_${pid}_away`));
    if (h === null && a === null) {
      deletes.push(pid);
    } else if (h !== null && a !== null) {
      upserts.push({ pid, home: h, away: a });
    }
    // If only one of the two is provided, ignore (treat as not entered).
  }

  await withClient(async (client) => {
    await client.query("BEGIN");
    try {
      for (const u of upserts) {
        await client.query(
          `INSERT INTO predictions (participant_id, match_id, home_score, away_score)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (participant_id, match_id)
           DO UPDATE SET home_score = EXCLUDED.home_score, away_score = EXCLUDED.away_score`,
          [u.pid, matchId, u.home, u.away]
        );
      }
      for (const pid of deletes) {
        await client.query(
          `DELETE FROM predictions WHERE participant_id = $1 AND match_id = $2`,
          [pid, matchId]
        );
      }
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    }
  });

  revalidatePath(`/admin/matches/${matchId}`);
  revalidatePath(`/admin/matches`);
  revalidatePath(`/match/${matchId}`);
  revalidatePath(`/`);
  revalidatePath(`/fixtures`);
}
