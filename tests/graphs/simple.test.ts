import { Edge } from '../../src/types';
import { digl } from '../../src/';
import { score } from '../../src/score';

const edges: Edge[] = [
  { source: '1', target: '2' },
  { source: '2', target: '3' },
  { source: '2', target: '4' },
  { source: '3', target: '4' },
  { source: '4', target: '5' },
  { source: '5', target: '6' },
  { source: '4', target: '8' },
  { source: '8', target: '5' },
  { source: '3', target: '5' },
  { source: '3', target: '7' },
  { source: '7', target: '9' },
  { source: '9', target: '6' },
  { source: '7', target: '6' },
  { source: '9', target: '10' },
  { source: '10', target: '6' },
];

test('Simple graph - empty edges', () => {
  const result = digl([]);
  expect(result).toEqual([]);
});

test('Simple graph', () => {
  const result = digl(edges)[0];
  expect(result).toEqual([
    ['1'],
    ['2'],
    ['3'],
    ['4', '7'],
    ['8', '9'],
    ['5', '10'],
    ['6'],
  ]);

  expect(score(result, edges)).toBe(0);
});

test('Simple graph - solitary nodes', () => {
  const result = digl(edges, { solitary: ['8'] })[0];

  expect(result).toEqual([
    ['1'],
    ['2'],
    ['3'],
    ['4', '7'],
    ['8'],
    ['9'],
    ['5', '10'],
    ['6'],
  ]);

  expect(score(result, edges)).toBe(0);
});
