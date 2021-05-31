/* eslint-disable @typescript-eslint/ban-types */
import initial from '../src/initial';
import { Edge } from '../src/types';

const startId = '1';
const acyclicEdges: Edge[] = [
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

const cyclicEdges: Edge[] = [
  { source: '1', target: '2' },
  { source: '2', target: '3' },
  { source: '2', target: '4' },
  { source: '1', target: '4' },
  { source: '4', target: '1' },
];

test('Initial ranking - empty edges', () => {
  const ranking = initial(startId, []);
  expect(ranking).toEqual([[startId]]);
});

test('Initial ranking - acyclic graph', () => {
  const ranking = initial(startId, acyclicEdges);
  expect(ranking).toEqual([
    ['1'],
    ['2'],
    ['3', '4'],
    ['5', '8', '7'],
    ['6', '9'],
    ['10'],
  ]);
});

test('Initial ranking - cyclic graph', () => {
  const ranking = initial(startId, cyclicEdges);
  expect(ranking).toEqual([['1'], ['2', '4'], ['3']]);
});
