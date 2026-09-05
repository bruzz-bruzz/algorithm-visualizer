import { useCallback, useEffect, useRef, useState } from 'react';
import { sleep } from '../utils/helpers';

interface UseAnimationOptions {
  initialDelay?: number;
  onStep?: (step: number) => void;
  onComplete?: () => void;
}

/**
 * Custom hook that animates through a series of steps with start/pause/reset
 * controls. `speed` is the per-step delay in seconds (slider value).
 */
export function useAnimation<T>(options: UseAnimationOptions = {}) {
  const [steps, setSteps] = useState<T[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  // Default 250 ms per step — comfortable middle ground.
  const [speed, setSpeed] = useState(0.25);
  const cancelRef = useRef(false);
  const playingRef = useRef(false);
  // Keep latest options in a ref so the animation loop effect doesn't have to
  // depend on a fresh object identity every render.
  const optionsRef = useRef(options);
  optionsRef.current = options;

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

  const play = useCallback(() => {
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

  // Animation loop. The dependency array intentionally omits `options` — we
  // read it via `optionsRef.current` so a fresh object reference from the parent
  // can't cause the loop to restart on every render.
  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;

    let cancelled = false;

    const animate = async () => {
      // `speed` is the per-step delay in seconds. Convert to milliseconds and
      // floor at 1 ms so the slider at the lowest value doesn't busy-loop.
      const delay = Math.max(1, Math.floor(Math.max(0, speed) * 1000));

      while (!cancelled) {
        let advanced = false;
        setCurrentStep((s) => {
          if (s >= steps.length - 1) {
            setIsPlaying(false);
            optionsRef.current.onComplete?.();
            return s;
          }
          optionsRef.current.onStep?.(s);
          advanced = true;
          return s + 1;
        });
        if (!advanced) {
          // Reached the end — exit.
          return;
        }
        await sleep(delay);
      }
    };

    animate();

    return () => {
      cancelled = true;
    };
  }, [isPlaying, speed, steps.length]);

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
