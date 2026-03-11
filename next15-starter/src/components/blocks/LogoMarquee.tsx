import Image from "next/image";
import Link from "next/link";
import type { WpLink, WpMedia } from "@/types/wp";

export interface LogoMarqueeItem {
  name: string;
  logo: WpMedia | null;
  link: WpLink | null;
}

export interface LogoMarqueeData {
  title: string;
  logos: LogoMarqueeItem[];
}

export interface LogoMarqueeProps {
  data: LogoMarqueeData;
  blockId: string;
}

function isExternalLink(url: string): boolean {
  return /^(https?:\/\/|mailto:|tel:)/i.test(url);
}

function LogoItem({ item }: { item: LogoMarqueeItem }) {
  const content = (
    <div className="flex min-w-40 items-center justify-center rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      {item.logo ? (
        <Image
          src={item.logo.url}
          alt={item.logo.alt || item.name}
          width={140}
          height={64}
          className="h-12 w-auto object-contain"
        />
      ) : (
        <span className="text-sm font-medium text-slate-600">{item.name}</span>
      )}
    </div>
  );

  if (!item.link) {
    return content;
  }

  if (isExternalLink(item.link.url)) {
    return (
      <a href={item.link.url} target={item.link.target ?? "_blank"} rel="noreferrer" aria-label={item.name}>
        {content}
      </a>
    );
  }

  return (
    <Link href={item.link.url} aria-label={item.name}>
      {content}
    </Link>
  );
}

export default function LogoMarquee({ data, blockId }: LogoMarqueeProps) {
  if (data.logos.length === 0) {
    return null;
  }

  const track = [...data.logos, ...data.logos];

  return (
    <section id={blockId} className="border-y border-slate-100 bg-slate-50 py-10">
      <div className="mx-auto w-full max-w-7xl px-4">
        {data.title ? <h2 className="mb-6 text-center text-xl font-semibold text-slate-900">{data.title}</h2> : null}
      </div>
      <div className="overflow-hidden">
        <div className="logo-marquee-track mx-auto flex w-max min-w-full gap-4 px-4">
          {track.map((item, index) => (
            <LogoItem key={`${item.name}-${index + 1}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
