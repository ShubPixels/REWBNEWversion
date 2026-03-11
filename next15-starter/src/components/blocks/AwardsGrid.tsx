import Image from "next/image";
import { getSafeMediaAlt, getSafeMediaUrl } from "@/lib/wp/media";
import type { WpMedia } from "@/types/wp";

export interface AwardItem {
  title: string;
  subtitle: string;
  year: string;
  image: WpMedia | null;
}

export interface AwardsGridData {
  title: string;
  awards: AwardItem[];
}

export interface AwardsGridProps {
  data: AwardsGridData;
  blockId: string;
}

export default function AwardsGrid({ data, blockId }: AwardsGridProps) {
  if (data.awards.length === 0) {
    return null;
  }

  return (
    <section id={blockId} className="bg-slate-50 py-16">
      <div className="mx-auto w-full max-w-7xl px-4">
        {data.title ? <h2 className="mb-8 text-3xl font-semibold tracking-tight text-slate-900">{data.title}</h2> : null}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {data.awards.map((award, index) => (
            <article key={`${award.title}-${index + 1}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="relative mb-4 h-44 overflow-hidden rounded-lg bg-slate-100">
                {getSafeMediaUrl(award.image) ? (
                  <Image
                    src={getSafeMediaUrl(award.image)!}
                    alt={getSafeMediaAlt(award.image, award.title)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-500">No image</div>
                )}
              </div>
              <h3 className="text-base font-semibold text-slate-900">{award.title}</h3>
              {award.subtitle ? <p className="mt-1 text-sm text-slate-600">{award.subtitle}</p> : null}
              {award.year ? <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{award.year}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
