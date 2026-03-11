import Image from "next/image";
import Link from "next/link";
import { getSafeMediaAlt, getSafeMediaDimensions, getSafeMediaUrl } from "@/lib/wp/media";
import type { WpLink, WpMedia } from "@/types/wp";

export interface ProductCategoryHeroProps {
  name: string;
  intro: string;
  description: string;
  heroImage: WpMedia | null;
  cta: WpLink | null;
  isServiceCategory: boolean;
}

function isExternalLink(url: string): boolean {
  return /^(https?:\/\/|mailto:|tel:)/i.test(url);
}

function CategoryCta({ cta }: { cta: WpLink }) {
  const className =
    "mt-6 inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700";

  if (isExternalLink(cta.url)) {
    return (
      <a href={cta.url} target={cta.target ?? "_blank"} rel="noreferrer" className={className}>
        {cta.label}
      </a>
    );
  }

  return (
    <Link href={cta.url} className={className}>
      {cta.label}
    </Link>
  );
}

export default function ProductCategoryHero({
  name,
  intro,
  description,
  heroImage,
  cta,
  isServiceCategory,
}: ProductCategoryHeroProps) {
  const imageUrl = getSafeMediaUrl(heroImage);
  const imageAlt = getSafeMediaAlt(heroImage, name);
  const imageSize = getSafeMediaDimensions(heroImage, 1200, 900);

  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 md:grid-cols-2 md:items-center md:py-16">
        <div>
          {isServiceCategory ? (
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Service Category</p>
          ) : null}
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">{name}</h1>
          {intro ? <p className="mt-4 text-lg text-slate-700">{intro}</p> : null}
          {description ? <p className="mt-5 text-sm leading-7 text-slate-600">{description}</p> : null}
          {cta ? <CategoryCta cta={cta} /> : null}
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              width={imageSize.width}
              height={imageSize.height}
              className="h-full w-full object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex min-h-72 items-center justify-center bg-slate-100 p-8 text-sm text-slate-500">
              Category image unavailable.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
