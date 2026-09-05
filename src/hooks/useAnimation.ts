import { useCallback, useEffect, useRef, useState } from 'react';
import { sleep } from '../utils/helpers';

interface UseAnimationOptions {
  initialDelay?: number;
  onStep?: (step: number) => void;
  onComplete?: () => void;
}

/**
 * Custom hook that animates through a series of steps with start/pause/reset controls.
 */
export function useAnimation<T>(options: UseAnimationOptions = {}) {
  const [steps, setSteps] = useState<T[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50); // 1-100, higher = faster
  const cancelRef = useRef(false);
  const playingRef = useRef(false);

  // Keep ref in sync with state
  useEffect(() => {
    playingRef.current = isPlaying;
  }, [isPlaying]);

  const setStepData = useCallback((newSteps: T[]) => {
    cancelRef.current = true;
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
    // small delay before allowing new playback
    setTimeout(() => {
      cancelRef.current = false;
    }, 10);
  }, []);

  const play = useCallback(async () => {
    if (steps.length === 0) return;
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
    cancelRef.current = false;
  }, [steps.length, currentStep]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    cancelRef.current = true;
  }, []);

  const reset = useCallback(() => {
    cancelRef.current = true;
    setIsPlaying(false);
    setCurrentStep(0);
    setTimeout(() => {
      cancelRef.current = false;
    }, 10);
  }, []);

  const stepForward = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  }, [currentStep, steps.length]);

  const stepBackward = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const skipToEnd = useCallback(() => {
    cancelRef.current = true;
    setCurrentStep(steps.length - 1);
    setIsPlaying(false);
  }, [steps.length]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;

    let cancelled = false;

    const animate = async () => {
      // Map speed (1-100) to delay (3000ms at 1%, down to ~30ms at 100%)
      // so 1% is genuinely slow (step-by-step) and 100% is near-instant.
      const delay = Math.max(1, Math.floor(3000 / speed));

      while (playingRef.current && !cancelled) {
        setCurrentStep((s) => {
          if (s >= steps.length - 1) {
            setIsPlaying(false);
            options.onComplete?.();
            return s;
          }
          options.onStep?.(s);
          return s + 1;
        });
        await sleep(delay);
      }
    };

    animate();

    return () => {
      cancelled = true;
    };
  }, [isPlaying, speed, steps.length, options]);

  return {
    steps,
    currentStep,
    isPlaying,
    speed,
    setSpeed,
    setStepData,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    skipToEnd,
    currentData: steps[currentStep],
    progress: steps.length > 0 ? (currentStep / (steps.length - 1)) * 100 : 0,
  };
}
