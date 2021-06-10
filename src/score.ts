import { Edge, Rank } from './types';

// Determine how many edges exist within a rank, where the two nodes are not
// adjacent
function withinRankScore(rank: Rank, edges: Edge[]): number {
  const crossings = edges
    .filter((e) => rank.includes(e.source) && rank.includes(e.target))
    .map((e) => ({ s: rank.indexOf(e.source), t: rank.indexOf(e.target) }))
    .filter((e) => e.s > e.t + 1 || e.t > e.s + 1);

  let score = 0;
  crossings.forEach((e) => (score += Math.abs(e.t - e.s) - 1));

  return score;
}

function betweenRankScore(r1: Rank, r2: Rank, edges: Edge[]): number {
  // combine the two ranks
  const _c = [...r1, ...r2];
  // Get all edges that are part of the two ranks
  const _e = edges
    .filter((e) => _c.includes(e.source) && _c.includes(e.target))
    .filter((e) => !(r1.includes(e.source) && r1.includes(e.target)))
    .filter((e) => !(r2.includes(e.source) && r2.includes(e.target)));

  let _score = 0;
  for (let i = 0; i < _e.length - 1; i++) {
    for (let j = i + 1; j < _e.length; j++) {
      // determine sorted position of the two edges
      const p1 = [_c.indexOf(_e[i].source), _c.indexOf(_e[i].target)].sort();
      const p2 = [_c.indexOf(_e[j].source), _c.indexOf(_e[j].target)].sort();

      // determine if the two edges cross
      if ((p1[0] > p2[0] && p1[1] < p2[1]) || (p1[0] < p2[0] && p1[1] > p2[1]))
        _score++;
    }
  }

  return _score;
}

// Determine the total number of crossing edges in a graph, and edges
// overlapping nodes
export function score(ranks: Rank[], edges: Edge[]): number {
  let _score = 0;
  for (let i = 0; i < ranks.length - 1; i++) {
    _score += withinRankScore(ranks[i], edges);
    for (let j = i + 1; j < ranks.length; j++)
      _score += betweenRankScore(ranks[i], ranks[j], edges);
  }

  return _score;
}
