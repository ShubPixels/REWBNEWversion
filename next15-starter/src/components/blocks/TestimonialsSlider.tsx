"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { WpMedia } from "@/types/wp";

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: WpMedia | null;
}

export interface TestimonialsSliderData {
  title: string;
  autoplayMs: number;
  testimonials: TestimonialItem[];
}

export interface TestimonialsSliderProps {
  data: TestimonialsSliderData;
  blockId: string;
}

export default function TestimonialsSlider({ data, blockId }: TestimonialsSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (data.testimonials.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % data.testimonials.length);
    }, Math.max(2000, data.autoplayMs));

    return () => window.clearInterval(timer);
  }, [data.autoplayMs, data.testimonials.length]);

  if (data.testimonials.length === 0) {
    return null;
  }

  const active = data.testimonials[activeIndex]!;

  return (
    <section id={blockId} className="border-y border-slate-100 bg-white py-16">
      <div className="mx-auto w-full max-w-5xl px-4">
        {data.title ? <h2 className="text-center text-3xl font-semibold tracking-tight text-slate-900">{data.title}</h2> : null}

        <article className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <p className="text-pretty text-lg leading-relaxed text-slate-800 md:text-xl">“{active.quote}”</p>
          <div className="mt-6 flex items-center gap-4">
            {active.avatar ? (
              <Image
                src={active.avatar.url}
                alt={active.avatar.alt || active.author}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-700">
                {active.author.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold text-slate-900">{active.author}</p>
              <p className="text-sm text-slate-600">
                {[active.role, active.company].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>

          {data.testimonials.length > 1 ? (
            <div className="mt-6 flex items-center justify-between gap-4">
              <button
                type="button"
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                onClick={() => setActiveIndex((current) => (current - 1 + data.testimonials.length) % data.testimonials.length)}
                aria-label="Previous testimonial"
              >
                Prev
              </button>
              <div className="flex items-center gap-2">
                {data.testimonials.map((item, index) => (
                  <button
                    type="button"
                    key={`${item.author}-${index + 1}`}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2.5 w-2.5 rounded-full ${index === activeIndex ? "bg-slate-900" : "bg-slate-300"}`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                onClick={() => setActiveIndex((current) => (current + 1) % data.testimonials.length)}
                aria-label="Next testimonial"
              >
                Next
              </button>
            </div>
          ) : null}
        </article>
      </div>
    </section>
  );
}
