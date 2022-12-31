import { Config, Edge, Rank, Node, Graph, Path } from './types';
import { optimize } from './optimize';
import { getNodes, getStartingNodes } from './utils';

// Depth-First-Search (DFS) for an Directed Graph (cycles in paths are discarded)
function getPaths(
  nodeId: string,
  edges: Edge[],
  path: Path = [],
  paths: Path[] = []
): Path[] {
  const children = edges.filter((e) => e.source === nodeId);

  // first check avoids cyclic paths
  if (path.includes(nodeId)) paths.push(path);
  else if (!children || children.length === 0) paths.push([...path, nodeId]);
  else children.map((c) => getPaths(c.target, edges, [...path, nodeId], paths));

  return paths.sort();
}

// Ranks nodes in a rank, based on the longest path from the source
function getRanksByLongestPath(nodes: Node[], paths: string[][]): Rank[] {
  const ranks: Rank[] = new Array<Rank>(paths[0].length);

  nodes.forEach((n) => {
    const _paths = paths.filter((p) => p.includes(n.id));
    if (!_paths.length) return;

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
  const _initial = getRanksByLongestPath(_nodes, _paths);

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

// function mergeRanks(graph: Graph): Graph {
//   const _graph = [graph[0]];

//   // Determine if there is a union between two graphs
//   for (let i = 1; i < graph.length; i++) {
//     let _hasIntersect = false;
//     for (let j = 0; j < _graph.length; j++) {
//       if (intersect(graph[i], _graph[j]).length) {
//         _hasIntersect = true;
//       }
//       // TODO Add merging
//       else break;
//     }

//     if (!_hasIntersect) _graph.push(graph[i]);
//   }

//   return graph;
// }

// The entire heuristic for determining the auto layout of a graph
export function digl(edges: Edge[], config: Config): Graph {
  const _startingNodes = getStartingNodes(edges);
  const _graph = _startingNodes.map((node) =>
    getRankForNode(node, edges, config)
  );

  //  const _combinedRanks = mergeRanks(_initialGraph);

  return _graph.map((rank) => optimize(rank, edges));
}
