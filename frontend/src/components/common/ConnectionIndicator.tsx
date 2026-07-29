import { motion } from "framer-motion";
import { Radio, Wifi, WifiOff } from "lucide-react";
import type { ConnectionState } from "../../types/sensor";

interface ConnectionIndicatorProps {
  state: ConnectionState;
}

export default function ConnectionIndicator({ state }: ConnectionIndicatorProps) {
  const connected = state === "connected";
  const connecting = state === "connecting";

  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/50 px-2.5 py-1 text-[10px] font-bold text-slate-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 backdrop-blur-md shadow-sm"
      aria-live="polite"
    >
      <span className="relative flex h-1.5 w-1.5">
        {(connected || connecting) && (
          <motion.span
            className={`absolute inline-flex h-full w-full rounded-full ${
              connected ? "bg-indigo-600 dark:bg-indigo-400" : "bg-indigo-400 dark:bg-indigo-300"
            }`}
            animate={{ opacity: [0.55, 0], scale: [2.2] }}
            transition={{ duration: 1.35, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <span
          className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
            connected ? "bg-indigo-600 dark:bg-indigo-400" : connecting ? "bg-indigo-400 dark:bg-indigo-300" : "bg-red-600 dark:bg-red-400"
          }`}
        />
      </span>

      {connected ? (
        <Wifi size={10} aria-hidden />
      ) : connecting ? (
        <Radio size={10} aria-hidden />
      ) : (
        <WifiOff size={10} aria-hidden />
      )}
      <span className="hidden sm:inline">{connected ? "LIVE" : connecting ? "CONNECTING" : "OFFLINE"}</span>
    </div>
  );
}
