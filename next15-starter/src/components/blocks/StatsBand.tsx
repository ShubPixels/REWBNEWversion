"use client";

import { useEffect, useMemo, useState } from "react";

export interface StatsBandItem {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
}

export interface StatsBandData {
  eyebrow: string;
  title: string;
  description: string;
  stats: StatsBandItem[];
}

export interface StatsBandProps {
  data: StatsBandData;
  blockId: string;
}

function useAnimatedNumber(targetValue: number, durationMs = 1200): number {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let animationFrame = 0;
    const start = performance.now();

    const tick = (time: number) => {
      const progress = Math.min((time - start) / durationMs, 1);
      setCurrent(Math.round(targetValue * progress));
      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    };

    animationFrame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [targetValue, durationMs]);

  return current;
}

function StatCard({ item }: { item: StatsBandItem }) {
  const value = useAnimatedNumber(item.value);
  const formattedValue = useMemo(() => value.toLocaleString(), [value]);

  return (
    <article className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur">
      <p className="text-3xl font-semibold text-white md:text-4xl">
        {item.prefix ?? ""}
        {formattedValue}
        {item.suffix ?? ""}
      </p>
      <p className="mt-2 text-sm text-slate-100">{item.label}</p>
    </article>
  );
}

export default function StatsBand({ data, blockId }: StatsBandProps) {
  if (data.stats.length === 0) {
    return null;
  }

  return (
    <section
      id={blockId}
      className="border-y border-slate-800 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-14">
        {data.eyebrow ? (
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-200">{data.eyebrow}</p>
        ) : null}
        {data.title ? <h2 className="mt-2 text-2xl font-semibold md:text-3xl">{data.title}</h2> : null}
        {data.description ? <p className="mt-3 max-w-2xl text-sm text-slate-200 md:text-base">{data.description}</p> : null}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.stats.map((item, index) => (
            <StatCard key={`${item.label}-${index + 1}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
