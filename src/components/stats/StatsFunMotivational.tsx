import type { FunStats } from "../../utils/statistics";
import { formatDecimal } from "../../utils/formatNumber";
import { STATS_MILESTONES, TIME } from "../../constants/ui-strings";

interface Props {
  funStats: FunStats;
}

export function StatsFunMotivational({ funStats }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-[12px] font-bold uppercase tracking-wider opacity-50">
        {STATS_MILESTONES.TITLE}
      </span>

      {/* Badge row */}
      <div className="flex gap-3 overflow-x-auto -mx-8 px-8 pb-2">
        {funStats.badges.map((badge) => (
          <div
            key={badge.count}
            className={`shrink-0 w-14 h-14 rounded-full flex items-center justify-center ${
              badge.achieved
                ? "bg-accent"
                : "bg-black/5 dark:bg-white/10 opacity-30"
            }`}
          >
            <span className={`text-[12px] font-bold ${badge.achieved ? "text-black" : ""}`}>
              {badge.label}
            </span>
          </div>
        ))}
      </div>

      {/* Fun stats cards */}
      <div className="flex flex-col gap-2">
        {/* Fun equivalents */}
        <div className="bg-card rounded-card p-4 animate-in">
          <span className="text-[12px] opacity-50 uppercase tracking-wider">{STATS_MILESTONES.TOTAL_LIFTED}</span>
          <div className="text-[15px] font-bold mt-1">
            {funStats.totalKgInCars >= 1
              ? `${formatDecimal(funStats.totalKgInCars)} ${STATS_MILESTONES.CARS}`
              : funStats.totalKgInElephants >= 0.1
                ? `${formatDecimal(funStats.totalKgInElephants)} ${STATS_MILESTONES.ELEPHANTS}`
                : STATS_MILESTONES.KEEP_LIFTING}
          </div>
          <div className="text-[12px] opacity-50 mt-0.5">
            {funStats.totalKgInCars >= 1
              ? STATS_MILESTONES.CAR_DESCRIPTION
              : STATS_MILESTONES.ELEPHANT_DESCRIPTION}
          </div>
        </div>

        {/* Days since first */}
        <div className="bg-card rounded-card p-4 animate-in" style={{ animationDelay: "0.04s" }}>
          <span className="text-[12px] opacity-50 uppercase tracking-wider">{STATS_MILESTONES.TRAINING_AGE}</span>
          <div className="text-[15px] font-bold mt-1">
            {funStats.daysSinceFirstWorkout} {TIME.DAYS}
          </div>
          <div className="text-[12px] opacity-50 mt-0.5">{STATS_MILESTONES.SINCE_FIRST_SESSION}</div>
        </div>

        {/* PB comparison */}
        <div className="bg-card rounded-card p-4 animate-in" style={{ animationDelay: "0.08s" }}>
          <span className="text-[12px] opacity-50 uppercase tracking-wider">{STATS_MILESTONES.PERSONAL_RECORDS}</span>
          <div className="text-[15px] font-bold mt-1">
            {funStats.pbCountThisMonth} {STATS_MILESTONES.NEW_PBS_THIS_MONTH}
          </div>
          <div className="text-[12px] opacity-50 mt-0.5">
            {funStats.pbCountLastMonth} {STATS_MILESTONES.LAST_MONTH}
          </div>
        </div>
      </div>
    </div>
  );
}
