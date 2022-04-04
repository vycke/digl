export type Edge = { source: string; target: string };
export type Node = { id: string; solitary?: boolean };
export type Position = { x: number; y: number };
export type PositionedNode = { x: number; y: number } & Node;

export type Config = {
  width: number;
  height: number;
  orientation: 'horizontal' | 'vertical';
  shortestPath: boolean;
  addEmptySpots: boolean;
};

export type Layout = PositionedNode[];
export type Rank = (string | null)[];
export type Digl = {
  positions(start: string, nodes: Node[], edges: Edge[]): Layout;
  ranks(start: string, nodes: Node[], edges: Edge[]): Rank[];
};
