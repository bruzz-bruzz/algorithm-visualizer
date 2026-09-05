import type { StringStep } from '../../types';

function makeEmpty(text: string, pattern: string): StringStep {
  return {
    text, pattern,
    textIndices: text.split('').map((_, i) => ({ index: i, state: 'idle' as string })),
    patternIndices: pattern.split('').map((_, i) => ({ index: i, state: 'idle' as string })),
    description: '',
    matches: [],
    currentPosition: { textIndex: 0, patternIndex: 0 },
  };
}

export function naiveSearch(text: string, pattern: string): StringStep[] {
  const steps: StringStep[] = [];
  const n = text.length, m = pattern.length;
  steps.push({ ...makeEmpty(text, pattern), description: `Naive string search: "${pattern}" in "${text}"` });

  for (let i = 0; i <= n - m; i++) {
    let j = 0;
    while (j < m && text[i + j] === pattern[j]) {
      const step = makeEmpty(text, pattern);
      step.textIndices = step.textIndices.map(t => ({ ...t, state: t.index >= i && t.index < i + j + 1 ? 'matched' : t.index === i + j ? 'matching' : 'idle' }));
      step.patternIndices = step.patternIndices.map(p => ({ ...p, state: p.index <= j ? 'matched' : 'idle' }));
      step.currentPosition = { textIndex: i + j, patternIndex: j };
      step.description = `Match at pos ${i}: comparing "${text[i + j]}" with "${pattern[j]}"`;
      steps.push(step);
      j++;
    }
    if (j === m) {
      const step = makeEmpty(text, pattern);
      step.matches = [{ start: i, end: i + m - 1 }];
      step.textIndices = step.textIndices.map(t => ({ ...t, state: t.index >= i && t.index < i + m ? 'matched' : 'idle' }));
      step.patternIndices = step.patternIndices.map(p => ({ ...p, state: 'matched' }));
      step.description = `Match found at position ${i}!`;
      steps.push(step);
    } else if (i < n - m) {
      const step = makeEmpty(text, pattern);
      step.textIndices = step.textIndices.map(t => ({ ...t, state: t.index >= i && t.index <= i + j ? 'mismatch' : 'idle' }));
      step.description = `Mismatch at pos ${i + j}: "${text[i + j]}" != "${pattern[j]}"`;
      steps.push(step);
    }
  }
  steps.push({ ...makeEmpty(text, pattern), description: 'Search complete', matches: steps[steps.length - 1]?.matches ?? [] });
  return steps;
}

export function kmpSearch(text: string, pattern: string): StringStep[] {
  const steps: StringStep[] = [];
  const m = pattern.length;
  const lps: number[] = new Array(m).fill(0);
  for (let i = 1, len = 0; i < m; ) {
    if (pattern[i] === pattern[len]) { len++; lps[i] = len; i++; }
    else if (len > 0) len = lps[len - 1];
    else { lps[i] = 0; i++; }
  }

  steps.push({ ...makeEmpty(text, pattern), description: `KMP search: "${pattern}" in "${text}"`, lpsTable: [...lps] });

  let i = 0, j = 0;
  while (i < text.length) {
    const step = makeEmpty(text, pattern);
    step.textIndices = step.textIndices.map(t => ({ ...t, state: t.index === i ? 'matching' : t.index < i ? 'matched' : 'idle' }));
    step.patternIndices = step.patternIndices.map(p => ({ ...p, state: p.index === j ? 'matching' : p.index < j ? 'matched' : 'idle' }));
    step.currentPosition = { textIndex: i, patternIndex: j };
    step.lpsTable = [...lps];
    if (text[i] === pattern[j]) {
      step.description = `Match: text[${i}]="${text[i]}" == pattern[${j}]="${pattern[j]}"`;
      steps.push(step);
      i++; j++;
    } else {
      step.description = `Mismatch: text[${i}]="${text[i]}" != pattern[${j}]="${pattern[j]}". Use LPS[${j - 1}]=${j > 0 ? lps[j - 1] : 0}`;
      steps.push(step);
      if (j > 0) j = lps[j - 1];
      else i++;
    }
    if (j === m) {
      const matchStep = makeEmpty(text, pattern);
      matchStep.matches = [{ start: i - m, end: i - 1 }];
      matchStep.textIndices = matchStep.textIndices.map(t => ({ ...t, state: t.index >= i - m && t.index < i ? 'matched' : 'idle' }));
      matchStep.patternIndices = matchStep.patternIndices.map(p => ({ ...p, state: 'matched' }));
      matchStep.description = `Match found at position ${i - m}!`;
      matchStep.lpsTable = [...lps];
      steps.push(matchStep);
      j = lps[j - 1];
    }
  }
  return steps;
}

export function rabinKarp(text: string, pattern: string, base: number = 256, mod: number = 101): StringStep[] {
  const steps: StringStep[] = [];
  const n = text.length, m = pattern.length;
  steps.push({ ...makeEmpty(text, pattern), description: `Rabin-Karp: "${pattern}" in "${text}" using rolling hash` });

  let h = 1;
  for (let i = 0; i < m - 1; i++) h = (h * base) % mod;

  let pHash = 0, tHash = 0;
  for (let i = 0; i < m; i++) {
    pHash = (base * pHash + pattern.charCodeAt(i)) % mod;
    tHash = (base * tHash + text.charCodeAt(i)) % mod;
  }

  for (let i = 0; i <= n - m; i++) {
    const step = makeEmpty(text, pattern);
    step.textIndices = step.textIndices.map(t => ({ ...t, state: t.index >= i && t.index < i + m ? 'matching' : 'idle' }));
    step.description = `Window at ${i}: hash=${tHash}, pattern hash=${pHash}. ${pHash === tHash ? 'Hash match, verify' : 'Hash mismatch'}`;
    steps.push(step);

    if (pHash === tHash) {
      let j = 0;
      while (j < m && text[i + j] === pattern[j]) j++;
      if (j === m) {
        const mStep = makeEmpty(text, pattern);
        mStep.matches = [{ start: i, end: i + m - 1 }];
        mStep.textIndices = mStep.textIndices.map(t => ({ ...t, state: t.index >= i && t.index < i + m ? 'matched' : 'idle' }));
        mStep.description = `Match at ${i}!`;
        steps.push(mStep);
      }
    }
    if (i < n - m) {
      tHash = ((tHash - text.charCodeAt(i) * h) * base + text.charCodeAt(i + m)) % mod;
      if (tHash < 0) tHash += mod;
    }
  }
  return steps;
}

