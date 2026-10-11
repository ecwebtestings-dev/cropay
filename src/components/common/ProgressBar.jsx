
export default function ProgressBar({
  value = 0,
  label = "Progress",
  barClass = "bg-primary-500",
  className = "",
}) {
  const percent = Math.min(100, Math.max(0, Math.round(Number(value) || 0)));

  return (
    <div
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={`h-2 overflow-hidden rounded-full bg-bg ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ${barClass}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}