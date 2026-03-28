import { useState, useEffect, useRef } from "react";
import { useSessionStore } from "../stores/useSessionStore";

/**
 * requestAnimationFrame-based timer hook.
 * Reads timer state directly from the store to avoid recreating the RAF callback.
 */
export function useTimer() {
  const { isRunning, isPaused } = useSessionStore();

  const [elapsed, setElapsed] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning && !isPaused) {
      const tick = () => {
        const state = useSessionStore.getState();
        if (!state.startTimestamp) {
          setElapsed(0);
          return;
        }

        let currentPaused = state.pausedDuration;
        if (state.isPaused && state.pauseStartedAt) {
          currentPaused += Date.now() - state.pauseStartedAt;
        }

        setElapsed(Date.now() - state.startTimestamp - currentPaused);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } else if (isRunning && isPaused) {
      // When paused, compute one last value and stop
      const state = useSessionStore.getState();
      if (state.startTimestamp) {
        let currentPaused = state.pausedDuration;
        if (state.pauseStartedAt) {
          currentPaused += Date.now() - state.pauseStartedAt;
        }
        setElapsed(Date.now() - state.startTimestamp - currentPaused);
      }
    } else {
      setElapsed(0);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isRunning, isPaused]);

  return elapsed;
}
