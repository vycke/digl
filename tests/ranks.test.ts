/* eslint-disable @typescript-eslint/ban-types */
import initial from '../src/ranks';
import { Config, Edge, Node } from '../src/types';

const startId = '1';
const config: Config = {
  width: 50,
  height: 10,
  orientation: 'horizontal',
  addEmptySpots: false,
  shortestPath: false,
};
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
  const ranking = initial(startId, nodes, [], config);
  expect(ranking).toEqual([[startId]]);
});

test('Initial ranking - acyclic graph', () => {
  const ranking = initial(startId, nodes, acyclicEdges, config);
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
  const ranking = initial(startId, nodes, cyclicEdges, config);
  expect(ranking).toEqual([['1'], ['2'], ['3', '4']]);
});

test('Initial ranking - acyclic graph shortest path', () => {
  const ranking = initial(startId, nodes, acyclicEdges, {
    ...config,
    shortestPath: true,
  });
  expect(ranking).toEqual([
    ['1'],
    ['2'],
    ['3', '4'],
    ['5', '8', '7'],
    ['6', '9'],
    ['10'],
  ]);
});

test('Initial ranking - acyclic graph shortest path', () => {
  const ranking = initial(startId, nodes, acyclicEdges, {
    ...config,
    shortestPath: true,
    addEmptySpots: true,
  });
  expect(ranking).toEqual([
    ['1'],
    ['2'],
    ['3', '4'],
    ['5', '8', '7'],
    ['6', '9'],
    ['10'],
  ]);
});

test('Initial ranking - support for solitary nodes [#8]', () => {
  const nodes: Node[] = [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8', solitary: true },
    { id: '9' },
    { id: '10' },
  ];

  const ranking = initial(startId, nodes, acyclicEdges, {
    ...config,
    shortestPath: true,
    addEmptySpots: false,
  });
  expect(ranking).toEqual([
    ['1'],
    ['2'],
    ['3', '4'],
    ['8'],
    ['5', '7'],
    ['6', '9'],
    ['10'],
  ]);
});
