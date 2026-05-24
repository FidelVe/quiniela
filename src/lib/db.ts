import { Pool, type PoolClient, type QueryResultRow } from "pg";
import fixturesData from "../../data/fixtures.json";

interface FixtureRow {
  group: string;
  home_team: string;
  away_team: string;
  kickoff_at: string;
}

const fixtures = fixturesData as FixtureRow[];

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

let initPromise: Promise<void> | null = null;

async function doInit(): Promise<void> {
  // Tolerate the db being unavailable briefly at startup (compose race).
  let lastError: unknown;
  for (let i = 0; i < 30; i++) {
    try {
      await pool.query("SELECT 1");
      lastError = null;
      break;
    } catch (e) {
      lastError = e;
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  if (lastError) throw lastError;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS participants (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS matches (
      id SERIAL PRIMARY KEY,
      "group" TEXT NOT NULL,
      home_team TEXT NOT NULL,
      away_team TEXT NOT NULL,
      kickoff_at TIMESTAMPTZ NOT NULL,
      home_score INTEGER,
      away_score INTEGER,
      status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','finished'))
    );

    CREATE TABLE IF NOT EXISTS predictions (
      id SERIAL PRIMARY KEY,
      participant_id INTEGER NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
      match_id INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
      home_score INTEGER NOT NULL,
      away_score INTEGER NOT NULL,
      UNIQUE(participant_id, match_id)
    );

    CREATE INDEX IF NOT EXISTS idx_predictions_match ON predictions(match_id);
    CREATE INDEX IF NOT EXISTS idx_predictions_participant ON predictions(participant_id);
  `);

  const { rows } = await pool.query<{ c: number }>(
    "SELECT COUNT(*)::int AS c FROM matches"
  );
  if (rows[0].c === 0) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      for (const f of fixtures) {
        await client.query(
          `INSERT INTO matches ("group", home_team, away_team, kickoff_at) VALUES ($1, $2, $3, $4)`,
          [f.group, f.home_team, f.away_team, f.kickoff_at]
        );
      }
      await client.query("COMMIT");
      console.log(`Seeded ${fixtures.length} matches.`);
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }
}

export async function ensureInit(): Promise<void> {
  if (!initPromise) initPromise = doInit();
  return initPromise;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
) {
  await ensureInit();
  return pool.query<T>(text, params);
}

export async function withClient<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  await ensureInit();
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}

export { pool };
