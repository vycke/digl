import ranks from './ranks';
import { score as _score } from './score';
import { Config, Edge, Digl } from './types';
import { optimize } from './optimize';

// The entire heuristic for determining the auto layout of a graph
export function digl(config: Config): Digl {
  function get(start: string, edges: Edge[]) {
    return optimize(ranks(start, edges, config), edges);
  }

  function score(start: string, edges: Edge[]) {
    const _ranks = get(start, edges);
    return _score(_ranks, edges);
  }

  return { get, score };
}
