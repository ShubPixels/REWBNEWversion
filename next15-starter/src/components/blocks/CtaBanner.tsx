import Link from "next/link";
import type { WpLink } from "@/types/wp";

export interface CtaBannerData {
  title: string;
  description: string;
  primaryCta: WpLink | null;
  secondaryCta: WpLink | null;
  tone: "dark" | "light" | "accent";
}

export interface CtaBannerProps {
  data: CtaBannerData;
  blockId: string;
}

function isExternalLink(url: string): boolean {
  return /^(https?:\/\/|mailto:|tel:)/i.test(url);
}

function renderLink(link: WpLink, className: string) {
  if (isExternalLink(link.url)) {
    return (
      <a href={link.url} target={link.target ?? "_blank"} rel="noreferrer" className={className}>
        {link.label}
      </a>
    );
  }

  return (
    <Link href={link.url} className={className}>
      {link.label}
    </Link>
  );
}

function getToneClasses(tone: CtaBannerData["tone"]): string {
  if (tone === "light") {
    return "border border-slate-200 bg-white text-slate-900";
  }
  if (tone === "accent") {
    return "bg-cyan-600 text-white";
  }
  return "bg-slate-900 text-white";
}

export default function CtaBanner({ data, blockId }: CtaBannerProps) {
  const toneClasses = getToneClasses(data.tone);

  return (
    <section id={blockId} className="mx-auto w-full max-w-7xl px-4 py-16">
      <div className={`rounded-2xl p-8 md:p-10 ${toneClasses}`}>
        {data.title ? <h2 className="text-3xl font-semibold tracking-tight">{data.title}</h2> : null}
        {data.description ? <p className="mt-3 max-w-3xl text-sm md:text-base">{data.description}</p> : null}
        {(data.primaryCta || data.secondaryCta) ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {data.primaryCta
              ? renderLink(
                  data.primaryCta,
                  "inline-flex rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100",
                )
              : null}
            {data.secondaryCta
              ? renderLink(
                  data.secondaryCta,
                  "inline-flex rounded-md border border-current px-4 py-2 text-sm font-medium hover:bg-white/10",
                )
              : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
