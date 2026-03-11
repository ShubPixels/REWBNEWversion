import type { ReactNode } from "react";
import FloatingContactButtons from "@/components/layout/FloatingContactButtons";
import PromoModal from "@/components/layout/PromoModal";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { siteConfig } from "@/config/site";
import { WP_REVALIDATE_SECONDS, WP_TAGS } from "@/lib/wp/cache";
import { wpFetch } from "@/lib/wp/fetcher";
import { mapGlobalSettingsQuery, mapMenusQuery } from "@/lib/wp/mappers";
import { GET_GLOBAL_SETTINGS_QUERY, GET_MENUS_QUERY } from "@/lib/wp/queries";
import type {
  GetGlobalSettingsQuery,
  GetMenusQuery,
  WpGlobalSettingsData,
  WpMenuData,
  WpMenuItemData,
} from "@/types/wp";

type SiteLayoutProps = Readonly<{
  children: ReactNode;
}>;

const DEFAULT_PROMO_MODAL = {
  enabled: false,
  delayMs: 5000,
  autoRotateMs: 4000,
  slides: [],
};

function defaultGlobalSettings(): WpGlobalSettingsData {
  return {
    siteTitle: siteConfig.name,
    siteDescription: siteConfig.description,
    siteUrl: siteConfig.url,
    siteName: siteConfig.name,
    siteTagline: siteConfig.description,
    brandLogo: null,
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
    whatsappPhone: "",
    whatsappDefaultMessage: "",
    enableBackToTop: true,
    footerText: siteConfig.description,
    headerPrimaryLinks: [],
    footerLinks: [],
    socialLinks: [],
    promoModal: { ...DEFAULT_PROMO_MODAL },
    menus: [],
    defaultSeo: null,
    options: {},
  };
}

function selectMenu(menus: WpMenuData[], preferredSlug: string | null, fallbackSlugs: string[]): WpMenuItemData[] {
  if (!menus.length) {
    return [];
  }

  if (preferredSlug) {
    const exact = menus.find((menu) => menu.slug.toLowerCase() === preferredSlug.toLowerCase());
    if (exact) {
      return exact.items;
    }
  }

  for (const slug of fallbackSlugs) {
    const fallback = menus.find((menu) => menu.slug.toLowerCase() === slug.toLowerCase());
    if (fallback) {
      return fallback.items;
    }
  }

  return menus[0]?.items ?? [];
}

function getOptionalStringOption(options: Record<string, unknown>, key: string): string | null {
  const value = options[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

async function getLayoutShellData(): Promise<{
  globalSettings: WpGlobalSettingsData;
  primaryMenu: WpMenuItemData[];
  footerMenu: WpMenuItemData[];
}> {
  let globalSettings = defaultGlobalSettings();
  let menus: WpMenuData[] = [];

  try {
    const globalData = await wpFetch<GetGlobalSettingsQuery>(GET_GLOBAL_SETTINGS_QUERY, {
      tags: [WP_TAGS.globalSettings],
      revalidate: WP_REVALIDATE_SECONDS.globals,
      debugLabel: "layout-global-settings",
    });
    globalSettings = mapGlobalSettingsQuery(globalData);
  } catch {
    globalSettings = defaultGlobalSettings();
  }

  try {
    const menusData = await wpFetch<GetMenusQuery>(GET_MENUS_QUERY, {
      tags: [WP_TAGS.menus],
      revalidate: WP_REVALIDATE_SECONDS.menus,
      debugLabel: "layout-menus",
    });
    menus = mapMenusQuery(menusData);
  } catch {
    menus = [];
  }

  const headerMenuSlug = getOptionalStringOption(globalSettings.options, "headerMenuSlug");
  const footerMenuSlug = getOptionalStringOption(globalSettings.options, "footerMenuSlug");

  const primaryMenu = selectMenu(menus, headerMenuSlug, ["primary", "main-menu", "main"]);
  const footerMenu = selectMenu(menus, footerMenuSlug, ["footer", "footer-menu", "legal"]);

  return {
    globalSettings: { ...globalSettings, menus },
    primaryMenu,
    footerMenu,
  };
}

export default async function SiteLayout({ children }: SiteLayoutProps) {
  const { globalSettings, primaryMenu, footerMenu } = await getLayoutShellData();
  const brandName = globalSettings.siteName || globalSettings.siteTitle || siteConfig.name;
  const brandTagline = globalSettings.siteTagline || globalSettings.siteDescription || siteConfig.description;

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <SiteHeader
        brandName={brandName}
        brandTagline={brandTagline}
        brandLogo={globalSettings.brandLogo}
        primaryMenu={primaryMenu}
        fallbackLinks={globalSettings.headerPrimaryLinks}
        contactEmail={globalSettings.contactEmail}
        contactPhone={globalSettings.contactPhone}
      />

      <main className="flex-1">{children}</main>

      <SiteFooter
        brandName={brandName}
        footerText={globalSettings.footerText || globalSettings.siteDescription || siteConfig.description}
        footerMenu={footerMenu}
        fallbackLinks={globalSettings.footerLinks}
        contactEmail={globalSettings.contactEmail}
        contactPhone={globalSettings.contactPhone}
        contactAddress={globalSettings.contactAddress}
        socialLinks={globalSettings.socialLinks}
      />

      <PromoModal promo={globalSettings.promoModal} />
      <FloatingContactButtons
        contact={{
          contactEmail: globalSettings.contactEmail,
          contactPhone: globalSettings.contactPhone,
          whatsappPhone: globalSettings.whatsappPhone,
          whatsappDefaultMessage: globalSettings.whatsappDefaultMessage,
          enableBackToTop: globalSettings.enableBackToTop,
        }}
      />
    </div>
  );
}
