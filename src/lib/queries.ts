import { query } from "./db";
import type { LeaderboardRow, Match, Participant, Prediction } from "./types";

interface MatchRow {
  id: number;
  group: string;
  home_team: string;
  away_team: string;
  kickoff_at: Date | string;
  home_score: number | null;
  away_score: number | null;
  status: "scheduled" | "finished";
}

function normalizeMatch(row: MatchRow): Match {
  return {
    id: row.id,
    group: row.group,
    home_team: row.home_team,
    away_team: row.away_team,
    kickoff_at:
      row.kickoff_at instanceof Date
        ? row.kickoff_at.toISOString()
        : String(row.kickoff_at),
    home_score: row.home_score,
    away_score: row.away_score,
    status: row.status,
  };
}

export async function listParticipants(): Promise<Participant[]> {
  const { rows } = await query<Participant>(
    `SELECT id, name FROM participants ORDER BY name`
  );
  return rows;
}

export async function getParticipant(id: number): Promise<Participant | undefined> {
  const { rows } = await query<Participant>(
    `SELECT id, name FROM participants WHERE id = $1`,
    [id]
  );
  return rows[0];
}

export async function listMatches(): Promise<Match[]> {
  const { rows } = await query<MatchRow>(
    `SELECT id, "group", home_team, away_team, kickoff_at, home_score, away_score, status
     FROM matches
     ORDER BY kickoff_at, id`
  );
  return rows.map(normalizeMatch);
}

export async function getMatch(id: number): Promise<Match | undefined> {
  const { rows } = await query<MatchRow>(
    `SELECT id, "group", home_team, away_team, kickoff_at, home_score, away_score, status
     FROM matches WHERE id = $1`,
    [id]
  );
  return rows[0] ? normalizeMatch(rows[0]) : undefined;
}

export async function predictionsForMatch(matchId: number): Promise<Map<number, Prediction>> {
  const { rows } = await query<Prediction>(
    `SELECT id, participant_id, match_id, home_score, away_score
     FROM predictions WHERE match_id = $1`,
    [matchId]
  );
  return new Map(rows.map((r) => [r.participant_id, r]));
}

export async function predictionsForParticipant(
  participantId: number
): Promise<Map<number, Prediction>> {
  const { rows } = await query<Prediction>(
    `SELECT id, participant_id, match_id, home_score, away_score
     FROM predictions WHERE participant_id = $1`,
    [participantId]
  );
  return new Map(rows.map((r) => [r.match_id, r]));
}

interface LeaderboardRowRaw {
  participant_id: number;
  name: string;
  points: number | string;
  exact_count: number | string;
}

export async function leaderboard(): Promise<LeaderboardRow[]> {
  const { rows } = await query<LeaderboardRowRaw>(`
    SELECT
      p.id AS participant_id,
      p.name,
      COALESCE(SUM(CASE
        WHEN m.status = 'finished'
         AND m.home_score = pr.home_score
         AND m.away_score = pr.away_score THEN 4
        WHEN m.status = 'finished'
         AND SIGN(pr.home_score - pr.away_score) = SIGN(m.home_score - m.away_score) THEN 1
        ELSE 0
      END), 0)::int AS points,
      COALESCE(SUM(CASE
        WHEN m.status = 'finished'
         AND m.home_score = pr.home_score
         AND m.away_score = pr.away_score THEN 1
        ELSE 0
      END), 0)::int AS exact_count
    FROM participants p
    LEFT JOIN predictions pr ON pr.participant_id = p.id
    LEFT JOIN matches m ON m.id = pr.match_id
    GROUP BY p.id, p.name
    ORDER BY points DESC, exact_count DESC, p.name ASC
  `);
  return rows.map((r) => ({
    participant_id: r.participant_id,
    name: r.name,
    points: Number(r.points),
    exact_count: Number(r.exact_count),
  }));
}

export async function predictionCountsByMatch(): Promise<Map<number, number>> {
  const { rows } = await query<{ match_id: number; c: number }>(
    `SELECT match_id, COUNT(*)::int AS c FROM predictions GROUP BY match_id`
  );
  return new Map(rows.map((r) => [r.match_id, Number(r.c)]));
}
