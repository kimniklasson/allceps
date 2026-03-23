import { useState, useEffect, useCallback, useRef } from "react";
import { useSessionStore } from "../stores/useSessionStore";

/**
 * Tracks elapsed rest time since the last completed set.
 * Pauses when a set is in progress or session is paused.
 * Returns elapsed milliseconds.
 */
export function useRestTimer() {
  const { lastCompletedSetAt, activeSet, isPaused, isRunning } =
    useSessionStore();

  const [elapsed, setElapsed] = useState(0);
  const rafRef = useRef<number>(0);

  const isResting = isRunning && !isPaused && lastCompletedSetAt && !activeSet;

  const tick = useCallback(() => {
    if (!lastCompletedSetAt) {
      setElapsed(0);
      return;
    }
    setElapsed(Date.now() - new Date(lastCompletedSetAt).getTime());
    rafRef.current = requestAnimationFrame(tick);
  }, [lastCompletedSetAt]);

  useEffect(() => {
    if (isResting) {
      rafRef.current = requestAnimationFrame(tick);
    } else if (lastCompletedSetAt && !activeSet) {
      // Paused — show frozen value
      setElapsed(Date.now() - new Date(lastCompletedSetAt).getTime());
    } else {
      setElapsed(0);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isResting, tick, lastCompletedSetAt, activeSet]);

  return elapsed;
}
