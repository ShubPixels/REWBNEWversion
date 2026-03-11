import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { isValidPreviewSecret, normalizeInternalRedirectPath } from "@/lib/wp/preview";

function getRedirectTarget(request: NextRequest): string {
  const uri =
    request.nextUrl.searchParams.get("uri") ??
    request.nextUrl.searchParams.get("redirect") ??
    request.nextUrl.searchParams.get("path");

  return normalizeInternalRedirectPath(uri);
}

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  let secretIsValid = false;
  try {
    secretIsValid = isValidPreviewSecret(secret);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Preview mode is not configured on this deployment." },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  if (!secretIsValid) {
    return NextResponse.json(
      { ok: false, error: "Invalid preview secret." },
      {
        status: 401,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  const draft = await draftMode();
  draft.disable();

  const targetUrl = new URL(getRedirectTarget(request), request.nextUrl.origin);
  targetUrl.searchParams.delete("preview");
  targetUrl.searchParams.delete("previewId");
  targetUrl.searchParams.delete("previewType");

  const response = NextResponse.redirect(targetUrl);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
