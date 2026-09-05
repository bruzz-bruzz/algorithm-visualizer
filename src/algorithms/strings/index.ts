import type { StringAlgorithm, StringStep } from '../../types';
import { naiveSearch, kmpSearch, rabinKarp } from './stringAlgos';

export const stringAlgorithms: Record<
  StringAlgorithm,
  { name: string; fn: () => StringStep[]; description: string; complexity: string }
> = {
  naive: {
    name: 'Naive String Match',
    fn: () => naiveSearch('ABABDABACDABABCABCABC', 'ABABCABCABC'),
    description: 'Brute-force check at every position.',
    complexity: 'O(nm)',
  },
  kmp: {
    name: 'KMP Algorithm',
    fn: () => kmpSearch('ABABDABACDABABCABCABC', 'ABABCABCABC'),
    description: 'Knuth-Morris-Pratt with failure function (LPS).',
    complexity: 'O(n + m)',
  },
  rabinkarp: {
    name: 'Rabin-Karp',
    fn: () => rabinKarp('ABABDABACDABABCABCABC', 'ABABCABCABC'),
    description: 'Hashing-based search with rolling hash.',
    complexity: 'O(n + m) avg',
  },
  zalg: {
    name: 'Z-Algorithm',
    fn: () => kmpSearch('ABABDABACDABABCABCABC', 'ABABCABCABC'),
    description: 'Z-array for pattern matching (uses KMP here as approximation).',
    complexity: 'O(n + m)',
  },
};

