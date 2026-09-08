import { animate, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedNumberProps {
  value: number | null;
  decimals?: number;
}

export default function AnimatedNumber({ value, decimals = 0 }: AnimatedNumberProps) {
  const numericValue = value ?? 0;
  const motionValue = useMotionValue(numericValue);
  const [display, setDisplay] = useState(value === null ? "--" : numericValue.toFixed(decimals));

  useEffect(() => {
    if (value === null) {
      return undefined;
    }

    const controls = animate(motionValue, value, {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    });

    return () => {
      controls.stop();
    };
  }, [decimals, motionValue, value]);

  useMotionValueEvent(motionValue, "change", (latest) => {
    if (value !== null) {
      setDisplay(latest.toFixed(decimals));
    }
  });

  return <>{value === null ? "--" : display}</>;
}
