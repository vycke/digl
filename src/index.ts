import getRanks from './ranks';
import positioning from './positioning';
import { Config, Edge, Node, Layout, Rank, Digl } from './types';
import { optimize } from './optimize';

const addEmptySpots = (ranks: Rank[], edges: Edge[]): Rank[] => {
  ranks.forEach((rank, i) => {
    rank.forEach((node, y) => {
      const edgesOut = edges.filter((edge) => edge.source === node)
      edgesOut.forEach((edge) => {
        const rankOfTarget = ranks.findIndex((rank) =>
          rank.includes(edge.target)
        )
        if (rankOfTarget > i + 1) {
          for (let z = i + 1; z < rankOfTarget; z++) {
            ranks[z] = [...ranks[z].slice(0, y), null, ...ranks[z].slice(y)]
          }
        }
      })
    })
  })
  return ranks
}

// The entire heuristic for determining the auto layout of a graph
export function digl(config: Config): Digl {
  function positions(start: string, nodes: Node[], edges: Edge[]): Layout {
    const _ranks = optimize(getRanks(start, edges, config.depthLast), edges)
    const ranksWithEmptySpots = addEmptySpots(_ranks, edges)
    return positioning(config, nodes, ranksWithEmptySpots)
  }

  function ranks(start: string, edges: Edge[]): Rank[] {
    return optimize(getRanks(start, edges), edges);
  }

  return { positions, ranks };
}
