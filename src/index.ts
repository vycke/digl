import { Config, Edge, Rank, Node, Graph } from './types';
import { optimize } from './optimize';
import { getNodes, getPaths, getStartingNodes, union } from './utils';

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

// Aggregated function to determine the starting ranks for each node
function getRankForNode(nodeId: string, edges: Edge[], config: Config) {
  const _paths = getPaths(nodeId, edges);
  const _nodes = getNodes(edges);
  const _initial = config.shortestPath
    ? getRanksByShortestPath([nodeId], edges)()
    : getRanksByLongestPath(_nodes, _paths);

  // Find out if there are any nodes marked as "solitary"
  // https://github.com/kevtiq/digl/issues/8
  // These nodes are to be scheduled in a rank of their own
  const _ranks: Rank[] = [];
  _initial.forEach((rank) => {
    const solitaries = rank.filter((n) =>
      config?.solitary?.includes(n as string)
    );
    if (!solitaries?.length) _ranks.push(rank);
    else {
      _ranks.push(solitaries);
      _ranks.push(rank.filter((n) => !solitaries.includes(n)));
    }
  });

  return _ranks;
}

function mergeRanks(graph: Graph): Graph {
  const _graph = [graph[0]];

  // Determine if there is a union between two graphs
  for (let i = 1; i < graph.length; i++) {
    let _hasUnion = false;
    for (let j = 0; j < _graph.length; j++) {
      if (union(graph[i], _graph[j]).length) _hasUnion = true;
      // TODO Add merging
      else break;
    }

    if (!_hasUnion) _graph.push(graph[i]);
  }

  return graph;
}

// The entire heuristic for determining the auto layout of a graph
export function digl(edges: Edge[], config: Config): Graph {
  const _startingNodes = getStartingNodes(edges);
  const _initialGraph = _startingNodes.map((node) =>
    getRankForNode(node, edges, config)
  );
  const _combinedRanks = mergeRanks(_initialGraph);

  return _combinedRanks.map((rank) => optimize(rank, edges));
}
