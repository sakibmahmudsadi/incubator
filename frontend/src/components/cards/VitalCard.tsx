import { motion } from "framer-motion";
import type { ReactNode } from "react";
import AnimatedNumber from "../common/AnimatedNumber";
import LoadingSkeleton from "../common/LoadingSkeleton";
import StatusBadge from "../common/StatusBadge";
import type { MetricTheme } from "../../constants/theme";
import type { StatusLevel } from "../../types/status";

interface VitalCardProps {
  title: string;
  value: number | null;
  unit: string;
  icon: ReactNode;
  theme: MetricTheme;
  decimals?: number;
  level?: StatusLevel;
  loading?: boolean;
  pulseToken?: string | number;
  compact?: boolean;
  rangeLabel?: string;
  className?: string;
}

export default function VitalCard({
  title,
  value,
  unit,
  icon,
  theme,
  decimals = 0,
  level = "normal",
  loading = false,
  pulseToken,
  compact = false,
  rangeLabel,
  className = "",
}: VitalCardProps) {
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -2 }}
        className={`relative flex h-full min-h-[118px] flex-col justify-between overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition-colors ${theme.borderClass} ${className}`}
      >
        <div className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${theme.glowClass}`} />
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-normal text-zinc-400">{title}</p>
            {loading ? (
              <LoadingSkeleton className="mt-3 h-8 w-20" />
            ) : (
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-3xl font-black leading-none text-white xl:text-[2.25rem]">
                  <AnimatedNumber value={value} decimals={decimals} />
                </span>
                <span className={`text-xs font-bold ${theme.textClass}`}>{unit}</span>
              </div>
            )}
          </div>
          <motion.div
            key={pulseToken}
            initial={{ scale: 0.96 }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${theme.iconClass}`}
          >
            {icon}
          </motion.div>
        </div>

        <div className="mt-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className={`h-full rounded-full ${theme.progressClass}`}
              initial={{ width: "18%" }}
              animate={{ width: loading ? "18%" : "72%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="truncate text-[10px] font-semibold text-zinc-500">{rangeLabel ?? "Live threshold"}</span>
            <StatusBadge level={level} compact />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl outline-none transition-colors ${theme.borderClass}`}
      tabIndex={0}
      aria-label={`${title}: ${value === null ? "waiting for reading" : `${value} ${unit}`}`}
    >
      <div className={`absolute inset-x-0 -top-16 h-32 bg-gradient-to-b ${theme.glowClass} blur-2xl`} />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-400">{title}</p>

          {loading ? (
            <LoadingSkeleton className="mt-4 h-14 w-32" />
          ) : (
            <div className="mt-3 flex flex-wrap items-end gap-x-2 gap-y-1">
              <h2 className="text-5xl font-black leading-none tracking-normal text-white md:text-6xl">
                <AnimatedNumber value={value} decimals={decimals} />
              </h2>

              <span className={`mb-1 text-lg font-semibold ${theme.textClass}`}>{unit}</span>
            </div>
          )}
        </div>

        <motion.div
          key={pulseToken}
          initial={{ scale: 0.94 }}
          animate={{ scale: [1, 1.14, 1] }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${theme.iconClass}`}
        >
          {icon}
        </motion.div>
      </div>

      <div className="relative mt-7 flex items-center justify-between gap-4">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className={`h-full rounded-full ${theme.progressClass}`}
            initial={{ width: "18%" }}
            animate={{ width: loading ? "18%" : "72%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        <StatusBadge level={level} compact />
      </div>
    </motion.div>
  );
}
