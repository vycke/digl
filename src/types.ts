export type Edge = { source: string; target: string };
export type Node = { id: string };
export type Position = { x: number; y: number };
export type PositionedNode = { x: number; y: number } & Node;

export type Config = {
  width: number;
  height: number;
  orientation: 'horizontal' | 'vertical';
};

export type Layout = PositionedNode[];
export type Rank = string[];
export type Digl = {
  positions(start: string, nodes: Node[], edges: Edge[]): Layout;
  ranks(start: string, edges: Edge[]): Rank[];
};
