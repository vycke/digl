test('', () => {});

// /* eslint-disable @typescript-eslint/ban-types */
// import { getRankForStartNode } from '../src/ranks';
// import { Config, Edge } from '../src/types';

// const startId = '1';
// const config: Config = {
//   addEmptySpots: false,
//   shortestPath: false,
// };

// const acyclicEdges: Edge[] = [
//   { source: '1', target: '2' },
//   { source: '2', target: '3' },
//   { source: '2', target: '4' },
//   { source: '3', target: '4' },
//   { source: '4', target: '5' },
//   { source: '5', target: '6' },
//   { source: '4', target: '8' },
//   { source: '8', target: '5' },
//   { source: '3', target: '5' },
//   { source: '3', target: '7' },
//   { source: '7', target: '9' },
//   { source: '9', target: '6' },
//   { source: '7', target: '6' },
//   { source: '9', target: '10' },
//   { source: '10', target: '6' },
// ];

// const cyclicEdges: Edge[] = [
//   { source: '1', target: '2' },
//   { source: '2', target: '3' },
//   { source: '2', target: '4' },
//   { source: '1', target: '4' },
//   { source: '4', target: '1' },
// ];

// test('Initial ranking - empty edges', () => {
//   const ranking = getRankForStartNode(startId, [], config);
//   expect(ranking).toEqual([]);
// });

// test('Initial ranking - acyclic graph', () => {
//   const ranking = getRankForStartNode(startId, acyclicEdges, config);
//   expect(ranking).toEqual([
//     ['1'],
//     ['2'],
//     ['3'],
//     ['4', '7'],
//     ['8', '9'],
//     ['5', '10'],
//     ['6'],
//   ]);
// });

// test('Initial ranking - cyclic graph', () => {
//   const ranking = getRankForStartNode(startId, cyclicEdges, config);
//   expect(ranking).toEqual([['1'], ['2'], ['3', '4']]);
// });

// test('Initial ranking - acyclic graph shortest path', () => {
//   const ranking = getRankForStartNode(startId, acyclicEdges, {
//     ...config,
//     shortestPath: true,
//   });
//   expect(ranking).toEqual([
//     ['1'],
//     ['2'],
//     ['3', '4'],
//     ['5', '8', '7'],
//     ['6', '9'],
//     ['10'],
//   ]);
// });

// test('Initial ranking - acyclic graph shortest path', () => {
//   const ranking = getRankForStartNode(startId, acyclicEdges, {
//     ...config,
//     shortestPath: true,
//     addEmptySpots: true,
//   });
//   expect(ranking).toEqual([
//     ['1'],
//     ['2'],
//     ['3', '4'],
//     ['5', '8', '7'],
//     ['6', '9'],
//     ['10'],
//   ]);
// });

// test('Initial ranking - support for solitary nodes [#8]', () => {
//   const ranking = getRankForStartNode(startId, acyclicEdges, {
//     ...config,
//     shortestPath: true,
//     solitary: ['8'],
//     addEmptySpots: false,
//   });
//   expect(ranking).toEqual([
//     ['1'],
//     ['2'],
//     ['3', '4'],
//     ['8'],
//     ['5', '7'],
//     ['6', '9'],
//     ['10'],
//   ]);
// });
