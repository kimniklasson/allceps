import type { FunStats } from "../../utils/statistics";
import { formatDecimal } from "../../utils/formatNumber";

interface Props {
  funStats: FunStats;
}

export function StatsFunMotivational({ funStats }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-[12px] font-bold uppercase tracking-wider opacity-50">
        Milstolpar
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
          <span className="text-[12px] opacity-50 uppercase tracking-wider">Totalt lyft</span>
          <div className="text-[15px] font-bold mt-1">
            {funStats.totalKgInCars >= 1
              ? `${formatDecimal(funStats.totalKgInCars)} bilar`
              : funStats.totalKgInElephants >= 0.1
                ? `${formatDecimal(funStats.totalKgInElephants)} elefanter`
                : "Fortsätt lyfta!"}
          </div>
          <div className="text-[12px] opacity-50 mt-0.5">
            {funStats.totalKgInCars >= 1
              ? "i bilvikt (1 500 kg per bil)"
              : "i elefantvikt (5 000 kg per elefant)"}
          </div>
        </div>

        {/* Days since first */}
        <div className="bg-card rounded-card p-4 animate-in" style={{ animationDelay: "0.04s" }}>
          <span className="text-[12px] opacity-50 uppercase tracking-wider">Träningsålder</span>
          <div className="text-[15px] font-bold mt-1">
            {funStats.daysSinceFirstWorkout} dagar
          </div>
          <div className="text-[12px] opacity-50 mt-0.5">sedan ditt första pass</div>
        </div>

        {/* PB comparison */}
        <div className="bg-card rounded-card p-4 animate-in" style={{ animationDelay: "0.08s" }}>
          <span className="text-[12px] opacity-50 uppercase tracking-wider">Personliga rekord</span>
          <div className="text-[15px] font-bold mt-1">
            {funStats.pbCountThisMonth} nya PBs denna månad
          </div>
          <div className="text-[12px] opacity-50 mt-0.5">
            {funStats.pbCountLastMonth} förra månaden
          </div>
        </div>
      </div>
    </div>
  );
}
