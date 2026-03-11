"use client";

import { useEffect, useMemo, useState } from "react";
import type { WpFloatingContactData } from "@/types/wp";

interface FloatingContactButtonsProps {
  contact: WpFloatingContactData;
}

function sanitizePhone(value: string): string {
  return value.replace(/[^\d]/g, "");
}

function buildWhatsAppUrl(phone: string, defaultMessage: string): string | null {
  const digits = sanitizePhone(phone);
  if (!digits) {
    return null;
  }

  const encodedMessage = defaultMessage.trim() ? `?text=${encodeURIComponent(defaultMessage.trim())}` : "";
  return `https://wa.me/${digits}${encodedMessage}`;
}

export default function FloatingContactButtons({ contact }: FloatingContactButtonsProps) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 320);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const whatsappUrl = useMemo(
    () => buildWhatsAppUrl(contact.whatsappPhone, contact.whatsappDefaultMessage),
    [contact.whatsappPhone, contact.whatsappDefaultMessage],
  );

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {whatsappUrl ? (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-emerald-600"
          aria-label="Contact on WhatsApp"
        >
          <span aria-hidden="true">💬</span>
          WhatsApp
        </a>
      ) : null}

      {contact.contactPhone ? (
        <a
          href={`tel:${contact.contactPhone}`}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-slate-700"
          aria-label="Call us"
        >
          <span aria-hidden="true">📞</span>
          Call
        </a>
      ) : null}

      {contact.contactEmail ? (
        <a
          href={`mailto:${contact.contactEmail}`}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-lg ring-1 ring-slate-300 hover:bg-slate-50"
          aria-label="Email us"
        >
          <span aria-hidden="true">✉</span>
          Email
        </a>
      ) : null}

      {contact.enableBackToTop && showBackToTop ? (
        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-lg ring-1 ring-slate-300 hover:bg-slate-50"
          aria-label="Back to top"
        >
          <span aria-hidden="true">↑</span>
          Top
        </button>
      ) : null}
    </div>
  );
}
