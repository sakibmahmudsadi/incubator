import { useId } from "react";
import { motion } from "framer-motion";
import {
  CartesianGrid,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import LoadingSkeleton from "../common/LoadingSkeleton";
import type { SensorReading } from "../../types/sensor";

export interface ChartSeries {
  dataKey: keyof Pick<SensorReading, "heartRate" | "spo2" | "bodyTemp" | "airTemp" | "humidity">;
  name: string;
  color: string;
  unit: string;
}

interface VitalLineChartProps {
  title: string;
  subtitle: string;
  data: SensorReading[];
  series: ChartSeries[];
  loading?: boolean;
  compact?: boolean;
  hideHeader?: boolean;
  domain?: [number | "auto", number | "auto"];
  tickFormatter?: (value: number) => string;
}

interface TooltipPayload {
  color?: string;
  dataKey?: string | number;
  name?: string | number;
  value?: string | number | Array<string | number>;
}

function ChartTooltip({
  active,
  payload,
  label,
  series,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string | number;
  series: ChartSeries[];
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-white/60 bg-white/70 px-4 py-3 shadow-xl shadow-slate-200/40 backdrop-blur-2xl dark:border-white/10 dark:bg-[#1a1d24]/80 dark:shadow-2xl dark:shadow-black/50">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-500">{label}</p>
      <div className="space-y-2">
        {payload.map((item) => {
          const config = series.find((entry) => entry.dataKey === item.dataKey);
          const value = Array.isArray(item.value) ? item.value.join(" - ") : item.value;

          return (
            <div key={`${item.dataKey}`} className="flex items-center justify-between gap-8">
              <span className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 dark:text-zinc-300">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-zinc-50">
                {value} <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">{config?.unit}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function VitalLineChart({
  title,
  subtitle,
  data,
  series,
  loading = false,
  compact = false,
  hideHeader = false,
  domain,
  tickFormatter,
}: VitalLineChartProps) {
  const chartHeight = compact ? "h-full min-h-[96px]" : "h-72";
  const chartId = useId().replace(/:/g, "");
  
  // Use a stable gray that looks good in both light and dark modes
  const axisTickColor = "#8e8e93"; 
  const gridColor = "rgba(142, 142, 147, 0.12)";

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="flex h-full flex-col"
    >
      {!hideHeader ? (
        <div className="mb-2 flex items-start justify-between gap-2">
          <div>
            <h2 className={`font-bold tracking-tight text-slate-800 dark:text-white ${compact ? "text-base" : "text-xl"}`}>{title}</h2>
            <p className={`font-medium text-slate-500 dark:text-zinc-400 ${compact ? "text-xs" : "mt-1 text-sm"}`}>{subtitle}</p>
          </div>
        </div>
      ) : null}

      <div className="flex-1 min-h-0">
        {loading ? (
          <LoadingSkeleton className={`w-full ${compact ? "h-full min-h-[96px]" : "h-72"}`} />
        ) : data.length === 0 ? (
          <div className={`flex w-full items-center justify-center rounded-xl border border-black/10 bg-slate-50/50 font-semibold text-slate-500 dark:border-white/5 dark:bg-white/[0.02] dark:text-zinc-500 ${compact ? "h-full min-h-[96px] text-xs" : "h-72 text-sm"}`}>
            Waiting for data
          </div>
        ) : (
          <div className={`${chartHeight} relative overflow-hidden rounded-xl`}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 14, left: 4, bottom: 0 }}>
                <defs>
                  {series.map((entry) => (
                    <linearGradient key={`${entry.dataKey}-gradient`} id={`${chartId}-${entry.dataKey}-gradient`} x1="0" y1="0" x2="0" y2="1">
                      <stop 
                        offset="5%" 
                        stopColor={entry.color} 
                        stopOpacity={entry.dataKey === "heartRate" ? 0.38 : 0.22} 
                      />
                      <stop 
                        offset="95%" 
                        stopColor={entry.color} 
                        stopOpacity={0.0} 
                      />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid stroke={gridColor} strokeDasharray="3 3" strokeLinecap="round" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: axisTickColor, fontSize: 11, fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={compact ? 28 : 24}
                  dy={10}
                />
                <YAxis
                  tick={{ fill: axisTickColor, fontSize: 11, fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                  width={compact ? 42 : 52}
                  domain={domain ?? ["auto", "auto"]}
                  tickFormatter={tickFormatter}
                  dx={-10}
                />
                <Tooltip
                  content={<ChartTooltip series={series} />}
                  cursor={{ stroke: axisTickColor, strokeWidth: 1, strokeDasharray: "4 4", opacity: 0.5 }}
                />
                {series.map((entry) => (
                  <Area
                    key={entry.dataKey}
                    type="natural"
                    dataKey={entry.dataKey}
                    name={entry.name}
                    stroke={entry.color}
                    fill={series.length > 1 ? "none" : `url(#${chartId}-${entry.dataKey}-gradient)`}
                    strokeWidth={compact ? 2.5 : 3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    dot={false}
                    activeDot={{
                      r: compact ? 5 : 6,
                      stroke: "#ffffff",
                      strokeWidth: 2.5,
                      fill: entry.color,
                    }}
                    isAnimationActive
                    animationDuration={1000}
                    animationEasing="ease-out"
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.section>
  );
}
