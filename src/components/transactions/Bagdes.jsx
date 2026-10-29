

const STATUS_STYLES = {
  pending: {
    label: "Pending",
    style: "text-amber-500",
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
      className={`inline-flex items-center whitespace-nowrap text-sm font-medium capitalize ${style}`}
    >
      {label || statusText || "Unknown"}
    </span>
  );
}

const DIRECTION_STYLES = {deposit: "text-sidebar",withdrawal: " text-muted",};

export function DirectionBadge({ direction }) {
  return (
    <span
      className={`px-2.5 py-1 text-sm uppercase tracking-tight ${DIRECTION_STYLES[direction] ?? " text-heading"}`}
    >
      {direction}
    </span>
  );
}
