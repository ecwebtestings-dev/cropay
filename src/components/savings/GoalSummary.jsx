import Card from "../common/Card";
import { getGoalStatus } from "../../utils/goalStatus";

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Donut chart + counts of goals that are on track, completed and overdue.
 */
export default function GoalSummary({ goals = [] }) {
  const counts = { active: 0, completed: 0, overdue: 0 };
 
  goals.forEach((goal) => {
    counts[getGoalStatus(goal)] += 1;
  });

  const total = goals.length;

  const segments = [
    { label: "On Track", count: counts.active, stroke: "stroke-emerald-500", dot: "bg-emerald-500" },
    { label: "Completed", count: counts.completed, stroke: "stroke-blue-500", dot: "bg-blue-500" },
    { label: "Overdue", count: counts.overdue, stroke: "stroke-red-500", dot: "bg-red-500" },
  ];

  let offset = 0;

  return (
    <Card title="Goal Summary">
      <div className="flex flex-col items-center gap-5 sm:flex-row lg:flex-col xl:flex-row">
        <div className="relative h-32 w-32 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
            <circle cx="50" cy="50" r={RADIUS} fill="none" strokeWidth="12" className="stroke-border" />

            {segments.map((segment) => {
              const length = total ? (segment.count / total) * CIRCUMFERENCE : 0;
              const circle = length > 0 && (
                <circle
                  key={segment.label}
                  cx="50"
                  cy="50"
                  r={RADIUS}
                  fill="none"
                  strokeWidth="12"
                  strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
                  strokeDashoffset={-offset}
                  className={segment.stroke}
                />
              );
              offset += length;
              return circle;
            })}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-heading">{total}</span>
            <span className="text-xs text-muted">{total === 1 ? "Goal" : "Goals"}</span>
          </div>
        </div>

        <ul className="w-full space-y-2 text-sm">
          {segments.map((segment) => (
            <li key={segment.label} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-body">
                <span className={`h-2.5 w-2.5 rounded-full ${segment.dot}`} aria-hidden="true" />
                {segment.label}
              </span>
              <span className="font-semibold text-heading">{segment.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}