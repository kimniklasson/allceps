import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ExercisePR } from "../../utils/statistics";
import { STATS_PERSONAL_RECORDS } from "../../constants/ui-strings";
import { FadeInOnScroll } from "../ui/FadeInOnScroll";

interface Props {
  prs: ExercisePR[];
}

export function StatsPersonalRecords({ prs }: Props) {
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();
  const displayPrs = showAll ? prs : prs.slice(0, 5);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[12px] font-bold uppercase tracking-wider opacity-50">
        {STATS_PERSONAL_RECORDS.TITLE}
      </span>

      {/* Exercise PR list */}
      <div className="flex flex-col gap-2">
        {displayPrs.map((pr, i) => (
          <FadeInOnScroll key={pr.exerciseId} delay={i * 60}>
          <button
            onClick={() => navigate(`/stats/exercise/${pr.exerciseId}`)}
            className="bg-card rounded-card px-6 py-6 flex items-start gap-2 w-full text-left"
          >
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[15px] leading-[18px]">{pr.exerciseName}</div>
              <div className="text-[15px] leading-[18px] opacity-60">
                {pr.isBodyweight ? (
                  <>
                    {pr.maxRepsBodyweight} reps
                    {pr.maxWeight > 0 && ` · ${pr.maxWeight} kg extra`}
                  </>
                ) : (
                  <>
                    {pr.maxWeight} kg · {pr.maxRepsAtMaxWeight} reps
                  </>
                )}
              </div>
            </div>
            {!pr.isBodyweight && pr.estimated1RM > 0 && (
              <span className="text-[12px] opacity-50 uppercase tracking-wider shrink-0 pt-0.5">
                1RM: {pr.estimated1RM} kg
              </span>
            )}
          </button>
          </FadeInOnScroll>
        ))}
      </div>

      {prs.length > 5 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="text-[12px] font-bold opacity-50 py-2"
        >
          {STATS_PERSONAL_RECORDS.SHOW_ALL(prs.length)}
        </button>
      )}
    </div>
  );
}

