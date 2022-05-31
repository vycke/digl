import ranks from './ranks';
import { score as _score } from './score';
import { Config, Edge, Node, Digl } from './types';
import { optimize } from './optimize';

// The entire heuristic for determining the auto layout of a graph
export function digl(config: Config): Digl {
  function get(start: string, nodes: Node[], edges: Edge[]) {
    return optimize(ranks(start, nodes, edges, config), edges);
  }

  function score(start: string, nodes: Node[], edges: Edge[]) {
    const _ranks = get(start, nodes, edges);
    return _score(_ranks, edges);
  }

  return { get, score };
}
