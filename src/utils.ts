import { Edge, Node } from './types';

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
  const _nodes = getNodes(edges);
  if (!_nodes.length) return [];
  const _startingNodes = _nodes
    .filter((n) => !edges.find((e) => e.target === n.id))
    .map((n) => n.id);

  if (_startingNodes.length) return _startingNodes;
  return [_nodes[0].id];
}

// Union of two arrays
export function intersect(a: unknown[], b: unknown[]): unknown[] {
  const setA = new Set([...a.flat()]);
  const setB = new Set([...b.flat()]);
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  return Array.from(intersection);
}
