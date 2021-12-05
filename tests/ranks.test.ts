/* eslint-disable @typescript-eslint/ban-types */
import initial from '../src/ranks';
import { Edge, Node } from '../src/types';

const startId = '1';
const nodes: Node[] = [
  { id: '1' },
  { id: '2' },
  { id: '3' },
  { id: '4' },
  { id: '5' },
  { id: '6' },
  { id: '7' },
  { id: '8' },
  { id: '9' },
  { id: '10' },
];
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
  const ranking = initial(startId, nodes, []);
  expect(ranking).toEqual([[startId]]);
});

test('Initial ranking - acyclic graph', () => {
  const ranking = initial(startId, nodes, acyclicEdges);
  expect(ranking).toEqual([
    ['1'],
    ['2'],
    ['3'],
    ['4', '7'],
    ['8', '9'],
    ['5', '10'],
    ['6'],
  ]);
});

test('Initial ranking - cyclic graph', () => {
  const ranking = initial(startId, nodes, cyclicEdges);
  expect(ranking).toEqual([['1'], ['2'], ['3', '4']]);
});
