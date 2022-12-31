import { Edge } from '../../src/types';
import { digl } from '../../src/';
import { score } from '../../src/score';

const edges: Edge[] = [
  { source: '1', target: '2' },
  { source: '2', target: '3' },
  { source: '2', target: '4' },
  { source: '1', target: '4' },
  { source: '4', target: '1' },
];

test('Cyclic graph', () => {
  const result = digl(edges, { shortestPath: true })[0];
  expect(result).toEqual([['1'], ['2', '4'], ['3']]);
  expect(score(result, edges)).toBe(0);
});
