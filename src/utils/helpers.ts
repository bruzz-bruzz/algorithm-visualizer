// Utility helper functions

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const generateRandomArray = (
  size: number,
  min: number = 5,
  max: number = 100
): number[] => {
  const arr: number[] = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return arr;
};

export const generateSortedArray = (size: number): number[] => {
  return Array.from({ length: size }, (_, i) => i + 1);
};

export const generateReversedArray = (size: number): number[] => {
  return Array.from({ length: size }, (_, i) => size - i);
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};
