import { NextResponse, type NextRequest } from "next/server";
import {
  contactPayloadSchema,
  flattenContactValidationErrors,
  type ContactApiErrorResponse,
  type ContactApiSuccessResponse,
} from "@/lib/forms/contactSchema";
import {
  ContactServiceError,
  createContactDeliveryService,
  isHoneypotTripped,
  verifyTurnstileToken,
} from "@/lib/forms/contactService";

const GENERIC_SUCCESS_MESSAGE = "Your request has been received.";
const DELIVERY_ERROR_MESSAGE = "We could not send your message at this time.";
const ALLOWED_METHODS = "POST";
const MAX_REQUEST_BYTES = 50_000;

function getRequestId(request: NextRequest): string {
  const fromHeader = request.headers.get("x-request-id")?.trim();
  if (fromHeader) {
    return fromHeader;
  }
  return crypto.randomUUID();
}

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const [first] = forwarded.split(",");
    if (first?.trim()) {
      return first.trim();
    }
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  return realIp && realIp.length > 0 ? realIp : null;
}

function getContentLength(request: NextRequest): number | null {
  const value = request.headers.get("content-length");
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function isJsonContentType(request: NextRequest): boolean {
  const contentType = request.headers.get("content-type");
  if (!contentType) {
    return false;
  }

  return contentType.toLowerCase().startsWith("application/json");
}

function getSafeSourceHost(sourceUrl: string): string | null {
  if (!sourceUrl) {
    return null;
  }

  try {
    return new URL(sourceUrl).hostname;
  } catch {
    return null;
  }
}

function logContactEvent(level: "info" | "warn" | "error", event: string, payload: Record<string, unknown>): void {
  const logger = level === "error" ? console.error : level === "warn" ? console.warn : console.info;
  logger(`[contact] ${event}`, payload);
}

function jsonSuccess(requestId: string, message = GENERIC_SUCCESS_MESSAGE, status = 200) {
  const body: ContactApiSuccessResponse = {
    ok: true,
    data: {
      message,
      requestId,
    },
  };

  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function jsonError(
  requestId: string,
  status: number,
  code: ContactApiErrorResponse["error"]["code"],
  message: string,
  fieldErrors?: Record<string, string[]>,
) {
  const body: ContactApiErrorResponse = {
    ok: false,
    error: {
      code,
      message,
      requestId,
      ...(fieldErrors ? { fieldErrors } : {}),
    },
  };

  return NextResponse.json(body, {
    status,
    headers: {
      Allow: ALLOWED_METHODS,
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(request: NextRequest) {
  const requestId = getRequestId(request);
  const ip = getClientIp(request);
  let payload: unknown;

  if (!isJsonContentType(request)) {
    return jsonError(requestId, 415, "invalid_content_type", "Content-Type must be application/json.");
  }

  const contentLength = getContentLength(request);
  if (contentLength !== null && contentLength > MAX_REQUEST_BYTES) {
    return jsonError(requestId, 413, "payload_too_large", "Payload is too large.");
  }

  try {
    payload = await request.json();
  } catch {
    return jsonError(requestId, 400, "invalid_json", "Request body must be valid JSON.");
  }

  const parsed = contactPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError(
      requestId,
      400,
      "validation_error",
      "Payload validation failed.",
      flattenContactValidationErrors(parsed.error),
    );
  }

  const validatedPayload = parsed.data;

  // Honeypot hook: if filled, return generic success to avoid spam signal leakage.
  if (isHoneypotTripped(validatedPayload)) {
    logContactEvent("warn", "honeypot_triggered", { requestId, ip });
    return jsonSuccess(requestId, GENERIC_SUCCESS_MESSAGE);
  }

  const turnstileResult = await verifyTurnstileToken(validatedPayload.turnstileToken, ip);
  if (!turnstileResult.ok) {
    logContactEvent("warn", "turnstile_failed", {
      requestId,
      ip,
      errorCodes: turnstileResult.errorCodes,
    });
    return jsonError(requestId, 400, "turnstile_failed", "Bot verification failed.");
  }

  try {
    const service = createContactDeliveryService();
    const result = await service.send(validatedPayload);
    logContactEvent("info", "delivery_success", {
      requestId,
      ip,
      provider: result.provider,
      messageId: result.messageId,
      category: validatedPayload.category || null,
      hasCompany: Boolean(validatedPayload.company),
      hasPhone: Boolean(validatedPayload.phone),
      sourceHost: getSafeSourceHost(validatedPayload.sourceUrl),
    });
    return jsonSuccess(requestId, GENERIC_SUCCESS_MESSAGE);
  } catch (error) {
    if (error instanceof ContactServiceError) {
      logContactEvent("error", "delivery_service_error", {
        requestId,
        ip,
        code: error.code,
        message: error.message,
      });
      return jsonError(requestId, 500, "delivery_failed", DELIVERY_ERROR_MESSAGE);
    }

    logContactEvent("error", "delivery_unexpected_error", {
      requestId,
      ip,
      error: error instanceof Error ? error.message : "unknown_error",
    });
    return jsonError(requestId, 500, "delivery_failed", DELIVERY_ERROR_MESSAGE);
  }
}

function methodNotAllowed(request: NextRequest) {
  return jsonError(getRequestId(request), 405, "method_not_allowed", "Method not allowed.");
}

export async function GET(request: NextRequest) {
  return methodNotAllowed(request);
}

export async function PUT(request: NextRequest) {
  return methodNotAllowed(request);
}

export async function PATCH(request: NextRequest) {
  return methodNotAllowed(request);
}

export async function DELETE(request: NextRequest) {
  return methodNotAllowed(request);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: ALLOWED_METHODS,
      "Cache-Control": "no-store",
    },
  });
}
