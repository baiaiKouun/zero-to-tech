"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

export default function AnimatedCardGrid({ className, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const cards = ref.current.querySelectorAll(".card");
    animate(cards, {
      opacity: [0, 1],
      translateY: [24, 0],
      delay: stagger(120),     // 每张卡错开 120ms
      duration: 700,
      ease: "outBack",         // 弹性落地
    });
  }, []);

  return (
    <section ref={ref} className={className}>
      {children}
    </section>
  );
}
