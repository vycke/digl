import { score } from '../src/score';
import { Edge, Rank } from '../src/types';

const ranks: Rank[] = [
  ['1.1', '1.2', '1.3'],
  ['2.1', '2.2', '2.3'],
];

test('Score - no suitable edges', () => {
  expect(score(ranks, [])).toBe(0);
});

test('Score - crossing edges in a rank', () => {
  const edges: Edge[] = [
    { source: '1.1', target: '1.3' },
    { source: '1.1', target: '1.2' },
  ];
  expect(score(ranks, edges)).toBe(1);
});

test('Score - crossing edge r1 -> r2', () => {
  const edges: Edge[] = [
    { source: '1.1', target: '2.3' },
    { source: '1.2', target: '2.2' },
  ];
  expect(score(ranks, edges)).toBe(1);
});

test('Score - crossing edge r2 -> r1', () => {
  const edges: Edge[] = [
    { source: '2.1', target: '1.3' },
    { source: '2.2', target: '1.2' },
  ];
  expect(score(ranks, edges)).toBe(1);
});

test('Score - crossing edge r1 -> r2 & r2 -> r1', () => {
  const edges: Edge[] = [
    { source: '1.1', target: '2.1' },
    { source: '2.2', target: '1.2' },
    { source: '1.1', target: '2.3' },
    { source: '2.3', target: '1.3' },
  ];
  expect(score(ranks, edges)).toBe(1);
});
