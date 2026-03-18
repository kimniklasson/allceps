import type { StreakInfo } from "../../utils/statistics";

interface Props {
  streaks: StreakInfo;
}

export function StatsStreaks({ streaks }: Props) {
  const cards = [
    { value: `${streaks.currentStreak}`, label: "Aktuell streak", unit: "veckor" },
    { value: `${streaks.longestStreak}`, label: "Längsta streak", unit: "veckor" },
    { value: `${streaks.mostWorkoutsInWeek}`, label: "Bästa vecka", unit: "pass" },
    { value: `${streaks.mostWorkoutsInMonth}`, label: "Bästa månad", unit: "pass" },
    { value: `${streaks.avgWorkoutsPerWeek4w}`, label: "Snitt/vecka (4v)", unit: "pass" },
    { value: streaks.favoriteDay, label: "Favoritdag", unit: "" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <span className="text-[12px] font-bold uppercase tracking-wider opacity-50">
        Streak & kontinuitet
      </span>

      <div className="grid grid-cols-2 gap-2">
        {cards.map((card, i) => (
          <div
            key={card.label}
            className="bg-card rounded-card p-4 flex flex-col gap-1 animate-in"
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <div className="flex items-baseline gap-1">
              <span className="text-[20px] font-bold">{card.value}</span>
              {card.unit && (
                <span className="text-[12px] opacity-50">{card.unit}</span>
              )}
            </div>
            <span className="text-[11px] opacity-50 uppercase tracking-wider">{card.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
