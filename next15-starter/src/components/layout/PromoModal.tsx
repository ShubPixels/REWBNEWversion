"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { WpPromoModalData } from "@/types/wp";

interface PromoModalProps {
  promo: WpPromoModalData;
}

function isExternalLink(url: string): boolean {
  return /^(https?:\/\/|mailto:|tel:)/i.test(url);
}

export default function PromoModal({ promo }: PromoModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = promo.slides;
  const canShow = promo.enabled && slides.length > 0;

  useEffect(() => {
    if (!canShow) {
      return;
    }

    const openTimer = window.setTimeout(() => {
      setIsOpen(true);
    }, promo.delayMs);

    return () => {
      window.clearTimeout(openTimer);
    };
  }, [canShow, promo.delayMs]);

  useEffect(() => {
    if (!isOpen || slides.length < 2) {
      return;
    }

    const rotateTimer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, promo.autoRotateMs);

    return () => {
      window.clearInterval(rotateTimer);
    };
  }, [isOpen, promo.autoRotateMs, slides.length]);

  const activeSlide = useMemo(() => slides[activeIndex] ?? null, [activeIndex, slides]);

  if (!canShow || !isOpen || !activeSlide) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        onClick={() => setIsOpen(false)}
        aria-label="Close promotional modal"
      />
      <article className="relative z-[91] w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-sm text-slate-700 shadow hover:text-slate-950"
          aria-label="Close"
        >
          ✕
        </button>

        {activeSlide.image ? (
          <div className="relative h-64 w-full">
            <Image
              src={activeSlide.image.url}
              alt={activeSlide.image.alt || activeSlide.heading || "Promotional slide"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 640px"
            />
          </div>
        ) : null}

        <div className="space-y-4 p-6">
          {activeSlide.heading ? <h2 className="text-2xl font-semibold text-slate-900">{activeSlide.heading}</h2> : null}
          {activeSlide.description ? <p className="text-sm text-slate-600">{activeSlide.description}</p> : null}

          {activeSlide.cta ? (
            isExternalLink(activeSlide.cta.url) ? (
              <a
                href={activeSlide.cta.url}
                target={activeSlide.cta.target ?? "_blank"}
                rel="noreferrer"
                className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                {activeSlide.cta.label}
              </a>
            ) : (
              <Link
                href={activeSlide.cta.url}
                className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                {activeSlide.cta.label}
              </Link>
            )
          ) : null}

          {slides.length > 1 ? (
            <div className="flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 w-2.5 rounded-full ${
                    index === activeIndex ? "bg-slate-900" : "bg-slate-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </article>
    </div>
  );
}
