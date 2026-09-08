import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import {
  Activity,
  Droplets,
  Heart,
  ShieldCheck,
  Thermometer,
  Wind,
  Sun,
  Moon,
  WifiOff,
} from "lucide-react";

import CameraStream from "../components/camera/CameraStream";
import VitalLineChart from "../components/charts/VitalLineChart";
import AnimatedNumber from "../components/common/AnimatedNumber";
import StatusBadge from "../components/common/StatusBadge";
import { metricThemes, type AccentName } from "../constants/theme";
import { useCurrentTime } from "../hooks/useCurrentTime";
import { useSensorMonitor } from "../hooks/useSensorMonitor";
import type { SensorData } from "../types/sensor";
import type { StatusLevel } from "../types/status";
import { formatClock } from "../utils/format";
import { getMetricStatuses, getSystemStatus, statusLabel } from "../utils/status";

const STREAM_SOURCE = (import.meta.env.VITE_API_URL || "http://localhost:3000") + "/api";

type MetricId = keyof Pick<SensorData, "heartRate" | "spo2" | "bodyTemp" | "airTemp" | "humidity">;

interface MetricConfig {
  id: MetricId;
  label: string;
  unit: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  accent: AccentName;
  decimals: number;
  range: string;
}

const vitalMetrics: MetricConfig[] = [
  { id: "heartRate", label: "Heart", unit: "BPM", icon: Heart, accent: "rose", decimals: 0, range: "60-100" },
  { id: "spo2", label: "SpO\u2082", unit: "%", icon: Activity, accent: "sky", decimals: 0, range: "95-100" },
  { id: "bodyTemp", label: "Body", unit: "\u00b0C", icon: Thermometer, accent: "violet", decimals: 1, range: "30-35" },
  { id: "airTemp", label: "Air", unit: "\u00b0C", icon: Wind, accent: "teal", decimals: 1, range: "30-40" },
  { id: "humidity", label: "Humidity", unit: "%", icon: Droplets, accent: "cyan", decimals: 0, range: "50-100" },
];

const statusTone: Record<StatusLevel, string> = {
  normal: "border-indigo-200/50 bg-indigo-100/50 text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300",
  warning: "border-red-200/50 bg-red-100/50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300",
};

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (root.classList.contains("dark")) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center h-9 w-9 rounded-full border border-black/15 bg-white/50 text-slate-800 transition-all hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:bg-white/10 backdrop-blur-md shadow-sm"
      aria-label="Toggle Theme"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

function Panel({
  children,
  className = "",
  innerClassName = "",
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <section className={`min-h-0 overflow-hidden rounded-2xl border border-black/15 bg-white/60 shadow-xl shadow-slate-200/40 backdrop-blur-3xl transition-all duration-300 dark:border-white/10 dark:bg-[#12141a]/60 dark:shadow-2xl dark:shadow-black/50 ${className}`}>
      <div className={`h-full min-h-0 ${innerClassName}`}>{children}</div>
    </section>
  );
}

function SectionTitle({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-600 dark:text-zinc-500">{title}</p>
        {detail ? <p className="mt-1 lg:mt-0 text-xs font-medium text-slate-400 dark:text-zinc-400">{detail}</p> : null}
      </div>
    </div>
  );
}

function MetricTile({
  metric,
  value,
  level,
  loading,
  className = "",
}: {
  metric: MetricConfig;
  value: number | null;
  level: StatusLevel;
  loading: boolean;
  className?: string;
}) {
  const Icon = metric.icon;
  const theme = metricThemes[metric.accent];

  return (
    <div className={`group relative flex min-h-[115px] flex-col justify-between overflow-hidden rounded-2xl border border-black/15 bg-white/70 p-3.5 shadow-lg shadow-slate-200/30 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-white/5 dark:bg-[#1a1d24]/50 dark:shadow-none dark:hover:bg-[#1e222a]/70 ${className}`}>
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-30" style={{ background: theme.chartColor }} />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-zinc-500">{metric.label}</p>
          <p className="mt-0.5 text-[11px] font-medium text-slate-400 dark:text-zinc-500">{metric.range}</p>
        </div>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-sm ${theme.iconClass}`}>
          <Icon size={16} />
        </div>
      </div>

      <div className="relative mt-2">
        <div className="flex items-end gap-1.5">
          <span className="text-[34px] font-bold leading-none tracking-tight text-slate-950 dark:text-zinc-50">
            {loading ? "--" : value === -127 ? (
              <span className="text-[14px] text-red-500 font-extrabold uppercase tracking-widest">Disconnect</span>
            ) : (
              <AnimatedNumber value={value} decimals={metric.decimals} />
            )}
          </span>
          {value !== -127 && (
            <span className={`pb-1 text-xs font-bold ${theme.textClass}`}>{metric.unit}</span>
          )}
        </div>
        <div className="mt-2">
          <StatusBadge level={level} compact />
        </div>
      </div>
    </div>
  );
}

function SystemBadge({ level }: { level: StatusLevel }) {
  return (
    <div className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold shadow-sm backdrop-blur-md ${statusTone[level]}`}>
      <ShieldCheck size={16} />
      <span className="hidden sm:inline whitespace-nowrap">{statusLabel(level)}</span>
    </div>
  );
}

