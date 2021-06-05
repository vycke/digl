import ranks from './ranks';
import positioning from './positioning';
import { Config, Edge, Node, Layout } from './types';
import { optimize } from './optimize';

// The entire heuristic for determining the auto layout of a graph
export function layout(config: Config) {
  return function (start: string, nodes: Node[], edges: Edge[]): Layout {
    const _ranks = optimize(ranks(start, edges), edges);
    return positioning(config, nodes, _ranks);
  };
}
