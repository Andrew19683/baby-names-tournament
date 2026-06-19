export type Descriptions = Record<string, string>;
type Gender = "boy" | "girl";
type Grid = "upper" | "lower" | "grandFinal";
type MatchStatus = "pending" | "currentMatch" | "readyToPlay" | "finished";

export interface ImportResult {
  names: Name[];
  matches?: Matches;
  lastPlayedDate?: string;
  todayCount?: string;
  descriptions?: Descriptions;
}

export interface Match {
  id: number;
  grid: Grid;
  gender: Gender;
  player1: Name | null;
  player2: Name | null;
  status: MatchStatus;
  winnerGoesId?: number;
  loserGoesId?: number;
  winner?: Name;
  loser?: Name;
  isGridFinal?: boolean;
}

export interface Matches {
  boys: Match[];
  girls: Match[];
}

export interface Name {
  name: string;
  gender: Gender;
  id: number;
  isBye?: boolean;
}
