import { Pause, Play, Check } from "lucide-react";
import { useSessionStore } from "../../stores/useSessionStore";
import { useTimer } from "../../hooks/useTimer";
import { formatTime } from "../../utils/formatTime";

export function SessionTimerBar() {
  const { activeSession, isPaused, togglePause, finishSession } = useSessionStore();
  const elapsed = useTimer();

  if (!activeSession) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      <div className="mx-auto max-w-[600px] pointer-events-auto">
        <div
          className="flex items-start gap-2 p-6 backdrop-blur-lg transition-all duration-300"
          style={{ backgroundColor: "rgba(255, 217, 0, 0.7)" }}
        >
          {/* Timer info */}
          <div className="flex-1 flex flex-col gap-2">
            <span className="font-bold text-[12px] uppercase tracking-wider text-black">
              TIMER
            </span>
            <span className="text-[31px] leading-[18px] text-black font-normal">
              {formatTime(elapsed)}
            </span>
          </div>

          {/* Pause / Play */}
          <button
            onClick={togglePause}
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0"
          >
            {isPaused ? <Play size={16} fill="black" /> : <Pause size={16} />}
          </button>

          {/* Finish */}
          <button
            onClick={finishSession}
            className="w-12 h-12 rounded-full bg-black flex items-center justify-center shrink-0"
          >
            <Check size={16} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}
