"use server";

import { revalidatePath } from "next/cache";
import { query, withClient } from "@/lib/db";

export type ActionState =
  | { ok: true; ts: number }
  | { ok: false; error: string }
  | null;

function parseScore(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (s === "") return null;
  const n = Number(s);
  if (!Number.isInteger(n) || n < 0 || n > 99) return null;
  return n;
}

function revalidateMatch(matchId: number) {
  revalidatePath(`/admin/matches/${matchId}`);
  revalidatePath(`/admin/matches`);
  revalidatePath(`/match/${matchId}`);
  revalidatePath(`/`);
  revalidatePath(`/fixtures`);
}

export async function saveMatchAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const matchId = Number(formData.get("match_id"));
    if (!matchId) return { ok: false, error: "ID de partido faltante" };

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

    revalidateMatch(matchId);
    return { ok: true, ts: Date.now() };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Error desconocido",
    };
  }
}

export async function clearMatchResultAction(matchId: number): Promise<void> {
  if (!matchId) return;
  await query(
    `UPDATE matches SET home_score = NULL, away_score = NULL, status = 'scheduled' WHERE id = $1`,
    [matchId]
  );
  revalidateMatch(matchId);
}

export async function saveMatchResultAction(
  matchId: number,
  homeStr: string,
  awayStr: string
): Promise<void> {
  if (!matchId) return;
  const h = parseScore(homeStr);
  const a = parseScore(awayStr);
  const status = h !== null && a !== null ? "finished" : "scheduled";
  await query(
    `UPDATE matches SET home_score = $1, away_score = $2, status = $3 WHERE id = $4`,
    [h, a, status, matchId]
  );
  revalidateMatch(matchId);
}

export async function savePredictionAction(
  matchId: number,
  participantId: number,
  homeStr: string,
  awayStr: string
): Promise<void> {
  if (!matchId || !participantId) return;
  const h = parseScore(homeStr);
  const a = parseScore(awayStr);
  if (h === null && a === null) {
    await query(
      `DELETE FROM predictions WHERE participant_id = $1 AND match_id = $2`,
      [participantId, matchId]
    );
  } else if (h !== null && a !== null) {
    await query(
      `INSERT INTO predictions (participant_id, match_id, home_score, away_score)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (participant_id, match_id)
       DO UPDATE SET home_score = EXCLUDED.home_score, away_score = EXCLUDED.away_score`,
      [participantId, matchId, h, a]
    );
  }
  // If only one of the two is provided, ignore.
  revalidateMatch(matchId);
}

export async function clearPredictionAction(
  matchId: number,
  participantId: number
): Promise<void> {
  if (!matchId || !participantId) return;
  await query(
    `DELETE FROM predictions WHERE participant_id = $1 AND match_id = $2`,
    [participantId, matchId]
  );
  revalidateMatch(matchId);
}
