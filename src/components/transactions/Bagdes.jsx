

const STATUS_STYLES = {
  pending: {
    label: "Pending",
    style: "text-amber-700",
  },
  processing: {
    label: "Processing",
    style: " text-blue-700",
  },
  success: {
    label: "Success",
    style: "text-emerald-700",
  },
  failed: {
    label: "Failed",
    style: "text-red-700",
  },
  other: {
    label: "",
    style: "text-slate-600",
  },
};


export function StatusBadge({ statusKey, statusText }) {
  const { label, style } = STATUS_STYLES[statusKey] ?? STATUS_STYLES.other;

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap text-xs font-medium capitalize ${style}`}
    >
      {label || statusText || "Unknown"}
    </span>
  );
}

const DIRECTION_STYLES = {deposit: "text-emerald-900",withdrawal: " text-muted",};

export function DirectionBadge({ direction }) {
  return (
    <span
      className={`px-2.5 py-1 text-xs capitalise tracking-wide ${DIRECTION_STYLES[direction] ?? "bg-slate-100 text-slate-600"}`}
    >
      {direction}
    </span>
  );
}
