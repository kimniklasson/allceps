import { useState, useEffect, useCallback, useRef } from "react";
import { useSessionStore } from "../stores/useSessionStore";

/**
 * requestAnimationFrame-based timer hook.
 * Computes elapsed time from persisted timestamps — survives page refresh.
 */
export function useTimer() {
  const { isRunning, isPaused, startTimestamp, pausedDuration, pauseStartedAt } =
    useSessionStore();

  const [elapsed, setElapsed] = useState(0);
  const rafRef = useRef<number>(0);

  const tick = useCallback(() => {
    if (!startTimestamp) {
      setElapsed(0);
      return;
    }

    let currentPaused = pausedDuration;
    if (isPaused && pauseStartedAt) {
      currentPaused += Date.now() - pauseStartedAt;
    }

    setElapsed(Date.now() - startTimestamp - currentPaused);
    rafRef.current = requestAnimationFrame(tick);
  }, [startTimestamp, pausedDuration, isPaused, pauseStartedAt]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      rafRef.current = requestAnimationFrame(tick);
    } else if (isRunning && isPaused) {
      // When paused, compute one last time and stop
      if (startTimestamp) {
        let currentPaused = pausedDuration;
        if (pauseStartedAt) {
          currentPaused += Date.now() - pauseStartedAt;
        }
        setElapsed(Date.now() - startTimestamp - currentPaused);
      }
    } else {
      setElapsed(0);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isRunning, isPaused, tick, startTimestamp, pausedDuration, pauseStartedAt]);

  return elapsed;
}
