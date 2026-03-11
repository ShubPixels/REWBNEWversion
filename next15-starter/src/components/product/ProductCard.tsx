import Image from "next/image";
import Link from "next/link";
import { getSafeMediaAlt, getSafeMediaDimensions, getSafeMediaUrl } from "@/lib/wp/media";
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
  const imageUrl = getSafeMediaUrl(product.featuredImage);
  const imageAlt = getSafeMediaAlt(product.featuredImage, product.title);
  const imageSize = getSafeMediaDimensions(product.featuredImage, 900, 675);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Link href={href} className="block">
        <div className="relative aspect-[4/3] bg-slate-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              width={imageSize.width}
              height={imageSize.height}
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
