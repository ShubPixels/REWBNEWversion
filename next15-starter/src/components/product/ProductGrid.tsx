import ProductCard from "@/components/product/ProductCard";
import type { WpProductCardData } from "@/types/wp";

export interface ProductGridProps {
  title: string;
  description?: string;
  products: WpProductCardData[];
  emptyHeading?: string;
  emptyText?: string;
}

export default function ProductGrid({
  title,
  description = "",
  products,
  emptyHeading = "No products found",
  emptyText = "This category currently has no product entries.",
}: ProductGridProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">{title}</h2>
      {description ? <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{description}</p> : null}

      {products.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">{emptyHeading}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{emptyText}</p>
        </div>
      )}
    </section>
  );
}

