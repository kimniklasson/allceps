import { useState, useEffect, useRef } from "react";
import { useSessionStore } from "../stores/useSessionStore";

/**
 * Tracks elapsed rest time since the last completed set.
 * Reads state directly from the store to avoid recreating the RAF callback.
 */
export function useRestTimer() {
  const { lastCompletedSetAt, activeSet, isPaused, isRunning } =
    useSessionStore();

  const [elapsed, setElapsed] = useState(0);
  const rafRef = useRef<number>(0);

  const isResting = isRunning && !isPaused && !!lastCompletedSetAt && !activeSet;

  useEffect(() => {
    if (isResting) {
      const tick = () => {
        const state = useSessionStore.getState();
        if (!state.lastCompletedSetAt) {
          setElapsed(0);
          return;
        }
        setElapsed(Date.now() - new Date(state.lastCompletedSetAt).getTime());
        rafRef.current = requestAnimationFrame(tick);
      };
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
  }, [isResting, lastCompletedSetAt, activeSet]);

  return elapsed;
}
