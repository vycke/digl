import { Edge } from './types';

// Depth-First-Search (DFS) for an Directed Graph (cycles in paths are discarded)
export function getPaths(
  nodeId: string,
  edges: Edge[],
  path: string[] = [],
  paths: string[][] = []
): string[][] {
  const children = edges.filter((e) => e.source === nodeId);

  // first check avoids cyclic paths
  if (path.includes(nodeId) || !children || children.length === 0)
    paths.push([...path, nodeId]);
  else children.map((c) => getPaths(c.target, edges, [...path, nodeId], paths));

  return paths.sort();
}
