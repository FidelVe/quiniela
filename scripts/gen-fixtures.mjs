// Generates a placeholder fixture list for the 2026 FIFA World Cup group stage.
// 48 teams in 12 groups (A-L) of 4, 6 matches per group = 72 matches.
// Replace team names and kickoff times with the real schedule when ready.
//
// Usage: npm run gen-fixtures

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "..", "data", "fixtures.json");

const groups = "ABCDEFGHIJKL".split("");
// 6 match pairings per group (round-robin order: matchday 1 → 3)
const pairings = [
  [1, 2],
  [3, 4],
  [1, 3],
  [2, 4],
  [1, 4],
  [2, 3],
];

// Group stage spans 2026-06-11 → 2026-06-27. Spread matches across that window.
const startDate = new Date("2026-06-11T17:00:00Z");
const matches = [];

let idx = 0;
for (const g of groups) {
  for (const [a, b] of pairings) {
    const kickoff = new Date(startDate.getTime() + idx * 3 * 60 * 60 * 1000);
    matches.push({
      group: g,
      home_team: `Team ${g}${a}`,
      away_team: `Team ${g}${b}`,
      kickoff_at: kickoff.toISOString(),
    });
    idx++;
  }
}

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(matches, null, 2) + "\n");
console.log(`Wrote ${matches.length} matches to ${outPath}`);
