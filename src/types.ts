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
