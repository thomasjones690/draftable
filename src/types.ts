export interface Player {
  id: number;
  name: string;
  ppg: number;
  rpg: number;
  apg: number;
  fg: number;
  fi: number;
  probability: number;
  rank: number;
  drafted: boolean;
  draftedBy: string;
  draftedAt?: number;
  draftId?: number;
  teamId?: number;
}

export interface NewPlayer {
  name: string;
  ppg: string;
  rpg: string;
  apg: string;
  fg: string;
  fi: string;
}

export interface ChartData {
  name: string;
  score: number;
  probability: number;
}

export interface Team {
  id: number;
  name: string;
  captain: string;
  players: Player[];
  draftId?: number;
}

export interface Draft {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  teams?: Team[];
  players?: Player[];
} 