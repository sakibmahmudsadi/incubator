export type AccentName = "rose" | "sky" | "violet" | "teal" | "cyan";

export interface MetricTheme {
  accent: AccentName;
  chartColor: string;
  textClass: string;
  iconClass: string;
  glowClass: string;
  borderClass: string;
  progressClass: string;
}

export const metricThemes: Record<AccentName, MetricTheme> = {
  rose: {
    accent: "rose",
    chartColor: "#be123c", // Premium Red
    textClass: "text-red-700 dark:text-red-400",
    iconClass: "bg-red-50 text-red-700 ring-1 ring-red-200/60 dark:bg-red-950/20 dark:text-red-400 dark:ring-red-900/30",
    glowClass: "from-red-500/12 via-red-500/4 to-transparent",
    borderClass: "hover:border-red-300/30",
    progressClass: "bg-red-600 dark:bg-red-500",
  },
  sky: {
    accent: "sky",
    chartColor: "#4f46e5", // Premium Indigo-Blue
    textClass: "text-indigo-700 dark:text-indigo-400",
    iconClass: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200/60 dark:bg-indigo-950/20 dark:text-indigo-400 dark:ring-indigo-900/30",
    glowClass: "from-indigo-500/12 via-indigo-500/4 to-transparent",
    borderClass: "hover:border-indigo-300/30",
    progressClass: "bg-indigo-600 dark:bg-indigo-500",
  },
  violet: {
    accent: "violet",
    chartColor: "#be123c", // Consolidated Red (matching heart rate)
    textClass: "text-red-700 dark:text-red-400",
    iconClass: "bg-red-50 text-red-700 ring-1 ring-red-200/60 dark:bg-red-950/20 dark:text-red-400 dark:ring-red-900/30",
    glowClass: "from-red-500/12 via-red-500/4 to-transparent",
    borderClass: "hover:border-red-300/30",
    progressClass: "bg-red-600 dark:bg-red-500",
  },
  teal: {
    accent: "teal",
    chartColor: "#4f46e5", // Consolidated Indigo-Blue (matching SpO2)
    textClass: "text-indigo-700 dark:text-indigo-400",
    iconClass: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200/60 dark:bg-indigo-950/20 dark:text-indigo-400 dark:ring-indigo-900/30",
    glowClass: "from-indigo-500/12 via-indigo-500/4 to-transparent",
    borderClass: "hover:border-indigo-300/30",
    progressClass: "bg-indigo-600 dark:bg-indigo-500",
  },
  cyan: {
    accent: "cyan",
    chartColor: "#4f46e5", // Consolidated Indigo-Blue (matching SpO2)
    textClass: "text-indigo-700 dark:text-indigo-400",
    iconClass: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200/60 dark:bg-indigo-950/20 dark:text-indigo-400 dark:ring-indigo-900/30",
    glowClass: "from-indigo-500/12 via-indigo-500/4 to-transparent",
    borderClass: "hover:border-indigo-300/30",
    progressClass: "bg-indigo-600 dark:bg-indigo-500",
  },
};
