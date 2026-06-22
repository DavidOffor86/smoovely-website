"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

const stats = [
  { value: 3000, suffix: "+", label: "Delivery hours completed" },
  { value: 98, suffix: "%", label: "On-time rate" },
  { value: 24, suffix: "hr", label: "Coverage" },
  { value: 30, suffix: "+", label: "Business clients" },
];

function Counter({ value, suffix, start }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!start) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.floor(v)),
    });
    return () => controls.stop();
  }, [start, value]);

  return (
    <span>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function LogisticsStats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="logistics-stats" className="bg-navy py-16 lg:py-20">
      <div ref={ref} className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  start={inView}
                />
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-green">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
