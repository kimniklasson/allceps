import { useMemo } from "react";
import type { WorkoutSession } from "../../types/models";
import { computeMuscleBalance } from "../../utils/statistics";

interface Props {
  sessions: WorkoutSession[];
}

export function StatsMuscleBalance({ sessions }: Props) {
  const result = useMemo(
    () => computeMuscleBalance(sessions, null),
    [sessions]
  );

  if (!result.hasData) return null;

  const color = result.score >= 70 ? "#22c55e" : result.score >= 40 ? "#FFD900" : "#ef4444";

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[12px] font-bold uppercase tracking-wider opacity-50">
        Muskelbalans
      </span>

      <div className="bg-card rounded-card p-4 flex items-center gap-5">
        <BalanceRing score={result.score} color={color} />

        <div className="flex-1 flex flex-col gap-2">
          {result.mostTrained && (
            <div>
              <span className="text-[11px] opacity-40 uppercase tracking-wider">Mest tränad</span>
              <div className="text-[14px] font-medium leading-tight">
                {result.mostTrained.name}
                <span className="opacity-50 font-normal"> {result.mostTrained.percentage}%</span>
              </div>
            </div>
          )}
          {result.leastTrained && (
            <div>
              <span className="text-[11px] opacity-40 uppercase tracking-wider">Minst tränad</span>
              <div className="text-[14px] font-medium leading-tight">
                {result.leastTrained.name}
                <span className="opacity-50 font-normal"> {result.leastTrained.percentage}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const R = 28;
const SW = 6;
const SIZE = 2 * (R + SW / 2);
const CX = SIZE / 2;
const CY = SIZE / 2;
const CIRC = 2 * Math.PI * R;

function BalanceRing({ score, color }: { score: number; color: string }) {
  const arc = (Math.min(100, Math.max(0, score)) / 100) * CIRC;

  return (
    <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE}>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke={color} strokeWidth={SW} strokeOpacity={0.15} />
        <circle
          cx={CX} cy={CY} r={R}
          fill="none"
          stroke={color}
          strokeWidth={SW}
          strokeLinecap="round"
          strokeDasharray={`${CIRC}`}
          strokeDashoffset={CIRC - arc}
          transform={`rotate(-90 ${CX} ${CY})`}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[13px] font-bold tabular-nums">{score}</span>
      </div>
    </div>
  );
}
