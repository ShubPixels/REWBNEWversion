import Image from "next/image";
import Link from "next/link";
import type { WpMedia, WpProductCategorySummaryData } from "@/types/wp";

export interface ProductHeroProps {
  title: string;
  tagline: string;
  summary: string;
  featuredImage: WpMedia | null;
  categories: WpProductCategorySummaryData[];
}

function buildCategoryHref(category: WpProductCategorySummaryData): string {
  if (category.slug) {
    return `/product-category/${category.slug}`;
  }

  const normalizedUri = category.uri.trim();
  if (normalizedUri) {
    return normalizedUri;
  }

  return "/product-category";
}

export default function ProductHero({
  title,
  tagline,
  summary,
  featuredImage,
  categories,
}: ProductHeroProps) {
  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 md:items-center md:py-16">
        <div>
          {categories.length > 0 ? (
            <div className="mb-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={buildCategoryHref(category)}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:border-slate-400 hover:text-slate-900"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          ) : null}

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">{title}</h1>
          {tagline ? <p className="mt-4 text-lg text-slate-700">{tagline}</p> : null}
          {summary ? <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-600">{summary}</p> : null}
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {featuredImage ? (
            <Image
              src={featuredImage.url}
              alt={featuredImage.alt || title}
              width={featuredImage.width ?? 1200}
              height={featuredImage.height ?? 900}
              className="h-full w-full object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex min-h-72 items-center justify-center bg-slate-100 p-8 text-sm text-slate-500">
              Product image coming soon.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
