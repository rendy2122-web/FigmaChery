"use client";

import { useEffect, useState } from "react";
import { useSpring } from "motion/react";
import { formatRupiah } from "@/lib/murabaha";

export function AnimatedRupiah({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 140, damping: 22, mass: 0.6 });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => setDisplay(v));
    return unsubscribe;
  }, [spring]);

  return <>{formatRupiah(display)}</>;
}
