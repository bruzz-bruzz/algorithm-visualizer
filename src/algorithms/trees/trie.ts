import type { StringStep } from '../../types';

export function trieInsert(words: string[], newWords: string[]): StringStep[] {
  const steps: StringStep[] = [];
  const allWords = [...words];
  const allText = allWords.join(' ');

  steps.push({
    text: allText,
    pattern: '',
    textIndices: allText.split('').map((_, i: number) => ({ index: i, state: 'idle' as string })),
    patternIndices: [],
    description: `Initial trie contains: ${allWords.join(', ')}`,
    matches: [],
    currentPosition: { textIndex: 0, patternIndex: 0 },
  });

  for (const word of newWords) {
    for (let i = 0; i < word.length; i++) {
      steps.push({
        text: word,
        pattern: '',
        textIndices: word.split('').map((_, idx: number) => ({
          index: idx,
          state: (idx === i ? 'matching' : idx < i ? 'matched' : 'idle') as 'matching' | 'matched' | 'idle',
        })),
        patternIndices: [],
        description: `Inserting "${word}": character '${word[i]}' at position ${i}`,
        matches: [],
        currentPosition: { textIndex: i, patternIndex: 0 },
      });
    }
    allWords.push(word);
    steps.push({
      text: word,
      pattern: 'OK',
      textIndices: word.split('').map((_, i: number) => ({ index: i, state: 'matched' as string })),
      patternIndices: [],
      description: `Inserted "${word}" (marked as end-of-word)`,
      matches: [],
      currentPosition: { textIndex: 0, patternIndex: 0 },
    });
  }

  steps.push({
    text: allWords.join(' '),
    pattern: '',
    textIndices: [],
    patternIndices: [],
    description: `Trie contains: ${allWords.join(', ')}`,
    matches: [],
    currentPosition: { textIndex: 0, patternIndex: 0 },
  });

  return steps;
}

