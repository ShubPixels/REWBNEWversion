import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import {
  extractPreviewLookupFromSearchParams,
  getPreviewNodeById,
  isValidPreviewSecret,
  normalizeInternalRedirectPath,
  resolvePreviewRedirectPath,
  type RouteSearchParams,
} from "@/lib/wp/preview";

function toRouteSearchParams(searchParams: URLSearchParams): RouteSearchParams {
  const result: RouteSearchParams = {};

  searchParams.forEach((value, key) => {
    const existing = result[key];
    if (existing === undefined) {
      result[key] = value;
      return;
    }

    if (Array.isArray(existing)) {
      existing.push(value);
      result[key] = existing;
      return;
    }

    result[key] = [existing, value];
  });

  return result;
}

function firstString(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    const first = value.find((entry) => entry.trim().length > 0);
    return first ? first.trim() : null;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  return null;
}

function getRequestedUri(searchParams: RouteSearchParams): string | null {
  const keys = ["uri", "redirect", "path"] as const;
  for (const key of keys) {
    const value = firstString(searchParams[key]);
    if (value) {
      return value;
    }
  }
  return null;
}

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (!isValidPreviewSecret(secret)) {
    return NextResponse.json(
      { ok: false, error: "Invalid preview secret." },
      {
        status: 401,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  const routeSearchParams = toRouteSearchParams(request.nextUrl.searchParams);
  const previewLookup = extractPreviewLookupFromSearchParams(routeSearchParams);

  const previewNode = previewLookup
    ? await getPreviewNodeById(previewLookup.id, previewLookup.idType).catch(() => null)
    : null;

  if (previewLookup && !previewNode) {
    return NextResponse.json(
      { ok: false, error: "Preview node not found." },
      {
        status: 404,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  const requestedUri = getRequestedUri(routeSearchParams);
  const requestedPath = requestedUri ? normalizeInternalRedirectPath(requestedUri) : null;
  const redirectPath = requestedPath ?? resolvePreviewRedirectPath(previewNode);

  const targetUrl = new URL(redirectPath, request.nextUrl.origin);
  if (previewLookup) {
    targetUrl.searchParams.set("previewId", previewLookup.id);
    targetUrl.searchParams.set("previewType", previewLookup.idType);
  }

  targetUrl.searchParams.set("preview", "true");

  const draft = await draftMode();
  draft.enable();

  const response = NextResponse.redirect(targetUrl);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
