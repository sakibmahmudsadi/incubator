import { useState, useEffect, useRef } from "react";
import { CameraOff, RefreshCw, RotateCw } from "lucide-react";

interface CameraStreamProps {
  streamSource: string;
}

export default function CameraStream({ streamSource }: CameraStreamProps) {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(false);
  const [streamKey, setStreamKey] = useState(0);

  const isFullUrl = streamSource.startsWith("http://") || streamSource.startsWith("https://");
  const streamUrl = isFullUrl ? (streamSource.endsWith("/stream") ? streamSource : `${streamSource}/stream`) : `http://${streamSource}:81/stream`;

  const handleRefresh = () => {
    setError(false);
    setConnected(false);
    setStreamKey((k) => k + 1);
  };

  const [rotation, setRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }
      
      if (e.key.toLowerCase() === "f") {
        toggleFullScreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const containerClasses = "flex h-full flex-col overflow-hidden rounded-xl border border-black/15 bg-slate-50/50 dark:border-white/5 dark:bg-[#12141a]/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] transition-all duration-300";

  return (
    <div ref={containerRef} className={containerClasses}>
      <div className="flex items-center justify-between border-b border-black/10 dark:border-white/5 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">Live Feed</span>
          {connected ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/50 px-2 py-0.5 text-[9px] font-bold text-slate-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 backdrop-blur-md shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.6)]" />
              LIVE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/50 px-2 py-0.5 text-[9px] font-bold text-slate-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 backdrop-blur-md shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              CONNECTING
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRotation((r) => (r + 180) % 360)}
            className="flex items-center gap-1.5 rounded-md bg-slate-200/50 px-2.5 py-1 text-[10px] font-bold text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-900 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <RotateCw size={12} />
            Rotate
          </button>
          <button
            onClick={handleRefresh}
            className="rounded-md bg-slate-200/50 p-1 text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-900 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
            title="Refresh stream"
          >
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center p-3 sm:p-4 bg-slate-100/30 dark:bg-black/20">
        {error ? (
          <div className="flex w-full h-full flex-col items-center justify-center gap-3 rounded-xl border border-black/10 bg-slate-100 text-slate-500 dark:border-white/5 dark:bg-[#0a0b0e] dark:text-zinc-500 shadow-inner">
            <CameraOff size={32} strokeWidth={1.5} />
            <p className="text-sm font-semibold tracking-tight text-slate-900 dark:text-zinc-400">Camera offline</p>
            <button
              onClick={handleRefresh}
              className="mt-1 rounded-lg bg-white px-4 py-1.5 text-xs font-bold text-slate-700 shadow-sm border border-slate-200 transition-all hover:bg-slate-50 dark:bg-white/10 dark:text-white dark:border-white/5 dark:hover:bg-white/20"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <div 
            className="h-full w-full overflow-hidden rounded-xl border border-black/10 bg-slate-100 dark:border-white/10 dark:bg-black shadow-inner relative"
            onDoubleClick={toggleFullScreen}
          >
            <img
              key={streamKey}
              src={streamUrl}
              alt="ESP32-CAM live stream"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 touch-manipulation"
              style={{ transform: `rotate(${rotation}deg)` }}
              onLoad={() => setConnected(true)}
              onError={() => {
                setError(true);
                setConnected(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
