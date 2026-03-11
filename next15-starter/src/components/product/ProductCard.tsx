import Image from "next/image";
import Link from "next/link";
import type { WpProductCardData } from "@/types/wp";

export interface ProductCardProps {
  product: WpProductCardData;
  showExcerpt?: boolean;
  ctaLabel?: string;
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function resolveProductHref(product: WpProductCardData): string {
  if (product.slug.trim().length > 0) {
    return `/products/${product.slug}`;
  }

  if (product.uri.trim().length > 0) {
    return product.uri;
  }

  return "/products";
}

export default function ProductCard({ product, showExcerpt = true, ctaLabel = "View details" }: ProductCardProps) {
  const href = resolveProductHref(product);
  const excerpt = stripHtml(product.excerpt);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Link href={href} className="block">
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
          ) : (
            <div className="flex h-full items-center justify-center p-4 text-sm text-slate-500">Image unavailable</div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-900">{product.title}</h3>
          {showExcerpt && excerpt ? <p className="mt-2 text-sm leading-6 text-slate-600">{excerpt}</p> : null}
          <span className="mt-4 inline-flex text-sm font-medium text-slate-900">{ctaLabel}</span>
        </div>
      </Link>
    </article>
  );
}

