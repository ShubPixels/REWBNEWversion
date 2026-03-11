import { z } from "zod";

const EMAIL_MAX_LENGTH = 254;
const SHORT_TEXT_MAX_LENGTH = 120;
const MESSAGE_MAX_LENGTH = 4000;
const URL_MAX_LENGTH = 2048;
const TURNSTILE_TOKEN_MAX_LENGTH = 4096;
const PHONE_MAX_LENGTH = 40;
const HONEYPOT_MAX_LENGTH = 200;

const trimmedString = (maxLength: number) => z.string().trim().max(maxLength);

const optionalTrimmedString = (maxLength: number) => z.string().trim().max(maxLength).optional().default("");
const optionalUrlString = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength)
    .optional()
    .default("")
    .refine((value) => value.length === 0 || /^https?:\/\//i.test(value), {
      message: "Must be a valid URL.",
    });

const normalizedBoolean = z.preprocess((value) => {
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  return value;
}, z.boolean());

export const contactPayloadSchema = z.object({
  name: trimmedString(SHORT_TEXT_MAX_LENGTH).min(2, "Please enter your name."),
  email: trimmedString(EMAIL_MAX_LENGTH).email("Please enter a valid email address."),
  phone: optionalTrimmedString(PHONE_MAX_LENGTH).refine(
    (value) => value.length === 0 || /^[+\d().\-\s/]{6,40}$/.test(value),
    {
      message: "Please enter a valid phone number.",
    },
  ),
  company: optionalTrimmedString(SHORT_TEXT_MAX_LENGTH),
  category: optionalTrimmedString(SHORT_TEXT_MAX_LENGTH),
  message: trimmedString(MESSAGE_MAX_LENGTH).min(10, "Please enter a message."),
  termsAccepted: normalizedBoolean.refine((value) => value === true, {
    message: "Please accept the terms before submitting.",
  }),
  website: optionalTrimmedString(HONEYPOT_MAX_LENGTH),
  turnstileToken: optionalTrimmedString(TURNSTILE_TOKEN_MAX_LENGTH),
  sourceUrl: optionalUrlString(URL_MAX_LENGTH),
  blockId: optionalTrimmedString(100),
}).strict();

export type ContactPayloadInput = z.input<typeof contactPayloadSchema>;
export type ContactPayload = z.output<typeof contactPayloadSchema>;

export type ContactApiErrorCode =
  | "invalid_json"
  | "invalid_content_type"
  | "payload_too_large"
  | "validation_error"
  | "turnstile_failed"
  | "delivery_failed"
  | "method_not_allowed";

export interface ContactApiSuccessResponse {
  ok: true;
  data: {
    message: string;
    requestId: string;
  };
}

export interface ContactApiErrorResponse {
  ok: false;
  error: {
    code: ContactApiErrorCode;
    message: string;
    requestId: string;
    fieldErrors?: Record<string, string[]>;
  };
}

export type ContactApiResponse = ContactApiSuccessResponse | ContactApiErrorResponse;

export function flattenContactValidationErrors(
  error: z.ZodError<ContactPayloadInput>,
): Record<string, string[]> {
  const flattened = error.flatten();
  const fieldErrors: Record<string, string[]> = {};

  Object.entries(flattened.fieldErrors).forEach(([field, messages]) => {
    const cleaned = (messages ?? []).filter(
      (message): message is string => typeof message === "string" && message.trim().length > 0,
    );
    if (cleaned.length > 0) {
      fieldErrors[field] = cleaned;
    }
  });

  return fieldErrors;
}
