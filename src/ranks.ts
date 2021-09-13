import { Edge, Rank } from './types';

type V = { [key: string]: boolean };

// Depth-First-Search (DFS) for an Directed Graph (cycles in paths are discarded)
function getPaths(
  nodeId: string,
  edges: Edge[],
  path: string[] = [],
  paths: string[][] = []
) {
  const children = edges.filter((e) => e.source === nodeId);

  // first check avoids cyclic paths
  if (path.includes(nodeId)) paths.push(path);
  else if (!children || children.length === 0) paths.push([...path, nodeId]);
  else children.map((c) => getPaths(c.target, edges, [...path, nodeId], paths));

  return paths.sort();
}

// A breadth-first-search algorithm to determine the ranking of the graph.
// The rank of a node is the earliest occurance it can have in the graph,
// with the root node(s) at rank 0.
function getInitialRanks(nodes: string[], edges: Edge[]) {
  return function (rank = 0, ranks: Rank[] = [], visited: V = {}): Rank[] {
    ranks[rank] = nodes;
    nodes.forEach((n) => (visited[n] = true));
    const ch = edges
      .filter((e) => !visited[e.target] && nodes.includes(e.source))
      .map((e) => e.target)
      .filter((e, i, self) => self.indexOf(e) == i); // only unique items

    if (ch.length) getInitialRanks(ch, edges)(rank + 1, ranks, visited);

    return ranks;
  };
}

function getInitialRanksWithDupes(nodes: string[], edges: Edge[]) {
  return function (rank = 0, ranks: Rank[] = [], visited: V = {}): Rank[] {
    ranks[rank] = nodes
    nodes.forEach((n) => (visited[n] = true))
    const ch = edges
      .filter((e) => nodes.includes(e.source))
      .map((e) => e.target)
      .filter((e, i, self) => self.indexOf(e) == i) // only unique items
    if (ch.length) getInitialRanksWithDupes(ch, edges)(rank + 1, ranks, visited)

    return ranks
  }
}

// Order a ranking based on a sorted list of paths (determined using DFS)
// Nodes in the longer paths are placed earlier in their ranks
export default function initial(
  nodeId: string,
  edges: Edge[],
  depthLast = true
): Rank[] {
  const visited: V = {};
  const _paths = getPaths(nodeId, edges);

  const ranks: Rank[] = [];
  const _initial = getInitialRanks([nodeId], edges)();
  const _initialWithDupes = getInitialRanksWithDupes([nodeId], edges)()
  const _initialDepthLast = ((_initial: Rank[]) => {
    const visited: V = {}
    const reversedInitial = _initialWithDupes.reverse()
    const uniqueLastReversedInitial = reversedInitial.map((rank: Rank, i) => {
      const filteredRank = rank.filter((n) => !visited[n])
      rank.forEach((n) => (visited[n] = true))
      return filteredRank
    })
    return uniqueLastReversedInitial.reverse()
  })(_initialWithDupes)
  const chosenInitial = depthLast ? _initialDepthLast : _initial

  _paths.forEach((p) => {
    chosenInitial.forEach((rank: string[], index: number) => {
      const nodes = p.filter((n) => rank.includes(n) && !visited[n]);
      if (nodes && nodes.length > 0) {
        nodes.forEach((n) => (visited[n] = true));
        ranks[index] = [...(ranks[index] || []), ...nodes];
      }
    });
  });

  return ranks;
}
