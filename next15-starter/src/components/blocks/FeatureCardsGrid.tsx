import Image from "next/image";
import type { WpMedia } from "@/types/wp";

export interface FeatureCardItem {
  title: string;
  description: string;
  icon: string;
  image: WpMedia | null;
}

export interface FeatureCardsGridData {
  title: string;
  description: string;
  cards: FeatureCardItem[];
}

export interface FeatureCardsGridProps {
  data: FeatureCardsGridData;
  blockId: string;
}

function CardVisual({ item }: { item: FeatureCardItem }) {
  if (item.image) {
    return (
      <div className="relative mb-4 h-14 w-14 overflow-hidden rounded bg-slate-100">
        <Image src={item.image.url} alt={item.image.alt || item.title} fill className="object-cover" sizes="56px" />
      </div>
    );
  }

  return (
    <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded bg-slate-900 text-lg text-white">
      {item.icon || "•"}
    </span>
  );
}

export default function FeatureCardsGrid({ data, blockId }: FeatureCardsGridProps) {
  if (data.cards.length === 0) {
    return null;
  }

  return (
    <section id={blockId} className="bg-slate-50 py-16">
      <div className="mx-auto w-full max-w-7xl px-4">
        {data.title ? <h2 className="text-3xl font-semibold tracking-tight text-slate-900">{data.title}</h2> : null}
        {data.description ? <p className="mt-3 max-w-3xl text-sm text-slate-600 md:text-base">{data.description}</p> : null}
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.cards.map((item, index) => (
            <article key={`${item.title}-${index + 1}`} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <CardVisual item={item} />
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              {item.description ? <p className="mt-2 text-sm text-slate-600">{item.description}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
