import { useEffect, useState, memo, type FormEvent, type MouseEvent } from "react";
import {
  AnimatePresence,
  motion,
  stagger,
  useAnimate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  HeartPulse,
  Hospital,
  LoaderCircle,
  LockKeyhole,
  ShieldAlert,
  UserRound,
} from "lucide-react";

interface LoginPageProps {
  onLoginSuccess: () => void;
}

type FieldName = "username" | "password";

const ACCESS_USERNAME = "SADI";
const ACCESS_PASSWORD = "SAMIN";

// ECG Path for the animated heartbeat line
const ECG_PATH =
  "M0 56 L54 56 L72 56 L84 20 L99 92 L113 38 L128 56 L192 56 L208 56 L220 30 L232 78 L244 56 L360 56";

const clinicalMarks = [
  { icon: Hospital, x: "9%", y: "16%", delay: 0 },
  { icon: HeartPulse, x: "84%", y: "19%", delay: 1.4 },
  { icon: Hospital, x: "14%", y: "76%", delay: 2.2 },
  { icon: HeartPulse, x: "78%", y: "72%", delay: 0.7 },
];

function VitalTrace({ delay }: { delay: number }) {
  return (
    <svg
      aria-hidden="true"
      className="h-full w-full"
      preserveAspectRatio="none"
      viewBox="0 0 360 112"
    >
      <defs>
        {/* Heart rate color matched exactly to the Sign In button color (#4f46e5) */}
        <linearGradient id="clinicalTrace" x1="0" x2="1" y1="0" y2="0">
          <stop stopColor="#4f46e5" />
          <stop offset="0.5" stopColor="#4f46e5" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
        {/* Glow filter for the outer drawing line */}
        <filter id="ecgGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Faint static background track */}
      <path
        d={ECG_PATH}
        fill="none"
        stroke="rgba(79, 70, 229, 0.05)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />

      {/* Outer blurred glow path (Extremely slow ambient draw: duration 8s) */}
      <motion.path
        d={ECG_PATH}
        fill="none"
        stroke="url(#clinicalTrace)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6"
        filter="url(#ecgGlow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: [0, 1, 1], opacity: [0, 0.45, 0] }}
        transition={{
          duration: 8.0,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 4.0, // 8.0s active + 4.0s pause = 12.0s total cycle
          delay: delay,
        }}
      />

      {/* Core bright path (Extremely slow ambient draw) */}
      <motion.path
        d={ECG_PATH}
        fill="none"
        stroke="url(#clinicalTrace)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
        transition={{
          duration: 8.0,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 4.0, // Synchronized with glow path
          delay: delay,
        }}
      />
    </svg>
  );
}

