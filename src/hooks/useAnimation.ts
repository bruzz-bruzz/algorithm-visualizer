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
      // The per-step delay is data-size-aware so that:
      //   - Small datasets (few steps) get a relatively slow per-step delay
      //     so individual steps are easy to follow.
      //   - Large datasets (many steps) get a faster per-step delay so the
      //     whole animation finishes in a watchable amount of time.
      //
      // baseDelay = 3000 / sqrt(steps.length), clamped to [3, 150] ms.
      // This represents the per-step delay at 100% speed. The slider then
      // scales this: delay = baseDelay × (100 / speed).
      //
      // Examples (at 100% speed):
      //   ~25   steps  -> baseDelay = 150 ms -> ~3.75 s total
      //   ~100  steps  -> baseDelay = 150 ms -> ~15 s total
      //   ~1000 steps  -> baseDelay =  95 ms -> ~95 s total
      //   ~5000 steps  -> baseDelay =  42 ms -> ~3.5 min total
      //
      // At 1% speed each step takes baseDelay × 100 ms (truly step-by-step).
      const safeSpeed = Math.max(1, Math.min(100, speed));
      const baseDelay = Math.max(
        3,
        Math.min(150, Math.floor(3000 / Math.sqrt(steps.length)))
      );
      const delay = Math.max(1, Math.floor(baseDelay * (100 / safeSpeed)));

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
