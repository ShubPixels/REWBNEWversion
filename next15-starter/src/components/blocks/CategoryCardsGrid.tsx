import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { WpLink, WpMedia } from "@/types/wp";

export interface CategoryCardItem {
  title: string;
  description: string;
  image: WpMedia | null;
  link: WpLink | null;
}

export interface CategoryCardsGridData {
  title: string;
  description: string;
  cards: CategoryCardItem[];
}

export interface CategoryCardsGridProps {
  data: CategoryCardsGridData;
  blockId: string;
}

function isExternalLink(url: string): boolean {
  return /^(https?:\/\/|mailto:|tel:)/i.test(url);
}

function CardLink({ link, children }: { link: WpLink | null; children: ReactNode }) {
  if (!link) {
    return <>{children}</>;
  }

  if (isExternalLink(link.url)) {
    return (
      <a href={link.url} target={link.target ?? "_blank"} rel="noreferrer" className="group">
        {children}
      </a>
    );
  }

  return (
    <Link href={link.url} className="group">
      {children}
    </Link>
  );
}

export default function CategoryCardsGrid({ data, blockId }: CategoryCardsGridProps) {
  if (data.cards.length === 0) {
    return null;
  }

  return (
    <section id={blockId} className="mx-auto w-full max-w-7xl px-4 py-16">
      {data.title ? <h2 className="text-3xl font-semibold tracking-tight text-slate-900">{data.title}</h2> : null}
      {data.description ? <p className="mt-3 max-w-3xl text-sm text-slate-600 md:text-base">{data.description}</p> : null}
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {data.cards.map((card, index) => (
          <CardLink key={`${card.title}-${index + 1}`} link={card.link}>
            <article className="h-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              {card.image ? (
                <div className="relative mb-4 h-44 overflow-hidden rounded-lg bg-slate-100">
                  <Image
                    src={card.image.url}
                    alt={card.image.alt || card.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                </div>
              ) : null}
              <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
              {card.description ? <p className="mt-2 text-sm text-slate-600">{card.description}</p> : null}
              {card.link ? <span className="mt-4 inline-block text-sm font-medium text-slate-900">Explore →</span> : null}
            </article>
          </CardLink>
        ))}
      </div>
    </section>
  );
}
