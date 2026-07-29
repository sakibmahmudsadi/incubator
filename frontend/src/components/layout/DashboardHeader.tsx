import { Baby, Clock3 } from "lucide-react";
import ConnectionIndicator from "../common/ConnectionIndicator";
import type { ConnectionState } from "../../types/sensor";
import { formatClock, formatRelativeTime } from "../../utils/format";

interface DashboardHeaderProps {
  connectionState: ConnectionState;
  currentTime: Date;
  lastUpdate: Date | null;
}

export default function DashboardHeader({
  connectionState,
  currentTime,
  lastUpdate,
}: DashboardHeaderProps) {
  const updateLabel = lastUpdate ? `Updated ${formatRelativeTime(lastUpdate, currentTime)}` : "Waiting for data";

  return (
    <header className="flex flex-col gap-6 pb-8 pt-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300 backdrop-blur-xl">
          <Baby size={15} aria-hidden />
          made by SS
        </div>
        <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-normal text-white md:text-6xl">
          Infant Incubator Monitoring System
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400 md:text-lg">
          Real-time vital telemetry from ESP32 sensors with clinical threshold monitoring.
        </p>
      </div>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
        <ConnectionIndicator state={connectionState} />
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-zinc-200 backdrop-blur-xl">
          <Clock3 size={16} aria-hidden />
          {formatClock(currentTime)}
        </div>
        <div className="inline-flex rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-zinc-300 backdrop-blur-xl">
          {updateLabel}
        </div>
      </div>
    </header>
  );
}
