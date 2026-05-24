import type { Match, Prediction } from "./types";

export const POINTS_EXACT = 4;
export const POINTS_OUTCOME = 1;

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
  if (match.status !== "finished" || match.home_score === null || match.away_score === null) {
    return 0;
  }
  if (
    prediction.home_score === match.home_score &&
    prediction.away_score === match.away_score
  ) {
    return POINTS_EXACT;
  }
  if (outcome(prediction.home_score, prediction.away_score) === outcome(match.home_score, match.away_score)) {
    return POINTS_OUTCOME;
  }
  return 0;
}

export function isExact(
  prediction: Pick<Prediction, "home_score" | "away_score"> | null | undefined,
  match: Pick<Match, "home_score" | "away_score" | "status">
): boolean {
  if (!prediction) return false;
  if (match.status !== "finished" || match.home_score === null || match.away_score === null) {
    return false;
  }
  return prediction.home_score === match.home_score && prediction.away_score === match.away_score;
}
