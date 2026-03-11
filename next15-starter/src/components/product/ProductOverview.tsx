import Image from "next/image";
import type { WpMedia } from "@/types/wp";

export interface ProductOverviewProps {
  summary: string;
  gallery: WpMedia[];
  videoUrl: string | null;
}

export default function ProductOverview({ summary, gallery, videoUrl }: ProductOverviewProps) {
  const hasContent = summary.trim().length > 0 || gallery.length > 0 || Boolean(videoUrl);
  if (!hasContent) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">Overview</h2>
          {summary ? <p className="mt-4 text-sm leading-7 text-slate-700">{summary}</p> : null}
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

        {gallery.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {gallery.slice(0, 6).map((media, index) => (
              <div
                key={`${media.id}-${index}`}
                className={`overflow-hidden rounded-xl border border-slate-200 ${
                  index === 0 ? "col-span-2" : "col-span-1"
                }`}
              >
                <Image
                  src={media.url}
                  alt={media.alt || "Product gallery image"}
                  width={media.width ?? 900}
                  height={media.height ?? 700}
                  className="h-full w-full object-cover"
                  sizes={index === 0 ? "(max-width: 1024px) 100vw, 45vw" : "(max-width: 1024px) 50vw, 22vw"}
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
