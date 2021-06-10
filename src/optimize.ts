import { score } from './score';
import { Edge, Rank } from './types';

// copy ranks
function copy(ranks: Rank[]): Rank[] {
  const _ranks: Rank[] = [];
  // copy the array
  for (let i = 0; i < ranks.length; i++) _ranks[i] = ranks[i].slice();

  return _ranks;
}

// swap two adjacent values in a rank
function swap(ranks: Rank[], i: number, j: number): Rank[] {
  const _ranks = copy(ranks);

  const v1 = ranks[i][j];
  const v2 = ranks[i][j + 1];

  _ranks[i][j] = v2;
  _ranks[i][j + 1] = v1;

  return _ranks;
}

// Optimization heuristic
export function optimize(ranks: Rank[], edges: Edge[], iter = 0): Rank[] {
  // If ranks is perfect, don't optimize
  if (score(ranks, edges) === 0) return ranks;

  // get a copy of the
  let _ranks = copy(ranks);

  for (let i = 0; i < _ranks.length; i++) {
    for (let j = 0; j < _ranks[i].length - 1; j++) {
      // Swap the values in _ranks
      const temp = swap(_ranks, i, j);
      // If the score does not worsen, apply the change
      if (score(temp, edges) <= score(_ranks, edges))
        _ranks = swap(_ranks, i, j);
    }
  }

  // When found a perfect score, stop
  if (score(_ranks, edges) === 0) return _ranks;

  // If we found a better score than the original, try again, else stop.
  if (iter < 10 && score(_ranks, edges) < score(ranks, edges))
    return optimize(_ranks, edges, iter + 1);

  return _ranks;
}
