import { Edge, Node } from './types';

// Depth-First-Search (DFS) for an Directed Graph (cycles in paths are discarded)
export function getPaths(
  nodeId: string,
  edges: Edge[],
  path: string[] = [],
  paths: string[][] = []
): string[][] {
  const children = edges.filter((e) => e.source === nodeId);

  // first check avoids cyclic paths
  if (path.includes(nodeId)) paths.push(path);
  else if (!children || children.length === 0) paths.push([...path, nodeId]);
  else children.map((c) => getPaths(c.target, edges, [...path, nodeId], paths));

  return paths.sort();
}

// Funtction to get all nodes based on the edges
export function getNodes(edges: Edge[]): Node[] {
  const nodes: Node[] = [];
  edges.forEach(({ source, target }) => {
    if (!nodes.find((n) => n.id === source)) nodes.push({ id: source });
    if (!nodes.find((n) => n.id === target)) nodes.push({ id: target });
  });
  return nodes;
}

// Function to get all starting nodes
export function getStartingNodes(edges: Edge[]): string[] {
  return getNodes(edges)
    .filter((n) => !edges.find((e) => e.target === n.id))
    .map((n) => n.id);
}
