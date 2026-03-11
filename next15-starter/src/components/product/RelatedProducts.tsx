import Image from "next/image";
import Link from "next/link";
import type { WpProductCardData } from "@/types/wp";

export interface RelatedProductsProps {
  products: WpProductCardData[];
  title?: string;
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "").trim();
}

export default function RelatedProducts({ products, title = "Related Products" }: RelatedProductsProps) {
  if (!products.length) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">{title}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <article key={product.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <Link href={product.slug ? `/products/${product.slug}` : product.uri || "/products"} className="block">
              <div className="relative aspect-[4/3] bg-slate-100">
                {product.featuredImage ? (
                  <Image
                    src={product.featuredImage.url}
                    alt={product.featuredImage.alt || product.title}
                    width={product.featuredImage.width ?? 900}
                    height={product.featuredImage.height ?? 675}
                    className="h-full w-full object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                ) : null}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-900">{product.title}</h3>
                {product.excerpt ? (
                  <p className="mt-2 text-sm leading-6 text-slate-600">{stripHtml(product.excerpt)}</p>
                ) : null}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
