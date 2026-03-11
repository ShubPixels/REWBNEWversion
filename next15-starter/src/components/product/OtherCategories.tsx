import Image from "next/image";
import Link from "next/link";
import type { WpProductCategorySummaryData } from "@/types/wp";

export interface OtherCategoriesProps {
  categories: WpProductCategorySummaryData[];
  title?: string;
}

export default function OtherCategories({ categories, title = "Other Categories" }: OtherCategoriesProps) {
  if (!categories.length) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">{title}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.slug ? `/product-category/${category.slug}` : category.uri || "/product-category"}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative aspect-[4/3] bg-slate-100">
              {category.cardImage ? (
                <Image
                  src={category.cardImage.url}
                  alt={category.cardImage.alt || category.name}
                  width={category.cardImage.width ?? 900}
                  height={category.cardImage.height ?? 675}
                  className="h-full w-full object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-4 text-sm text-slate-500">
                  Category image unavailable
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-slate-900">{category.name}</h3>
              {category.shortDescription ? (
                <p className="mt-2 text-sm leading-6 text-slate-600">{category.shortDescription}</p>
              ) : category.description ? (
                <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
              ) : null}
              <span className="mt-4 inline-flex text-sm font-medium text-slate-900">
                {category.cta?.label || "Explore category"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
