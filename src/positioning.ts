import { Config, Layout, Node, PositionedNode, Rank } from './types';

// Positioning function based on configuration of (avg.) node width and height.
// By default takes 3 times the size as space between.
export default function positioning(
  config: Config,
  nodes: Node[],
  ranks: Rank[]
): Layout {
  const _nodes: PositionedNode[] = [];
  const _h = config.orientation === 'horizontal';

  ranks.forEach((r, i) => {
    const xStart = _h
      ? 2 * config.width * i
      : -0.5 * (r.length - 1) * 2 * config.width;
    const yStart = _h
      ? -0.5 * (r.length - 1) * 2 * config.height
      : 2 * config.height * i;

    r.forEach((nodeId, nIndex) => {
      const _node: Node = nodes.find((n) => n.id == nodeId) as Node;
      if (!_node) return;
      const x = _h ? xStart : xStart + 2 * config.width * nIndex;
      const y = _h ? yStart + 2 * config.height * nIndex : yStart;
      _nodes.push({ ..._node, x, y });
    });
  });

  return _nodes;
}
