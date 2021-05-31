import { Config, Layout, Node, PositionedNode, Ranking } from './types';

// Positioning function based on configuration of (avg.) node width and height.
// By default takes 3 times the size as space between.
export default function positioning(
  config: Config,
  nodes: Node[],
  ranking: Ranking
): Layout {
  const _nodes: PositionedNode[] = [];
  const _h = config.orientation === 'horizontal';

  ranking.forEach((r, i) => {
    const xStart = _h
      ? 3 * config.width * i
      : -0.5 * (r.length - 1) * 3 * config.width;
    const yStart = _h
      ? -0.5 * (r.length - 1) * 3 * config.height
      : 3 * config.height * i;

    r.forEach((nodeId, nIndex) => {
      const _node: Node = nodes.find((n) => n.id == nodeId) as Node;

      const x = _h ? xStart : xStart + 3 * config.width * nIndex;
      const y = _h ? yStart + 3 * config.height * nIndex : yStart;
      _nodes.push({ ..._node, x, y });
    });
  });

  return _nodes;
}
