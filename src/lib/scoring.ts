import type { Match, Prediction } from "./types";

// Outcome points (only when the predicted outcome matches the actual outcome).
export const POINTS_WIN = 1;
export const POINTS_TIE = 2;
// Bonus added on top of the outcome points when the exact score matches.
export const POINTS_EXACT_BONUS = 4;

function outcome(home: number, away: number): "H" | "A" | "D" {
  if (home > away) return "H";
  if (home < away) return "A";
  return "D";
}

export function pointsFor(
  prediction: Pick<Prediction, "home_score" | "away_score"> | null | undefined,
  match: Pick<Match, "home_score" | "away_score" | "status">
): number {
  if (!prediction) return 0;
  if (
    match.status !== "finished" ||
    match.home_score === null ||
    match.away_score === null
  ) {
    return 0;
  }

  const matchOutcome = outcome(match.home_score, match.away_score);
  const predOutcome = outcome(prediction.home_score, prediction.away_score);

  let points = 0;
  if (matchOutcome === predOutcome) {
    points += matchOutcome === "D" ? POINTS_TIE : POINTS_WIN;
  }
  if (
    prediction.home_score === match.home_score &&
    prediction.away_score === match.away_score
  ) {
    points += POINTS_EXACT_BONUS;
  }
  return points;
}

export function isExact(
  prediction: Pick<Prediction, "home_score" | "away_score"> | null | undefined,
  match: Pick<Match, "home_score" | "away_score" | "status">
): boolean {
  if (!prediction) return false;
  if (
    match.status !== "finished" ||
    match.home_score === null ||
    match.away_score === null
  ) {
    return false;
  }
  return (
    prediction.home_score === match.home_score &&
    prediction.away_score === match.away_score
  );
}
