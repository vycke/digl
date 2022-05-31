export type Edge = { source: string; target: string };
export type Node = { id: string; solitary?: boolean };
export type Position = { x: number; y: number };

export type Config = {
  shortestPath: boolean;
  addEmptySpots: boolean;
  solitary?: string[];
};

export type Rank = (string | null)[];
export type Digl = {
  get(start: string, edges: Edge[]): Rank[];
  score(start: string, edges: Edge[]): number;
};
