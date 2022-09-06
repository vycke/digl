import { score as _score } from './score';
import { Config, Edge, Digl } from './types';
import { optimize } from './optimize';
import { getStartingNodes } from './utils';
import { initRank } from './ranks';

// The entire heuristic for determining the auto layout of a graph
export function digl(config: Config): Digl {
  function get(edges: Edge[]) {
    const _starts = getStartingNodes(edges);
    return _starts.map((s) => optimize(initRank(s, edges, config), edges));
  }

  function score(edges: Edge[]) {
    const _ranks = get(edges);
    return _ranks.map((r) => _score(r, edges));
  }

  return { get, score };
}
