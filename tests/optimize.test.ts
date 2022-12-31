import { optimize } from '../src/optimize';
import { score } from '../src/score';
import { Edge, Rank } from '../src/types';

const ranks: Rank[] = [
  ['1.1', '1.2', '1.3'],
  ['2.1', '2.2', '2.3'],
];

test('Optimize - no edges', () => {
  const result = optimize(ranks, []);
  expect(result).toEqual([
    ['1.1', '1.2', '1.3'],
    ['2.1', '2.2', '2.3'],
  ]);
  expect(score(result, []) === score(ranks, [])).toBe(true);
});

test('Optimize - resolve crossing edges in a rank', () => {
  const edges: Edge[] = [
    { source: '1.1', target: '1.3' },
    { source: '1.1', target: '1.2' },
  ];

  const result = optimize(ranks, edges);
  expect(result).toEqual([
    ['1.2', '1.1', '1.3'],
    ['2.2', '2.3', '2.1'],
  ]);
  expect(score(result, edges) <= score(ranks, edges)).toBe(true);
});

test('Score - crossing edge r1 -> r2', () => {
  const edges: Edge[] = [
    { source: '1.1', target: '2.3' },
    { source: '1.2', target: '2.2' },
  ];
  const result = optimize(ranks, edges);
  expect(result).toEqual([
    ['1.2', '1.3', '1.1'],
    ['2.2', '2.3', '2.1'],
  ]);
  expect(score(result, edges) <= score(ranks, edges)).toBe(true);
});

test('Score - crossing edge r2 -> r1', () => {
  const edges: Edge[] = [
    { source: '2.1', target: '1.3' },
    { source: '2.2', target: '1.2' },
  ];
  const result = optimize(ranks, edges);
  expect(result).toEqual([
    ['1.2', '1.3', '1.1'],
    ['2.2', '2.3', '2.1'],
  ]);
  expect(score(result, edges) <= score(ranks, edges)).toBe(true);
});

test('Score - crossing edge r1 -> r2 & r2 -> r1', () => {
  const edges: Edge[] = [
    { source: '1.1', target: '2.1' },
    { source: '2.2', target: '1.2' },
    { source: '1.1', target: '2.3' },
    { source: '2.3', target: '1.3' },
  ];
  const result = optimize(ranks, edges);
  expect(result).toEqual([
    ['1.2', '1.1', '1.3'],
    ['2.2', '2.1', '2.3'],
  ]);
  expect(score(result, edges) <= score(ranks, edges)).toBe(true);
});

test('Optimize - adding empty spots', () => {
  const edges: Edge[] = [
    { source: '1.1', target: '2.3' },
    { source: '1.2', target: '2.2' },
    { source: '1.2', target: '3.1' },
  ];
  const ranks: Rank[] = [['1.1', '1.2', '1.3'], ['2.1', '2.2', '2.3'], ['3.1']];
  const result = optimize(ranks, edges);

  expect(result).toEqual([
    ['1.2', '1.3', '1.1'],
    [null, '2.2', '2.3', '2.1'],
    ['3.1'],
  ]);
});

test('Optimize - unoptimized same score', () => {
  const edges: Edge[] = [
    { source: '1.1', target: '2.1' },
    { source: '1.1', target: '2.2' },
    { source: '1.2', target: '2.1' },
    { source: '1.2', target: '2.2' },
  ];
  const ranks: Rank[] = [
    ['1.1', '1.2'],
    ['2.1', '2.2'],
  ];
  const result = optimize(ranks, edges);
  expect(result).toEqual([
    ['1.1', '1.2'],
    ['2.1', '2.2'],
  ]);

  expect(score(result, edges) <= score(ranks, edges)).toBe(true);
});

test('Optimize - multiple iterations', () => {
  const edges: Edge[] = [
    { source: '1.1', target: '2.2' },
    { source: '1.2', target: '2.1' },
    { source: '2.1', target: '3.1' },
    { source: '2.2', target: '3.2' },
    { source: '3.1', target: '4.2' },
    { source: '3.2', target: '4.1' },
  ];
  const ranks: Rank[] = [
    ['1.1', '1.2'],
    ['2.1', '2.2'],
    ['3.1', '3.2'],
    ['4.1', '4.2'],
  ];

  const result = optimize(ranks, edges);
  expect(result).toEqual([
    ['1.1', '1.2'],
    ['2.2', '2.1'],
    ['3.2', '3.1'],
    ['4.1', '4.2'],
  ]);

  expect(score(result, edges) <= score(ranks, edges)).toBe(true);
});
