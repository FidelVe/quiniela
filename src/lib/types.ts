export type MatchStatus = "scheduled" | "finished";

export interface Participant {
  id: number;
  name: string;
}

export interface Match {
  id: number;
  group: string;
  home_team: string;
  away_team: string;
  kickoff_at: string;
  home_score: number | null;
  away_score: number | null;
  status: MatchStatus;
}

export interface Prediction {
  id: number;
  participant_id: number;
  match_id: number;
  home_score: number;
  away_score: number;
}

export interface LeaderboardRow {
  participant_id: number;
  name: string;
  points: number;
  exact_count: number;
}
