export type Edge = { source: string; target: string };
export type Node = { id: string; solitary?: boolean };
export type Position = { x: number; y: number };
export type Path = string[];

export type Config = {
  solitary: string[];
};

export type Rank = (string | null)[];
export type Graph = Rank[][];
