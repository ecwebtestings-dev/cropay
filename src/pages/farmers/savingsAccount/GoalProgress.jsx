export default function GoalProgress({ progress = 0 }) {
  const safeProgress = Math.min(100, Math.max(0, Number(progress) || 0));

  return (
    <div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safeProgress}
        className="h-2 overflow-hidden rounded-full bg-bg"
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${safeProgress}%` }}
        />
      </div>

      <div className="mt-2 flex justify-between text-xs text-muted">
        <span>{safeProgress.toFixed(0)}% saved</span>
        {safeProgress >= 100 && (
          <span className="font-semibold text-primary">Target reached</span>
        )}
      </div>
    </div>
  );
}
