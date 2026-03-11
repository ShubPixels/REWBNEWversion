import Link from "next/link";
import MenuTree from "@/components/layout/MenuTree";
import type { WpLink, WpMenuItemData } from "@/types/wp";

interface SiteFooterProps {
  brandName: string;
  footerText: string;
  footerMenu: WpMenuItemData[];
  fallbackLinks: WpLink[];
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialLinks: WpLink[];
}

function mapLinksToMenuItems(links: WpLink[]): WpMenuItemData[] {
  return links.map((link, index) => ({
    id: `footer-fallback-${index + 1}`,
    databaseId: null,
    parentDatabaseId: null,
    label: link.label,
    url: link.url,
    target: link.target,
    cssClasses: [],
    children: [],
  }));
}

function isExternalLink(url: string): boolean {
  return /^(https?:\/\/|mailto:|tel:)/i.test(url);
}

export default function SiteFooter({
  brandName,
  footerText,
  footerMenu,
  fallbackLinks,
  contactEmail,
  contactPhone,
  contactAddress,
  socialLinks,
}: SiteFooterProps) {
  const menuItems = footerMenu.length > 0 ? footerMenu : mapLinksToMenuItems(fallbackLinks);

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 md:grid-cols-3">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white">{brandName}</h2>
          <p className="text-sm text-slate-300">{footerText}</p>
        </section>
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Navigation</h3>
          <MenuTree items={menuItems} variant="footer" />
        </section>
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Contact</h3>
          {contactPhone ? (
            <p className="text-sm">
              <a href={`tel:${contactPhone}`} className="hover:text-white">
                {contactPhone}
              </a>
            </p>
          ) : null}
          {contactEmail ? (
            <p className="text-sm">
              <a href={`mailto:${contactEmail}`} className="hover:text-white">
                {contactEmail}
              </a>
            </p>
          ) : null}
          {contactAddress ? <p className="text-sm text-slate-300">{contactAddress}</p> : null}
          {socialLinks.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <li key={`${link.label}-${link.url}`}>
                  {isExternalLink(link.url) ? (
                    <a
                      href={link.url}
                      target={link.target ?? "_blank"}
                      rel="noreferrer"
                      className="text-sm text-slate-300 hover:text-white"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.url} className="text-sm text-slate-300 hover:text-white">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </div>
      <div className="border-t border-slate-800 px-4 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {brandName}. All rights reserved.
      </div>
    </footer>
  );
}
