import { Config, Edge, Node, Rank } from './types';

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
// Ranks nodes in a rank, based on the longest path from the source
// The rank of a node is the earliest occurance it can have in the graph,
function getRanksByShortestPath(nodes: string[], edges: Edge[]) {
  return function (rank = 0, ranks: Rank[] = [], visited: V = {}): Rank[] {
    ranks[rank] = nodes;
    nodes.forEach((n) => (visited[n] = true));
    const ch = edges
      .filter((e) => !visited[e.target] && nodes.includes(e.source))
      .map((e) => e.target)
      .filter((e, i, self) => self.indexOf(e) == i); // only unique items

    if (ch.length) getRanksByShortestPath(ch, edges)(rank + 1, ranks, visited);

    return ranks;
  };
}

// Ranks nodes in a rank, based on the longest path from the source
function getRanksByLongestPath(nodes: Node[], paths: string[][]): Rank[] {
  const ranks: Rank[] = new Array<Rank>(paths[0].length);

  nodes.forEach((n) => {
    const _paths = paths.filter((p) => p.includes(n.id));

    let index = 0;
    _paths.forEach((p) => {
      const _index = p.findIndex((p) => p === n.id);
      if (_index > index) index = _index;
    });

    ranks[index] = [...(ranks[index] || []), n.id];
  });
  return ranks;
}

// Function to add empty spots for better laayouts
function addEmptySpots(ranks: Rank[], edges: Edge[]): Rank[] {
  ranks.forEach((rank, i) => {
    rank.forEach((node, y) => {
      const edgesOut = edges.filter((edge) => edge.source === node);
      edgesOut.forEach((edge) => {
        const rankOfTarget = ranks.findIndex((rank) =>
          rank.includes(edge.target)
        );
        if (rankOfTarget > i + 1) {
          for (let z = i + 1; z < rankOfTarget; z++) {
            ranks[z] = [...ranks[z].slice(0, y), null, ...ranks[z].slice(y)];
          }
        }
      });
    });
  });
  return ranks;
}

// Order a ranking based on a sorted list of paths (determined using DFS)
// Nodes in the longer paths are placed earlier in their ranks
export default function initial(
  nodeId: string,
  nodes: Node[],
  edges: Edge[],
  config: Config
): Rank[] {
  const visited: V = {};
  const _paths = getPaths(nodeId, edges);

  const ranks: Rank[] = [];

  let _initial = config.shortestPath
    ? getRanksByShortestPath([nodeId], edges)()
    : getRanksByLongestPath(nodes, _paths);

  // Find out if there are any nodes marked as "solitary"
  // https://github.com/kevtiq/digl/issues/8
  // These nodes are to be scheduled in a rank of their own
  const solitaries: string[] = nodes
    .filter((node) => node.solitary)
    .map((node) => node.id);
  if (solitaries.length > 0) {
    // There are a nonzero amount of solitaries, so rebuild the rank list based on this information
    const _inital_for_solitaries: Rank[] = [];
    _initial.forEach((rank: Rank) => {
      // Find any solitaries in the current rank
      const solitariesInRow: string[] = rank
        .filter((node) => node && solitaries.indexOf(node) >= 0)
        .map((node) => node as string);
      if (solitariesInRow) {
        // If there are any solitaries, add them one by one to the new rank list
        solitariesInRow.forEach((node) => _inital_for_solitaries.push([node]));
        // Add the remaining non-solitary nodes, if there anre any
        const rankRest = rank.filter(
          (node) => !node || solitaries.indexOf(node) < 0
        );
        if (rankRest.length > 0) {
          _inital_for_solitaries.push(rankRest);
        }
      } else {
        // There are no solitaries in the rank, so add the rank without changes
        _inital_for_solitaries.push(rank);
      }
    });
    _initial = _inital_for_solitaries;
  }

  _paths.forEach((p) => {
    _initial.forEach((rank: Rank, index: number) => {
      const nodes = p.filter((n) => rank.includes(n) && !visited[n]);
      if (nodes && nodes.length > 0) {
        nodes.forEach((n) => (visited[n] = true));
        ranks[index] = [...(ranks[index] || []), ...nodes];
      }
    });
  });

  if (config.addEmptySpots) return addEmptySpots(ranks, edges);
  return ranks;
}
