import type { StatusLevel } from "../../types/status";
import { statusLabel } from "../../utils/status";

interface StatusBadgeProps {
  level: StatusLevel;
  compact?: boolean;
}

const badgeClasses: Record<StatusLevel, string> = {
  normal: "border-indigo-200/50 bg-indigo-50 text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300",
  warning: "border-red-200/50 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300",
};

const dotClasses: Record<StatusLevel, string> = {
  normal: "bg-indigo-500 dark:bg-indigo-300",
  warning: "bg-red-500 dark:bg-red-300",
};

export default function StatusBadge({ level, compact = false }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-black uppercase tracking-normal ${badgeClasses[level]} ${
        compact ? "px-2 py-1 text-[9px]" : "px-3 py-1.5 text-xs"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotClasses[level]}`} />
      {statusLabel(level)}
    </span>
  );
}
