import { Resend } from "resend";
import type { ContactPayload } from "@/lib/forms/contactSchema";

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

export class ContactServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContactServiceError";
  }
}

function readRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new ContactServiceError(`${name} is required for contact email delivery.`);
  }
  return value;
}

function readOptionalEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : undefined;
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
  const base = payload.category
    ? `New contact inquiry: ${payload.category}`
    : "New contact inquiry";

  if (!subjectPrefix) {
    return base;
  }

  return `${subjectPrefix} ${base}`.trim();
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
    const response = await this.resend.emails.send({
      from: this.fromEmail,
      to: [this.toEmail],
      replyTo: this.replyToEmail ? [this.replyToEmail] : [payload.email],
      subject: buildSubject(payload, this.subjectPrefix),
      text: buildTextBody(payload),
      html: buildHtmlBody(payload),
    });

    if (response.error) {
      throw new ContactServiceError(response.error.message);
    }

    return {
      provider: "resend",
      messageId: response.data?.id ?? null,
    };
  }
}

export function createContactDeliveryService(): ContactDeliveryService {
  return new ResendContactService({
    apiKey: readRequiredEnv("RESEND_API_KEY"),
    fromEmail: readRequiredEnv("CONTACT_FROM_EMAIL"),
    toEmail: readRequiredEnv("CONTACT_TO_EMAIL"),
    replyToEmail: readOptionalEnv("CONTACT_REPLY_TO_EMAIL"),
    subjectPrefix: readOptionalEnv("CONTACT_SUBJECT_PREFIX"),
  });
}

export function isHoneypotTripped(payload: Pick<ContactPayload, "website">): boolean {
  return payload.website.trim().length > 0;
}

export async function verifyTurnstileToken(
  token: string,
  remoteIp: string | null,
): Promise<TurnstileVerificationResult> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY?.trim();

  if (!secretKey) {
    return { ok: true, skipped: true, errorCodes: [] };
  }

  if (!token.trim()) {
    return { ok: false, skipped: false, errorCodes: ["missing-input-response"] };
  }

  const body = new URLSearchParams({
    secret: secretKey,
    response: token,
  });

  if (remoteIp?.trim()) {
    body.set("remoteip", remoteIp.trim());
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      cache: "no-store",
    });

    if (!response.ok) {
      return { ok: false, skipped: false, errorCodes: [`http_${response.status}`] };
    }

    const data = (await response.json()) as TurnstileSiteVerifyResponse;
    const errorCodes = Array.isArray(data["error-codes"]) ? data["error-codes"] : [];
    return {
      ok: data.success === true,
      skipped: false,
      errorCodes,
    };
  } catch {
    return { ok: false, skipped: false, errorCodes: ["request_failed"] };
  }
}
