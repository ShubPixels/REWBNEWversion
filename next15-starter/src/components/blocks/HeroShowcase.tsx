import Image from "next/image";
import Link from "next/link";
import { getSafeMediaAlt, getSafeMediaUrl } from "@/lib/wp/media";
import type { WpLink, WpMedia } from "@/types/wp";

export interface HeroShowcaseData {
  eyebrow: string;
  title: string;
  description: string;
  backgroundImage: WpMedia | null;
  primaryCta: WpLink | null;
  secondaryCta: WpLink | null;
  align: "left" | "center";
}

export interface HeroShowcaseProps {
  data: HeroShowcaseData;
  blockId: string;
}

function isExternalLink(url: string): boolean {
  return /^(https?:\/\/|mailto:|tel:)/i.test(url);
}

function CtaLink({ link, variant }: { link: WpLink; variant: "primary" | "secondary" }) {
  const className =
    variant === "primary"
      ? "inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      : "inline-flex rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100";

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

export default function HeroShowcase({ data, blockId }: HeroShowcaseProps) {
  const textAlignClass = data.align === "center" ? "text-center" : "text-left";
  const containerAlign = data.align === "center" ? "items-center" : "items-start";
  const backgroundImageUrl = getSafeMediaUrl(data.backgroundImage);
  const backgroundImageAlt = getSafeMediaAlt(data.backgroundImage, data.title);

  return (
    <section id={blockId} className="relative overflow-hidden border-b border-slate-100 bg-slate-950 text-white">
      {backgroundImageUrl ? (
        <div className="absolute inset-0 opacity-30">
          <Image
            src={backgroundImageUrl}
            alt={backgroundImageAlt}
            fill
            className="object-cover"
            sizes="100vw"
            priority={false}
          />
        </div>
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70" />
      <div className={`relative mx-auto flex w-full max-w-7xl flex-col ${containerAlign} gap-6 px-4 py-24 md:py-28`}>
        {data.eyebrow ? (
          <p className="rounded-full bg-white/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.18em]">{data.eyebrow}</p>
        ) : null}
        <h1 className={`max-w-4xl text-balance text-4xl font-semibold leading-tight md:text-6xl ${textAlignClass}`}>
          {data.title}
        </h1>
        {data.description ? (
          <p className={`max-w-2xl text-pretty text-base text-slate-200 md:text-lg ${textAlignClass}`}>{data.description}</p>
        ) : null}
        {(data.primaryCta || data.secondaryCta) ? (
          <div className="flex flex-wrap gap-3">
            {data.primaryCta ? <CtaLink link={data.primaryCta} variant="primary" /> : null}
            {data.secondaryCta ? <CtaLink link={data.secondaryCta} variant="secondary" /> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
