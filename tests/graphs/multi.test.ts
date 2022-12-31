import { Edge } from '../../src/types';
import { digl } from '../../src/';
import { score } from '../../src/score';

test('Multiple graphs - independent', () => {
  const edges: Edge[] = [
    { source: '1', target: '2' },
    { source: '2', target: '3' },
    { source: '2', target: '4' },
    { source: '5', target: '6' },
    { source: '6', target: '7' },
    { source: '6', target: '8' },
  ];
  const result = digl(edges, {});

  expect(result).toEqual([
    [['1'], ['2'], ['3', '4']],
    [['5'], ['6'], ['7', '8']],
  ]);

  expect(score(result[0], edges)).toBe(0);
  expect(score(result[1], edges)).toBe(0);
});
