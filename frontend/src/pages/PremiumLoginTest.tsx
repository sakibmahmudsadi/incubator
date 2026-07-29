import React, { useState, type MouseEvent, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Lock, User, ShieldAlert, ArrowRight, Activity, Hexagon } from "lucide-react";

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export default function PremiumLoginTest({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // --- 3D Tilt Effect Logic ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Springs for smooth physics-based return
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  // Transform constraints (adjust degrees for more/less extreme 3D)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // --- Ambient Background Tracking ---
  useEffect(() => {
    const updateMousePosition = (e: globalThis.MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Cinematic delay
    setTimeout(() => {
      if (username === "SADI" && password === "SAMIN") {
        if (onLoginSuccess) onLoginSuccess();
        else alert("Login Success! (Testing mode)");
      } else {
        setError("AUTHENTICATION FAILED. ACCESS DENIED.");
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030508] font-sans selection:bg-indigo-500/30">
      
      {/* Dynamic Ambient Spotlight following mouse */}
      <motion.div 
        className="pointer-events-none absolute inset-0 z-0 opacity-40 transition-opacity duration-300"
        animate={{
          background: `radial-gradient(1200px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(79, 70, 229, 0.15), transparent 40%)`
        }}
      />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Floating Particles/Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }} 
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[15%] top-[20%] z-0 h-32 w-32 rounded-full bg-indigo-600/20 blur-[60px]"
      />
      <motion.div 
        animate={{ y: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }} 
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[20%] right-[15%] z-0 h-40 w-40 rounded-full bg-rose-600/20 blur-[80px]"
      />

      {/* 3D Scene Container */}
      <div 
        className="relative z-10 flex w-full max-w-[420px] items-center justify-center p-4 [perspective:1200px]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-10 shadow-[0_0_80px_rgba(79,70,229,0.15)] backdrop-blur-3xl before:absolute before:inset-0 before:-z-10 before:rounded-[2.5rem] before:bg-gradient-to-b before:from-white/5 before:to-transparent before:opacity-50"
        >
          {/* Card Inner Glow */}
          <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] border border-white/5 mix-blend-overlay" />

          {/* Logo / Icon - Elevated in 3D */}
          <div 
            style={{ transform: "translateZ(60px)" }}
            className="mb-10 flex flex-col items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
              className="relative mb-6 flex h-20 w-20 items-center justify-center"
            >
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/20 to-transparent backdrop-blur-md"
              />
              <Hexagon className="absolute text-indigo-400" size={40} strokeWidth={1} />
              <Activity className="absolute text-white" size={20} strokeWidth={2} />
            </motion.div>

            <h1 className="text-2xl font-light tracking-[0.2em] text-white">
              NEXUS<span className="font-bold text-indigo-400">OS</span>
            </h1>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-400/60">
              Biometric Incubator
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6" style={{ transformStyle: "preserve-3d" }}>
            
            {/* Input Group - Pushed slightly forward */}
            <div className="group relative" style={{ transform: "translateZ(30px)" }}>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500 transition-colors group-focus-within:text-indigo-400">
                <User size={18} strokeWidth={1.5} />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="IDENTIFIER"
                className="w-full rounded-2xl border border-white/10 bg-black/20 py-4 pl-12 pr-4 text-sm font-medium tracking-widest text-white outline-none backdrop-blur-md transition-all placeholder:text-zinc-600 focus:border-indigo-500/50 focus:bg-indigo-500/10 focus:shadow-[0_0_20px_rgba(79,70,229,0.2)]"
              />
            </div>

            <div className="group relative" style={{ transform: "translateZ(30px)" }}>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500 transition-colors group-focus-within:text-indigo-400">
                <Lock size={18} strokeWidth={1.5} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="PASSCODE"
                className="w-full rounded-2xl border border-white/10 bg-black/20 py-4 pl-12 pr-4 text-sm font-medium tracking-widest text-white outline-none backdrop-blur-md transition-all placeholder:text-zinc-600 focus:border-indigo-500/50 focus:bg-indigo-500/10 focus:shadow-[0_0_20px_rgba(79,70,229,0.2)]"
              />
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.8 }}
                  animate={{ opacity: 1, height: "auto", scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.8 }}
                  style={{ transform: "translateZ(40px)" }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-[11px] font-bold tracking-widest text-rose-400 backdrop-blur-md">
                    <ShieldAlert size={14} />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button - Elevated */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ transform: "translateZ(50px)" }}
              className="group relative mt-2 flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white py-4 text-xs font-bold tracking-[0.2em] text-black transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2 text-indigo-600">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                  AUTHENTICATING...
                </span>
              ) : (
                <>
                  <span className="relative z-10 transition-colors group-hover:text-white">INITIATE LINK</span>
                  <ArrowRight size={16} className="relative z-10 transition-colors group-hover:text-white" />
                  {/* Hover reveal gradient */}
                  <div className="absolute inset-0 z-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </>
              )}
            </motion.button>

          </form>
          
          {/* Decorative Corner Borders */}
          <div className="absolute left-6 top-6 h-4 w-4 border-l-2 border-t-2 border-white/20" />
          <div className="absolute right-6 top-6 h-4 w-4 border-r-2 border-t-2 border-white/20" />
          <div className="absolute bottom-6 left-6 h-4 w-4 border-b-2 border-l-2 border-white/20" />
          <div className="absolute bottom-6 right-6 h-4 w-4 border-b-2 border-r-2 border-white/20" />
        </motion.div>
      </div>
    </div>
  );
}
