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
  // Mirror of `currentStep` kept in a ref so the animation loop can read the
  // latest value without having to depend on `currentStep` in its effect deps
  // (which would re-create the loop on every step).
  const currentStepRef = useRef(0);
  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);
  // Keep latest options in a ref so the animation loop effect doesn't have to
  // depend on a fresh object identity every render.
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const setStepData = useCallback((newSteps: T[]) => {
    cancelRef.current = true;
    setSteps(newSteps);
    setCurrentStep(0);
    currentStepRef.current = 0;
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
      currentStepRef.current = 0;
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
    currentStepRef.current = 0;
    setTimeout(() => {
      cancelRef.current = false;
    }, 10);
  }, []);

  const stepForward = useCallback(() => {
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      currentStepRef.current = next;
      setCurrentStep(next);
    }
  }, [currentStep, steps.length]);

  const stepBackward = useCallback(() => {
    if (currentStep > 0) {
      const next = currentStep - 1;
      currentStepRef.current = next;
      setCurrentStep(next);
    }
  }, [currentStep]);

  const skipToEnd = useCallback(() => {
    cancelRef.current = true;
    const last = steps.length - 1;
    currentStepRef.current = last;
    setCurrentStep(last);
    setIsPlaying(false);
  }, [steps.length]);

  // Animation loop. The dependency array intentionally omits `options` — we
  // read it via `optionsRef.current` so a fresh object reference from the parent
  // can't cause the loop to restart on every render. It also omits
  // `currentStep` — we read the latest value via `currentStepRef.current`,
  // which is kept in sync via a separate effect, so the loop isn't re-created
  // on every step.
  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;

    let cancelled = false;

    const animate = async () => {
      // `speed` is the per-step delay in seconds. Convert to milliseconds and
      // floor at 1 ms so the slider at the lowest value doesn't busy-loop.
      const delay = Math.max(1, Math.floor(Math.max(0, speed) * 1000));

      while (!cancelled) {
        // Read the current step from the ref (synchronously up-to-date) rather
        // than from the React `setCurrentStep` updater. The updater runs in a
        // later render phase, so reading a value set inside it on the same tick
        // would see the stale value and break the loop.
        const current = currentStepRef.current;
        if (current >= steps.length - 1) {
          setIsPlaying(false);
          optionsRef.current.onComplete?.();
          return;
        }
        const next = current + 1;
        currentStepRef.current = next;
        setCurrentStep(next);
        optionsRef.current.onStep?.(current);
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
    // Progress as a percentage matching the "Step N / total" label: when the
    // user is on step 5 of 10, the bar is at 50%. Falls back to 0 when no
    // steps have been loaded, and to 100 when the (only) step is shown.
    progress:
      steps.length === 0
        ? 0
        : Math.max(0, Math.min(100, ((currentStep + 1) / steps.length) * 100)),
  };
}
