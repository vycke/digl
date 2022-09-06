import { Config, Edge, Node, Rank } from './types';
import { getNodes, getPaths } from './utils';

type V = { [key: string]: boolean };

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
export function initRank(
  nodeId: string,
  edges: Edge[],
  config: Config
): Rank[] {
  const visited: V = {};
  const _paths = getPaths(nodeId, edges);

  const ranks: Rank[] = [];
  const nodes = getNodes(edges);

  const _inbetween = config.shortestPath
    ? getRanksByShortestPath([nodeId], edges)()
    : getRanksByLongestPath(nodes, _paths);

  // Find out if there are any nodes marked as "solitary"
  // https://github.com/kevtiq/digl/issues/8
  // These nodes are to be scheduled in a rank of their own
  const _initial: Rank[] = [];
  _inbetween.forEach((rank) => {
    const solitaries = rank.filter((n) =>
      config?.solitary?.includes(n as string)
    );
    if (!solitaries?.length) _initial.push(rank);
    else {
      _initial.push(solitaries);
      _initial.push(rank.filter((n) => !solitaries.includes(n)));
    }
  });

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