export default function Dashboard() {
  const { data, history, loading, connectionState } = useSensorMonitor();
  const currentTime = useCurrentTime();
  const statuses = getMetricStatuses(data);
  const overall = statuses.length > 0 ? getSystemStatus(statuses) : "warning";
  const statusById = Object.fromEntries(statuses.map((status) => [status.id, status.level])) as Partial<Record<MetricId, StatusLevel>>;
  const fallbackLevel: StatusLevel = data ? "normal" : "warning";

  return (
    <main className="min-h-screen overflow-y-auto bg-slate-50 text-slate-900 dark:bg-[#060709] dark:text-white lg:h-screen lg:overflow-hidden relative">
      {/* Premium ambient background blur */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-[10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-rose-400/5 blur-[120px] dark:bg-rose-500/10" />
        <div className="absolute -right-[10%] bottom-[-10%] h-[40%] w-[40%] rounded-full bg-sky-400/5 blur-[120px] dark:bg-sky-500/10" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col lg:h-full lg:min-h-0 p-2 sm:p-4 gap-3">
        <header className="sticky top-2 sm:top-4 z-50 flex min-h-[72px] shrink-0 items-center justify-between gap-3 rounded-2xl border border-black/15 bg-white/60 px-4 py-3 shadow-lg shadow-slate-200/30 backdrop-blur-3xl dark:border-white/10 dark:bg-[#12141a]/60 dark:shadow-xl dark:shadow-black/20 sm:px-6">
          
          {/* Left: Title */}
          <div className="flex flex-1 min-w-0 items-center">
            <div className="min-w-0">
              <h1 className="truncate text-base font-bold tracking-tight text-slate-950 dark:text-zinc-50 sm:text-xl">Infant Incubator</h1>
              <p className="hidden text-xs font-semibold text-slate-600 dark:text-zinc-400 sm:block">Monitor & Analytics</p>
            </div>
          </div>

          {/* Center: SystemBadge (Desktop only) */}
          <div className="hidden sm:flex flex-1 justify-center items-center">
            {connectionState === "disconnected" ? (
              <div className="flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold shadow-sm backdrop-blur-md border-red-500/20 bg-red-500/10 text-red-500">
                <WifiOff size={16} />
                <span className="hidden sm:inline whitespace-nowrap">OFFLINE</span>
              </div>
            ) : (
              <SystemBadge level={overall} />
            )}
          </div>

          {/* Right: Controls */}
          <div className="flex flex-1 shrink-0 items-center justify-end gap-2 sm:gap-3">
            <div className="hidden items-center justify-center rounded-full border border-black/15 bg-white/50 px-4 py-2 text-xs font-bold text-slate-800 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 sm:flex">
              {formatClock(currentTime)}
            </div>
            
            <ThemeToggle />
            
            {/* SystemBadge (Mobile only, right side of theme toggle) */}
            <div className="flex sm:hidden">
              <SystemBadge level={overall} />
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1">
          <div className="grid min-h-0 gap-x-3 gap-y-6 lg:gap-y-4 lg:h-full lg:grid-cols-12 lg:grid-rows-[minmax(0,1.08fr)_minmax(210px,0.92fr)]">
            <Panel className="order-1 lg:order-none lg:col-start-1 lg:col-span-5 lg:row-start-1 min-h-[260px]">
              <CameraStream streamSource={STREAM_SOURCE} />
            </Panel>

            <Panel className="order-2 lg:order-none lg:col-start-1 lg:col-span-7 lg:row-start-2" innerClassName="p-4 sm:p-5">
              <div className="grid h-full min-h-0 grid-cols-2 gap-3 lg:grid-cols-5">
                {vitalMetrics.map((metric, index) => (
                  <MetricTile
                    key={metric.id}
                    metric={metric}
                    value={data ? data[metric.id] : null}
                    level={statusById[metric.id] ?? fallbackLevel}
                    loading={loading}
                    className={index === 4 ? "col-span-2 lg:col-span-1" : ""}
                  />
                ))}
              </div>
            </Panel>

            <div className="order-3 lg:order-none lg:col-start-6 lg:col-span-7 lg:row-start-1 grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-[260px]">
              <Panel className="h-full flex flex-col" innerClassName="p-3 sm:p-4 h-full flex flex-col">
                <VitalLineChart
                  title="Temperature"
                  subtitle="Body vs air"
                  data={history}
                  loading={loading}
                  compact
                  domain={["auto", "auto"]}
                  series={[
                    { dataKey: "bodyTemp", name: "Body", color: metricThemes.violet.chartColor, unit: "\u00b0C" },
                    { dataKey: "airTemp", name: "Air", color: metricThemes.teal.chartColor, unit: "\u00b0C" },
                  ]}
                />
              </Panel>

              <Panel className="h-full flex flex-col" innerClassName="p-3 sm:p-4 h-full flex flex-col">
                <VitalLineChart
                  title="Humidity"
                  subtitle="Chamber"
                  data={history}
                  loading={loading}
                  compact
                  domain={["auto", "auto"]}
                  series={[{ dataKey: "humidity", name: "Humidity", color: metricThemes.cyan.chartColor, unit: "%" }]}
                />
              </Panel>
            </div>

            <Panel className="order-5 lg:order-none lg:col-start-8 lg:col-span-5 lg:row-start-2" innerClassName="p-5 sm:p-6">
              <div className="flex h-full min-h-0 flex-col gap-4">
                <SectionTitle title="Heart Rate" detail="Real-time pulse" />
                <div className="min-h-0 flex-1">
                  <VitalLineChart
                    title=""
                    subtitle=""
                    data={history}
                    loading={loading}
                    compact
                    hideHeader
                    domain={["auto", "auto"]}
                    series={[
                      {
                        dataKey: "heartRate",
                        name: "Heart Rate",
                        color: metricThemes.rose.chartColor,
                        unit: "BPM",
                      },
                    ]}
                  />
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </main>
  );
}
