import Image from "next/image";
import Link from "next/link";
import type { WpLink, WpMedia } from "@/types/wp";

export interface SplitContentMediaData {
  eyebrow: string;
  title: string;
  description: string;
  body: string;
  media: WpMedia | null;
  cta: WpLink | null;
  reverse: boolean;
}

export interface SplitContentMediaProps {
  data: SplitContentMediaData;
  blockId: string;
}

function isExternalLink(url: string): boolean {
  return /^(https?:\/\/|mailto:|tel:)/i.test(url);
}

export default function SplitContentMedia({ data, blockId }: SplitContentMediaProps) {
  const directionClass = data.reverse ? "lg:flex-row-reverse" : "lg:flex-row";

  return (
    <section id={blockId} className="mx-auto w-full max-w-7xl px-4 py-16">
      <div className={`flex flex-col gap-8 ${directionClass}`}>
        <div className="flex-1 space-y-4">
          {data.eyebrow ? <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{data.eyebrow}</p> : null}
          {data.title ? <h2 className="text-3xl font-semibold tracking-tight text-slate-900">{data.title}</h2> : null}
          {data.description ? <p className="text-base text-slate-700">{data.description}</p> : null}
          {data.body ? <p className="text-sm leading-relaxed text-slate-600 md:text-base">{data.body}</p> : null}
          {data.cta ? (
            isExternalLink(data.cta.url) ? (
              <a
                href={data.cta.url}
                target={data.cta.target ?? "_blank"}
                rel="noreferrer"
                className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                {data.cta.label}
              </a>
            ) : (
              <Link href={data.cta.url} className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
                {data.cta.label}
              </Link>
            )
          ) : null}
        </div>

        <div className="relative flex-1 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          {data.media ? (
            <Image
              src={data.media.url}
              alt={data.media.alt || data.title}
              width={960}
              height={640}
              className="h-full w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="flex min-h-72 items-center justify-center text-sm text-slate-500">Media unavailable</div>
          )}
        </div>
      </div>
    </section>
  );
}
