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
      <div className="mt-6 flex flex-wrap gap-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.slug ? `/product-category/${category.slug}` : category.uri || "/product-category"}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400 hover:text-slate-900"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
