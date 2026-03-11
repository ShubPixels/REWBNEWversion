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
  let payload: unknown;

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
    console.warn("[contact] honeypot_triggered", { requestId });
    return jsonSuccess(requestId, GENERIC_SUCCESS_MESSAGE);
  }

  const turnstileResult = await verifyTurnstileToken(validatedPayload.turnstileToken, getClientIp(request));
  if (!turnstileResult.ok) {
    console.warn("[contact] turnstile_failed", {
      requestId,
      errorCodes: turnstileResult.errorCodes,
    });
    return jsonError(requestId, 400, "turnstile_failed", "Bot verification failed.");
  }

  try {
    const service = createContactDeliveryService();
    await service.send(validatedPayload);
    return jsonSuccess(requestId, GENERIC_SUCCESS_MESSAGE);
  } catch (error) {
    if (error instanceof ContactServiceError) {
      console.error("[contact] delivery_service_error", { requestId, message: error.message });
      return jsonError(requestId, 500, "delivery_failed", DELIVERY_ERROR_MESSAGE);
    }

    console.error("[contact] delivery_unexpected_error", { requestId, error });
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
