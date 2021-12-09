import getRanks from './ranks';
import positioning from './positioning';
import { Config, Edge, Node, Layout, Rank, Digl } from './types';
import { optimize } from './optimize';

// The entire heuristic for determining the auto layout of a graph
export function digl(config: Config): Digl {
  function positions(start: string, nodes: Node[], edges: Edge[]): Layout {
    const _ranks = optimize(getRanks(start, nodes, edges, config), edges);
    return positioning(config, nodes, _ranks);
  }

  function ranks(start: string, nodes: Node[], edges: Edge[]): Rank[] {
    return optimize(getRanks(start, nodes, edges, config), edges);
  }

  return { positions, ranks };
}
