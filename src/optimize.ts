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
export function optimize(ranks: Rank[], edges: Edge[], retry = true): Rank[] {
  // If ranks is perfect, don't optimize
  const _oldScore = score(ranks, edges);
  if (_oldScore === 0) return ranks;

  // get a copy of the original ranks
  let _ranks = copy(ranks);
  let _newScore = score(_ranks, edges);

  for (let i = 0; i < _ranks.length; i++) {
    for (let j = 0; j < _ranks[i].length - 1; j++) {
      // Swap the values in _ranks
      const temp = swap(_ranks, i, j);
      // If the score does not worsen, apply the change
      if (score(temp, edges) <= _newScore) {
        _ranks = swap(_ranks, i, j);
        _newScore = score(_ranks, edges);
      }
    }
  }

  // When found a perfect score, stop
  if (_newScore === 0) return _ranks;
  // If a better score is find that is not optimal, continue searching
  // If an equal score is found, execute the algorithm one more time
  // to avoid cyclic optimizations
  if (retry && _newScore <= _oldScore)
    return optimize(_ranks, edges, _newScore !== _oldScore);

  return _ranks;
}
