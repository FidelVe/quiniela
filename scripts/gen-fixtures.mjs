// Generates data/fixtures.json with the actual 2026 FIFA World Cup
// group-stage schedule (48 teams, 12 groups, 72 matches).
//
// Source: per-group schedule pages on Wikipedia (2026 FIFA World Cup
// Group A through Group L), confirmed against the post-draw schedule.
// Country names are in Spanish so they read naturally in the app.
//
// Usage:
//   node scripts/gen-fixtures.mjs   # writes data/fixtures.json
//
// If the schedule needs updating, edit the MATCHES array below and re-run.

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "..", "data", "fixtures.json");

// Each row: [group, home, away, "YYYY-MM-DD", "HH:MM" (local), utcOffsetHours]
const MATCHES = [
  // Group A — Mexico City / Zapopan / Atlanta / Monterrey
  ["A", "México", "Sudáfrica", "2026-06-11", "13:00", -6],
  ["A", "Corea del Sur", "República Checa", "2026-06-11", "20:00", -6],
  ["A", "República Checa", "Sudáfrica", "2026-06-18", "12:00", -4],
  ["A", "México", "Corea del Sur", "2026-06-18", "19:00", -6],
  ["A", "República Checa", "México", "2026-06-24", "19:00", -6],
  ["A", "Sudáfrica", "Corea del Sur", "2026-06-24", "19:00", -6],

  // Group B
  ["B", "Canadá", "Bosnia y Herzegovina", "2026-06-12", "15:00", -4],
  ["B", "Catar", "Suiza", "2026-06-13", "12:00", -7],
  ["B", "Suiza", "Bosnia y Herzegovina", "2026-06-18", "12:00", -7],
  ["B", "Canadá", "Catar", "2026-06-18", "15:00", -7],
  ["B", "Suiza", "Canadá", "2026-06-24", "12:00", -7],
  ["B", "Bosnia y Herzegovina", "Catar", "2026-06-24", "12:00", -7],

  // Group C
  ["C", "Brasil", "Marruecos", "2026-06-13", "18:00", -4],
  ["C", "Haití", "Escocia", "2026-06-13", "21:00", -4],
  ["C", "Escocia", "Marruecos", "2026-06-19", "18:00", -4],
  ["C", "Brasil", "Haití", "2026-06-19", "20:30", -4],
  ["C", "Escocia", "Brasil", "2026-06-24", "18:00", -4],
  ["C", "Marruecos", "Haití", "2026-06-24", "18:00", -4],

  // Group D
  ["D", "Estados Unidos", "Paraguay", "2026-06-12", "18:00", -7],
  ["D", "Australia", "Turquía", "2026-06-13", "21:00", -7],
  ["D", "Estados Unidos", "Australia", "2026-06-19", "12:00", -7],
  ["D", "Turquía", "Paraguay", "2026-06-19", "20:00", -7],
  ["D", "Turquía", "Estados Unidos", "2026-06-25", "19:00", -7],
  ["D", "Paraguay", "Australia", "2026-06-25", "19:00", -7],

  // Group E
  ["E", "Alemania", "Curazao", "2026-06-14", "12:00", -5],
  ["E", "Costa de Marfil", "Ecuador", "2026-06-14", "19:00", -4],
  ["E", "Alemania", "Costa de Marfil", "2026-06-20", "16:00", -4],
  ["E", "Ecuador", "Curazao", "2026-06-20", "19:00", -5],
  ["E", "Curazao", "Costa de Marfil", "2026-06-25", "16:00", -4],
  ["E", "Ecuador", "Alemania", "2026-06-25", "16:00", -4],

  // Group F
  ["F", "Países Bajos", "Japón", "2026-06-14", "15:00", -5],
  ["F", "Suecia", "Túnez", "2026-06-14", "20:00", -6],
  ["F", "Países Bajos", "Suecia", "2026-06-20", "12:00", -5],
  ["F", "Túnez", "Japón", "2026-06-20", "22:00", -6],
  ["F", "Japón", "Suecia", "2026-06-25", "18:00", -5],
  ["F", "Túnez", "Países Bajos", "2026-06-25", "18:00", -5],

  // Group G
  ["G", "Bélgica", "Egipto", "2026-06-15", "12:00", -7],
  ["G", "Irán", "Nueva Zelanda", "2026-06-15", "18:00", -7],
  ["G", "Bélgica", "Irán", "2026-06-21", "12:00", -7],
  ["G", "Nueva Zelanda", "Egipto", "2026-06-21", "18:00", -7],
  ["G", "Egipto", "Irán", "2026-06-26", "20:00", -7],
  ["G", "Nueva Zelanda", "Bélgica", "2026-06-26", "20:00", -7],

  // Group H
  ["H", "España", "Cabo Verde", "2026-06-15", "12:00", -4],
  ["H", "Arabia Saudita", "Uruguay", "2026-06-15", "18:00", -4],
  ["H", "España", "Arabia Saudita", "2026-06-21", "12:00", -4],
  ["H", "Uruguay", "Cabo Verde", "2026-06-21", "18:00", -4],
  ["H", "Cabo Verde", "Arabia Saudita", "2026-06-26", "19:00", -5],
  ["H", "Uruguay", "España", "2026-06-26", "18:00", -6],

  // Group I
  ["I", "Francia", "Senegal", "2026-06-16", "15:00", -4],
  ["I", "Irak", "Noruega", "2026-06-16", "18:00", -4],
  ["I", "Francia", "Irak", "2026-06-22", "17:00", -4],
  ["I", "Noruega", "Senegal", "2026-06-22", "20:00", -4],
  ["I", "Noruega", "Francia", "2026-06-26", "15:00", -4],
  ["I", "Senegal", "Irak", "2026-06-26", "15:00", -4],

  // Group J
  ["J", "Argentina", "Argelia", "2026-06-16", "20:00", -5],
  ["J", "Austria", "Jordania", "2026-06-16", "21:00", -7],
  ["J", "Argentina", "Austria", "2026-06-22", "12:00", -5],
  ["J", "Jordania", "Argelia", "2026-06-22", "20:00", -7],
  ["J", "Argelia", "Austria", "2026-06-27", "21:00", -5],
  ["J", "Jordania", "Argentina", "2026-06-27", "21:00", -5],

  // Group K
  ["K", "Portugal", "RD del Congo", "2026-06-17", "12:00", -5],
  ["K", "Uzbekistán", "Colombia", "2026-06-17", "20:00", -6],
  ["K", "Portugal", "Uzbekistán", "2026-06-23", "12:00", -5],
  ["K", "Colombia", "RD del Congo", "2026-06-23", "20:00", -6],
  ["K", "Colombia", "Portugal", "2026-06-27", "19:30", -4],
  ["K", "RD del Congo", "Uzbekistán", "2026-06-27", "19:30", -4],

  // Group L
  ["L", "Inglaterra", "Croacia", "2026-06-17", "15:00", -5],
  ["L", "Ghana", "Panamá", "2026-06-17", "19:00", -4],
  ["L", "Inglaterra", "Ghana", "2026-06-23", "16:00", -4],
  ["L", "Panamá", "Croacia", "2026-06-23", "19:00", -4],
  ["L", "Panamá", "Inglaterra", "2026-06-27", "17:00", -4],
  ["L", "Croacia", "Ghana", "2026-06-27", "17:00", -4],
];

function toUtcIso(date, time, offsetHours) {
  const sign = offsetHours >= 0 ? "+" : "-";
  const abs = Math.abs(offsetHours);
  const offset = `${sign}${String(abs).padStart(2, "0")}:00`;
  return new Date(`${date}T${time}:00${offset}`).toISOString();
}

const fixtures = MATCHES.map(([group, home, away, date, time, off]) => ({
  group,
  home_team: home,
  away_team: away,
  kickoff_at: toUtcIso(date, time, off),
}));

if (fixtures.length !== 72) {
  console.error(`Expected 72 matches, got ${fixtures.length}.`);
  process.exit(1);
}

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(fixtures, null, 2) + "\n");
console.log(`Wrote ${fixtures.length} matches to ${outPath}`);
