import "server-only";

import { Resend } from "resend";
import { getServerEnv } from "@/lib/env";
import type { ContactPayload } from "@/lib/forms/contactSchema";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_TIMEOUT_MS = 8000;

export interface ContactDeliveryResult {
  provider: "resend";
  messageId: string | null;
}

export interface ContactDeliveryService {
  send(payload: ContactPayload): Promise<ContactDeliveryResult>;
}

interface ResendContactServiceOptions {
  apiKey: string;
  fromEmail: string;
  toEmail: string;
  replyToEmail?: string;
  subjectPrefix?: string;
}

export interface TurnstileVerificationResult {
  ok: boolean;
  skipped: boolean;
  errorCodes: string[];
}

interface TurnstileSiteVerifyResponse {
  success?: boolean;
  "error-codes"?: string[];
}

export type ContactServiceErrorCode = "misconfigured" | "provider_error";

export class ContactServiceError extends Error {
  public readonly code: ContactServiceErrorCode;

  constructor(code: ContactServiceErrorCode, message: string, cause?: unknown) {
    super(message, { cause });
    this.name = "ContactServiceError";
    this.code = code;
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildSubject(payload: ContactPayload, subjectPrefix?: string): string {
  const base = payload.category ? `New contact inquiry: ${payload.category}` : "New contact inquiry";
  return subjectPrefix ? `${subjectPrefix} ${base}`.trim() : base;
}

function buildTextBody(payload: ContactPayload): string {
  return [
    "A new contact form submission was received.",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || "n/a"}`,
    `Company: ${payload.company || "n/a"}`,
    `Category: ${payload.category || "n/a"}`,
    `Source URL: ${payload.sourceUrl || "n/a"}`,
    `Block ID: ${payload.blockId || "n/a"}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");
}

function buildHtmlBody(payload: ContactPayload): string {
  return `
    <h2>New contact inquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(payload.phone || "n/a")}</p>
    <p><strong>Company:</strong> ${escapeHtml(payload.company || "n/a")}</p>
    <p><strong>Category:</strong> ${escapeHtml(payload.category || "n/a")}</p>
    <p><strong>Source URL:</strong> ${escapeHtml(payload.sourceUrl || "n/a")}</p>
    <p><strong>Block ID:</strong> ${escapeHtml(payload.blockId || "n/a")}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(payload.message).replaceAll("\n", "<br />")}</p>
  `;
}

class ResendContactService implements ContactDeliveryService {
  private readonly resend: Resend;
  private readonly fromEmail: string;
  private readonly toEmail: string;
  private readonly replyToEmail?: string;
  private readonly subjectPrefix?: string;

  constructor(options: ResendContactServiceOptions) {
    this.resend = new Resend(options.apiKey);
    this.fromEmail = options.fromEmail;
    this.toEmail = options.toEmail;
    this.replyToEmail = options.replyToEmail;
    this.subjectPrefix = options.subjectPrefix;
  }

  async send(payload: ContactPayload): Promise<ContactDeliveryResult> {
    let response;
    try {
      response = await this.resend.emails.send({
        from: this.fromEmail,
        to: [this.toEmail],
        replyTo: this.replyToEmail ? [this.replyToEmail] : [payload.email],
        subject: buildSubject(payload, this.subjectPrefix),
        text: buildTextBody(payload),
        html: buildHtmlBody(payload),
      });
    } catch (error) {
      throw new ContactServiceError("provider_error", "Resend request failed.", error);
    }

    if (response.error) {
      throw new ContactServiceError("provider_error", response.error.message);
    }

    return {
      provider: "resend",
      messageId: response.data?.id ?? null,
    };
  }
}

function getContactDeliveryConfig(): ResendContactServiceOptions {
  const env = getServerEnv();

  if (!env.resendApiKey || !env.contactFromEmail || !env.contactToEmail) {
    throw new ContactServiceError(
      "misconfigured",
      "Contact delivery is not configured. Check RESEND_API_KEY, CONTACT_FROM_EMAIL, and CONTACT_TO_EMAIL.",
    );
  }

  return {
    apiKey: env.resendApiKey,
    fromEmail: env.contactFromEmail,
    toEmail: env.contactToEmail,
    replyToEmail: env.contactReplyToEmail ?? undefined,
    subjectPrefix: env.contactSubjectPrefix ?? undefined,
  };
}

export function createContactDeliveryService(): ContactDeliveryService {
  return new ResendContactService(getContactDeliveryConfig());
}

export function isHoneypotTripped(payload: Pick<ContactPayload, "website">): boolean {
  return payload.website.trim().length > 0;
}

function parseTurnstileResponse(payload: unknown): TurnstileSiteVerifyResponse {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {};
  }

  const record = payload as Record<string, unknown>;
  return {
    success: typeof record.success === "boolean" ? record.success : undefined,
    "error-codes": Array.isArray(record["error-codes"])
      ? record["error-codes"].filter((value): value is string => typeof value === "string")
      : undefined,
  };
}

export async function verifyTurnstileToken(
  token: string,
  remoteIp: string | null,
): Promise<TurnstileVerificationResult> {
  const env = getServerEnv();
  const secretKey = env.turnstileSecretKey;

  if (!secretKey) {
    return { ok: true, skipped: true, errorCodes: [] };
  }

  const trimmedToken = token.trim();
  if (!trimmedToken) {
    return { ok: false, skipped: false, errorCodes: ["missing-input-response"] };
  }

  const body = new URLSearchParams({
    secret: secretKey,
    response: trimmedToken,
  });

  if (remoteIp?.trim()) {
    body.set("remoteip", remoteIp.trim());
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TURNSTILE_TIMEOUT_MS);

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      return { ok: false, skipped: false, errorCodes: [`http_${response.status}`] };
    }

    const rawPayload = (await response.json()) as unknown;
    const data = parseTurnstileResponse(rawPayload);
    const errorCodes = Array.isArray(data["error-codes"]) ? data["error-codes"] : [];

    return {
      ok: data.success === true,
      skipped: false,
      errorCodes,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { ok: false, skipped: false, errorCodes: ["timeout"] };
    }
    return { ok: false, skipped: false, errorCodes: ["request_failed"] };
  } finally {
    clearTimeout(timeoutId);
  }
}

