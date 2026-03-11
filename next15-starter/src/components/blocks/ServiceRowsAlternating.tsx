import Image from "next/image";
import Link from "next/link";
import { getSafeMediaAlt, getSafeMediaUrl } from "@/lib/wp/media";
import type { WpLink, WpMedia } from "@/types/wp";

export interface ServiceRowItem {
  title: string;
  description: string;
  image: WpMedia | null;
  cta: WpLink | null;
}

export interface ServiceRowsAlternatingData {
  title: string;
  rows: ServiceRowItem[];
}

export interface ServiceRowsAlternatingProps {
  data: ServiceRowsAlternatingData;
  blockId: string;
}

function isExternalLink(url: string): boolean {
  return /^(https?:\/\/|mailto:|tel:)/i.test(url);
}

export default function ServiceRowsAlternating({ data, blockId }: ServiceRowsAlternatingProps) {
  if (data.rows.length === 0) {
    return null;
  }

  return (
    <section id={blockId} className="mx-auto w-full max-w-7xl px-4 py-16">
      {data.title ? <h2 className="mb-8 text-3xl font-semibold tracking-tight text-slate-900">{data.title}</h2> : null}
      <div className="space-y-6">
        {data.rows.map((row, index) => {
          const reverseClass = index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row";
          const imageUrl = getSafeMediaUrl(row.image);
          const imageAlt = getSafeMediaAlt(row.image, row.title);

          return (
            <article
              key={`${row.title}-${index + 1}`}
              className={`flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ${reverseClass}`}
            >
              <div className="relative h-72 flex-1 bg-slate-100">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-500">Image unavailable</div>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-center p-6 md:p-8">
                <h3 className="text-2xl font-semibold text-slate-900">{row.title}</h3>
                {row.description ? <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">{row.description}</p> : null}
                {row.cta ? (
                  isExternalLink(row.cta.url) ? (
                    <a
                      href={row.cta.url}
                      target={row.cta.target ?? "_blank"}
                      rel="noreferrer"
                      className="mt-5 inline-flex w-fit rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                    >
                      {row.cta.label}
                    </a>
                  ) : (
                    <Link
                      href={row.cta.url}
                      className="mt-5 inline-flex w-fit rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                    >
                      {row.cta.label}
                    </Link>
                  )
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
