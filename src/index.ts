import initial from './initial';
import positioning from './positioning';
import { Config, Edge, Node, Layout } from './types';

// The entire heuristic for determining the auto layout of a graph
export function layout(config: Config) {
  return function (nodes: Node[], edges: Edge[]): Layout {
    return positioning(config, nodes, initial(config.start, edges));
  };
}
