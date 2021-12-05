/* eslint-disable @typescript-eslint/ban-types */
import ranks from '../src/ranks';
import positioning from '../src/positioning';
import { Config, Edge, Node } from '../src/types';

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

const config: Config = {
  width: 50,
  height: 10,
  orientation: 'horizontal',
};

test('Positioning - horizontal acyclic graph', () => {
  const ranking = ranks(startId, nodes, acyclicEdges);
  expect(positioning(config, nodes, ranking)).toEqual([
    { id: '1', x: 0, y: 0 },
    { id: '2', x: 100, y: 0 },
    { id: '3', x: 200, y: 0 },
    { id: '4', x: 300, y: -10 },
    { id: '7', x: 300, y: 10 },
    { id: '8', x: 400, y: -10 },
    { id: '9', x: 400, y: 10 },
    { id: '5', x: 500, y: -10 },
    { id: '10', x: 500, y: 10 },
    { id: '6', x: 600, y: 0 },
  ]);
});

test('Positioning - vertical acyclic graph', () => {
  const ranking = ranks(startId, nodes, acyclicEdges);
  expect(
    positioning({ ...config, orientation: 'vertical' }, nodes, ranking)
  ).toEqual([
    { id: '1', x: 0, y: 0 },
    { id: '2', x: 0, y: 20 },
    { id: '3', x: 0, y: 40 },
    { id: '4', x: -50, y: 60 },
    { id: '7', x: 50, y: 60 },
    { id: '8', x: -50, y: 80 },
    { id: '9', x: 50, y: 80 },
    { id: '5', x: -50, y: 100 },
    { id: '10', x: 50, y: 100 },
    { id: '6', x: 0, y: 120 },
  ]);
});
