import Image from "next/image";
import type { ReactElement } from "react";
import { getSafeMediaAlt, getSafeMediaDimensions, getSafeMediaUrl } from "@/lib/wp/media";
import type { WpMedia } from "@/types/wp";

export interface ProductOverviewProps {
  introDescription: string;
  gallery: WpMedia[];
  videoUrl: string | null;
}

export default function ProductOverview({ introDescription, gallery, videoUrl }: ProductOverviewProps) {
  const galleryItems = gallery
    .slice(0, 6)
    .map((media, index) => {
      const imageUrl = getSafeMediaUrl(media);
      const imageAlt = getSafeMediaAlt(media, "Product gallery image");
      const imageSize = getSafeMediaDimensions(media, 900, 700);

      if (!imageUrl) {
        return null;
      }

      return (
        <div
          key={`${media.id}-${index}`}
          className={`overflow-hidden rounded-xl border border-slate-200 ${index === 0 ? "col-span-2" : "col-span-1"}`}
        >
          <Image
            src={imageUrl}
            alt={imageAlt}
            width={imageSize.width}
            height={imageSize.height}
            className="h-full w-full object-cover"
            sizes={index === 0 ? "(max-width: 1024px) 100vw, 45vw" : "(max-width: 1024px) 50vw, 22vw"}
          />
        </div>
      );
    })
    .filter((item): item is ReactElement => item !== null);

  const hasContent = introDescription.trim().length > 0 || galleryItems.length > 0 || Boolean(videoUrl);
  if (!hasContent) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">Overview</h2>
          {introDescription ? <p className="mt-4 text-sm leading-7 text-slate-700">{introDescription}</p> : null}
          {videoUrl ? (
            <a
              href={videoUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Watch Product Video
            </a>
          ) : null}
        </div>

        {galleryItems.length > 0 ? <div className="grid grid-cols-2 gap-3">{galleryItems}</div> : null}
      </div>
    </section>
  );
}
