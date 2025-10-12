
export type GameType = 'colorWord' | 'numberHunt' | 'memoryMatch';

export type Scores = {
  colorWord: number; // Higher is better
  numberHunt: number | null; // Lower is better (ms), null if not played
  memoryMatch: number | null; // Lower is better (ms), null if not played
};

export type ColorInfo = {
  name: string;
  class: string;
};
