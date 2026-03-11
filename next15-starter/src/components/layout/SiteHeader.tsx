import Image from "next/image";
import Link from "next/link";
import MenuTree from "@/components/layout/MenuTree";
import { getSafeMediaAlt, getSafeMediaDimensions, getSafeMediaUrl } from "@/lib/wp/media";
import type { WpLink, WpMedia, WpMenuItemData } from "@/types/wp";

interface SiteHeaderProps {
  brandName: string;
  brandTagline: string;
  brandLogo: WpMedia | null;
  primaryMenu: WpMenuItemData[];
  fallbackLinks: WpLink[];
  contactEmail: string;
  contactPhone: string;
}

function mapLinksToMenuItems(links: WpLink[]): WpMenuItemData[] {
  return links.map((link, index) => ({
    id: `fallback-${index + 1}`,
    databaseId: null,
    parentDatabaseId: null,
    label: link.label,
    url: link.url,
    target: link.target,
    cssClasses: [],
    children: [],
  }));
}

function toTelephoneHref(phone: string): string | null {
  const normalized = phone.replace(/[^\d+]/g, "");
  return normalized.length > 0 ? `tel:${normalized}` : null;
}

export default function SiteHeader({
  brandName,
  brandTagline,
  brandLogo,
  primaryMenu,
  fallbackLinks,
  contactEmail,
  contactPhone,
}: SiteHeaderProps) {
  const menuItems = primaryMenu.length > 0 ? primaryMenu : mapLinksToMenuItems(fallbackLinks);
  const logoUrl = getSafeMediaUrl(brandLogo);
  const logoAlt = getSafeMediaAlt(brandLogo, brandName);
  const logoSize = getSafeMediaDimensions(brandLogo, 44, 44);
  const phoneHref = toTelephoneHref(contactPhone);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="border-b border-slate-100">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 text-xs text-slate-600">
          <span className="truncate">{brandTagline}</span>
          <div className="flex items-center gap-4">
            {contactPhone ? (
              phoneHref ? (
                <a href={phoneHref} className="hover:text-slate-900">
                  {contactPhone}
                </a>
              ) : (
                <span>{contactPhone}</span>
              )
            ) : null}
            {contactEmail ? (
              <a href={`mailto:${contactEmail}`} className="hover:text-slate-900">
                {contactEmail}
              </a>
            ) : null}
          </div>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 py-4">
        <Link href="/" className="inline-flex items-center gap-3 text-slate-900">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={logoAlt}
              width={logoSize.width}
              height={logoSize.height}
              className="h-11 w-11 rounded object-cover"
            />
          ) : (
            <span className="inline-flex h-11 w-11 items-center justify-center rounded bg-slate-900 text-sm font-semibold text-white">
              {brandName.slice(0, 2).toUpperCase()}
            </span>
          )}
          <span className="text-lg font-semibold tracking-tight">{brandName}</span>
        </Link>
        <nav aria-label="Primary navigation" className="hidden lg:block">
          <MenuTree items={menuItems} variant="header" />
        </nav>
      </div>
      <nav aria-label="Primary navigation (stacked)" className="border-t border-slate-100 px-4 py-3 lg:hidden">
        <MenuTree items={menuItems} variant="footer" />
      </nav>
    </header>
  );
}
