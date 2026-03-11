import Link from "next/link";
import type { WpMenuItemData } from "@/types/wp";

export type MenuTreeVariant = "header" | "footer";

interface MenuTreeProps {
  items: WpMenuItemData[];
  variant?: MenuTreeVariant;
  depth?: number;
}

function normalizeHref(url: string): string {
  if (!url) {
    return "/";
  }

  if (/^(https?:\/\/|mailto:|tel:|#)/i.test(url)) {
    return url;
  }

  return url.startsWith("/") ? url : `/${url}`;
}

function isExternalHref(href: string): boolean {
  return /^(https?:\/\/|mailto:|tel:)/i.test(href);
}

function getListClassName(variant: MenuTreeVariant, depth: number): string {
  if (variant === "header") {
    if (depth === 0) {
      return "flex flex-wrap items-center gap-x-6 gap-y-2";
    }
    if (depth === 1) {
      return "invisible absolute left-0 top-full z-50 mt-2 min-w-56 rounded-md border border-slate-200 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100";
    }
    return "invisible absolute left-full top-0 z-50 ml-2 min-w-56 rounded-md border border-slate-200 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100";
  }

  return depth === 0 ? "space-y-2" : "mt-2 space-y-2 pl-4";
}

function getItemClassName(variant: MenuTreeVariant, depth: number): string {
  if (variant === "header") {
    return depth === 0 ? "group relative" : "group relative";
  }
  return "";
}

function getLinkClassName(variant: MenuTreeVariant, depth: number): string {
  if (variant === "header" && depth === 0) {
    return "inline-flex items-center gap-1 py-2 text-sm font-medium text-slate-700 transition hover:text-slate-950";
  }
  if (variant === "header") {
    return "flex items-center justify-between rounded px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-950";
  }
  return "text-sm text-slate-300 transition hover:text-white";
}

function MenuNode({
  item,
  variant,
  depth,
}: {
  item: WpMenuItemData;
  variant: MenuTreeVariant;
  depth: number;
}) {
  const href = normalizeHref(item.url);
  const hasChildren = item.children.length > 0;
  const showChevron = variant === "header" && hasChildren;
  const linkClassName = getLinkClassName(variant, depth);
  const itemClassName = getItemClassName(variant, depth);

  const linkContent = (
    <>
      <span>{item.label}</span>
      {showChevron ? <span aria-hidden="true">▾</span> : null}
    </>
  );

  return (
    <li className={itemClassName}>
      {isExternalHref(href) ? (
        <a
          href={href}
          className={linkClassName}
          target={item.target ?? "_blank"}
          rel="noreferrer"
          aria-label={item.label}
        >
          {linkContent}
        </a>
      ) : (
        <Link href={href} className={linkClassName} aria-label={item.label}>
          {linkContent}
        </Link>
      )}
      {hasChildren ? <MenuTree items={item.children} variant={variant} depth={depth + 1} /> : null}
    </li>
  );
}

export default function MenuTree({ items, variant = "header", depth = 0 }: MenuTreeProps) {
  if (!items.length) {
    return null;
  }

  return (
    <ul className={getListClassName(variant, depth)}>
      {items.map((item) => (
        <MenuNode key={item.id} item={item} variant={variant} depth={depth} />
      ))}
    </ul>
  );
}