const ClinicalBackdrop = memo(function ClinicalBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[#fbfbfd]">
      {/* Light indigo grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(79,70,229,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(79,70,229,0.02)_1px,transparent_1px)] bg-[size:42px_42px]" />
      
      {/* Light indigo sweep laser scan (Extremely slow sweep up and down) */}
      <motion.div
        className="absolute inset-x-0 top-0 h-full bg-[linear-gradient(180deg,transparent_0%,rgba(79,70,229,0.025)_48%,transparent_56%)]"
        animate={{ y: ["-65%", "65%"] }}
        transition={{
          duration: 30,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />

      {/* Top Heartrate ECG Line (Rotated 180 degrees for symmetry) */}
      <div className="absolute inset-x-0 top-0 h-[28vh] min-h-[200px] w-full opacity-[0.22] pointer-events-none rotate-180">
        <VitalTrace delay={0} />
      </div>

      {/* Bottom Heartrate ECG Line (Alternating perfectly - 6.0s delay offset for 12.0s cycle) */}
      <div className="absolute inset-x-0 bottom-0 h-[28vh] min-h-[200px] w-full opacity-[0.22] pointer-events-none">
        <VitalTrace delay={6.0} />
      </div>

      {/* Floating Background Icons (Very slow, almost imperceptible floating) */}
      {clinicalMarks.map((mark, i) => {
        const MarkIcon = mark.icon;
        return (
          <motion.div
            key={i}
            className="absolute text-indigo-500/10"
            style={{ left: mark.x, top: mark.y }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0.1, 0.25, 0.1], scale: [0.95, 1.05, 0.95] }}
            transition={{
              duration: 20,
              delay: mark.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <MarkIcon size={28} strokeWidth={1.2} />
          </motion.div>
        );
      })}
    </div>
  );
});

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<FieldName | null>(null);

  const [scope, animate] = useAnimate();

  // 3D Parallax Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 120, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 120, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Entrance animations on mount
  useEffect(() => {
    animate(
      ".anim-item",
      { opacity: [0, 1], y: [16, 0] },
      { duration: 0.8, delay: stagger(0.1), ease: [0.16, 1, 0.3, 1] }
    );
  }, [animate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 900));

    if (username === ACCESS_USERNAME && password === ACCESS_PASSWORD) {
      await animate(
        ".login-card",
        { scale: 0.97, opacity: 0 },
        { duration: 0.4, ease: "easeInOut" }
      );
      onLoginSuccess();
    } else {
      setLoading(false);
      setError("Access Denied. Invalid credentials.");
      setPassword("");
      
      // Apple-like horizontal shake on mismatch
      animate(
        ".login-card",
        { x: [0, -10, 10, -10, 10, -6, 6, 0] },
        { duration: 0.5 }
      );
    }
  };

  return (
    <div
      ref={scope}
      className="relative flex min-h-screen items-center justify-center overflow-hidden p-4 font-sans select-none"
    >
      {/* Inject custom premium UI font (Inter) dynamically */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
      
      <ClinicalBackdrop />

      <div
        className="relative z-10 w-full max-w-[410px] [perspective:1000px]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="login-card relative w-full rounded-3xl bg-white/70 px-6 py-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl"
        >
          {/* 
            Perfect Continuous Spinning Border.
          */}
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl z-0"
            style={{
              padding: "1.5px",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          >
            <motion.div
              className="absolute top-[-50%] left-[-50%] h-[200%] w-[200%]"
              style={{
                background: "conic-gradient(from 0deg, transparent 60%, #4f46e5 100%)",
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>

          {/* Header Title */}
          <div className="anim-item flex items-center justify-start gap-2.5 mb-4.5 mt-0.5 opacity-0" style={{ transform: "translateZ(30px)" }}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-[#4f46e5] border border-indigo-100/50">
              <Hospital size={18} strokeWidth={1.5} />
            </div>
            <h1 className="text-[17px] font-extrabold tracking-wider text-slate-900 font-inter uppercase leading-none">Infant Incubator</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5" style={{ transformStyle: "preserve-3d" }}>
            
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  className="overflow-hidden"
                  style={{ transform: "translateZ(20px)" }}
                >
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 p-2.5 text-xs font-semibold text-red-700">
                    <ShieldAlert size={15} className="shrink-0 text-red-600" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Username field */}
            <div className="anim-item opacity-0" style={{ transform: "translateZ(25px)" }}>
              <div className={`relative rounded-[18px] border bg-white/50 transition-all duration-300 ${
                focusedField === "username"
                  ? "border-[#4f46e5] shadow-[0_0_0_4px_rgba(79,70,229,0.12)]"
                  : "border-slate-200"
              }`}>
                <div className="absolute inset-y-0 left-4 flex items-center text-slate-800">
                  <UserRound size={17} strokeWidth={1.8} />
                </div>
                <label className={`absolute transition-all duration-300 pointer-events-none ${
                  username || focusedField === "username"
                    ? "-top-2.5 left-3.5 text-[11px] font-bold text-slate-900 bg-white px-1.5 z-10"
                    : "top-1/2 -translate-y-1/2 left-11 text-[14px] text-slate-700 font-semibold"
                }`}>
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full rounded-[18px] py-3.5 pl-11 pr-4 text-[14px] font-bold text-slate-900 bg-transparent outline-none z-10 relative"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="anim-item opacity-0" style={{ transform: "translateZ(25px)" }}>
              <div className={`relative rounded-[18px] border bg-white/50 transition-all duration-300 ${
                focusedField === "password"
                  ? "border-[#4f46e5] shadow-[0_0_0_4px_rgba(79,70,229,0.12)]"
                  : "border-slate-200"
              }`}>
                <div className="absolute inset-y-0 left-4 flex items-center text-slate-800">
                  <LockKeyhole size={17} strokeWidth={1.8} />
                </div>
                <label className={`absolute transition-all duration-300 pointer-events-none ${
                  password || focusedField === "password"
                    ? "-top-2.5 left-3.5 text-[11px] font-bold text-slate-900 bg-white px-1.5 z-10"
                    : "top-1/2 -translate-y-1/2 left-11 text-[14px] text-slate-700 font-semibold"
                }`}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full rounded-[18px] py-3.5 pl-11 pr-4 text-[14px] font-bold text-slate-900 bg-transparent outline-none z-10 relative"
                />
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="anim-item flex gap-2.5 pt-1 opacity-0 z-10 relative" style={{ transform: "translateZ(30px)" }}>
              {/* Sign In Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01, translateY: -1.5, boxShadow: "0 6px 20px rgba(79,70,229,0.25)" }}
                whileTap={{ scale: 0.99, translateY: 0 }}
                className="flex-1 h-11 relative flex items-center justify-center gap-2 rounded-[18px] bg-white border border-[#4f46e5] text-[#4f46e5] hover:bg-[#4f46e5] hover:border-[#4f46e5] hover:text-white text-[14.5px] font-medium font-inter tracking-wide shadow-sm transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <>
                    {/* Heartbeat Pulsing Icon */}
                    <motion.span
                      animate={{
                        scale: [1, 1.2, 1, 1.15, 1, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        times: [0, 0.15, 0.3, 0.45, 0.6, 1],
                      }}
                      className="inline-flex"
                    >
                      <svg
                        className="h-[18px] w-[18px]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                      </svg>
                    </motion.span>
                    <span>Sign In</span>
                  </>
                )}
              </motion.button>

              {/* Themed Circular GitHub Button */}
              <motion.a
                href="https://github.com/sakibmahmudsadi/incubator"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, translateY: -1.5, boxShadow: "0 6px 20px rgba(79,70,229,0.1)" }}
                whileTap={{ scale: 0.95, translateY: 0 }}
                className="flex h-11 w-11 items-center justify-center rounded-[18px] border border-slate-200 bg-white text-[#4f46e5] shadow-sm transition-all hover:bg-slate-50 overflow-hidden"
              >
                <svg className="h-full w-full text-[#4f46e5]" viewBox="2 2 20 20" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </motion.a>
            </div>

          </form>

        </motion.div>
      </div>
    </div>
  );
}