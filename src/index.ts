import { Config, Edge, Rank, Node, Graph, Path } from './types';
import { optimize } from './optimize';

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

// Funtction to get all nodes based on the edges
function getNodes(edges: Edge[]): Node[] {
  const nodes: Node[] = [];
  edges.forEach(({ source, target }) => {
    if (!nodes.find((n) => n.id === source)) nodes.push({ id: source });
    if (!nodes.find((n) => n.id === target)) nodes.push({ id: target });
  });
  return nodes;
}

// Function to get all starting nodes
function getStartingNodes(edges: Edge[]): string[] {
  const _nodes = getNodes(edges);
  if (!_nodes.length) return [];
  const _startingNodes = _nodes
    .filter((n) => !edges.find((e) => e.target === n.id))
    .map((n) => n.id);

  if (_startingNodes.length) return _startingNodes;
  return [_nodes[0].id];
}

// Union of two arrays
function intersect(a: unknown[], b: unknown[]): unknown[] {
  const setA = new Set([...a.flat()]);
  const setB = new Set([...b.flat()]);
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  return Array.from(intersection);
}

// Ranks nodes in a rank, based on the longest path from the source
function getRanking(nodes: Node[], paths: string[][]): Rank[] {
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
function applySolitaryConfig(ranks: Rank[], config: Config) {
  // Find out if there are any nodes marked as "solitary"
  // https://github.com/kevtiq/digl/issues/8
  // These nodes are to be scheduled in a rank of their own
  // if (!config.solitary) return ranks;
  const _ranks: Rank[] = [];
  ranks.forEach((rank) => {
    const solitaries = rank.filter((n) =>
      config.solitary.includes(n as string)
    );
    if (!solitaries.length) _ranks.push(rank);
    else {
      _ranks.push(solitaries);
      _ranks.push(rank.filter((n) => !solitaries.includes(n)));
    }
  });

  return _ranks;
}

// Recursive function to find overlap in graphs and merge ranks whenever
// overlap exists
function merge(graph: Graph, paths: Path[][], nodes: Node[]): Graph {
  const _paths: Path[][] = [];
  const _graph: Graph = [];
  const _merged: number[] = [];

  for (let i = 0; i < graph.length; i++) {
    // If i was already merged in a previous iteration, skip it
    if (_merged.includes(i)) continue;
    const _mergedpaths = [...paths[i]];
    for (let j = i + 1; j < graph.length; j++) {
      // If overlap is found, add it to the graph
      if (intersect(graph[i], graph[j]).length) {
        _mergedpaths.push(...paths[j]);
        _merged.push(j);
      }
    }

    _graph.push(getRanking(nodes, _mergedpaths.sort()));
    _paths.push(_mergedpaths);
  }

  if (_graph.length === graph.length) return _graph;
  return merge(_graph, _paths, nodes);
}

// The entire heuristic for determining the auto layout of a graph
export function digl(edges: Edge[], config: Config = { solitary: [] }): Graph {
  const _startingNodes = getStartingNodes(edges);
  const _nodes = getNodes(edges);
  // Get an array of possible paths per starting nodes
  const _paths = _startingNodes.map((node) => getPaths(node, edges));
  // Get the unoptimized ranking per starting node
  const _initial = _startingNodes.map((_, index) =>
    getRanking(_nodes, _paths[index])
  );

  // Whenever two rankings have overlapping nodes, ensure that they are merged
  // and one single graph is created.
  const _graph = merge(_initial, _paths, _nodes);

  // Apply solitary nodes & optimize
  return _graph.map((ranks) => {
    const _ranks = config.solitary ? applySolitaryConfig(ranks, config) : ranks;
    return optimize(_ranks, edges);
  });
}
