import type { ContactPayloadInput } from "@/lib/forms/contactSchema";
import type { WpLink } from "@/types/wp";

export interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  company: string;
  category: string;
  message: string;
  termsAccepted: boolean;
}

export const INITIAL_CONTACT_FORM_VALUES: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  company: "",
  category: "",
  message: "",
  termsAccepted: false,
};

export interface ContactFormPayloadOptions {
  sourceUrl?: string | null;
  blockId?: string | null;
  honeypot?: string | null;
  turnstileToken?: string | null;
}

export interface ContactFormLabels {
  name: string;
  email: string;
  phone: string;
  company: string;
  category: string;
  message: string;
}

export interface ContactFormSidebarContent {
  title: string;
  phoneLabel: string;
  emailLabel: string;
  addressLabel: string;
  mapButtonLabel: string;
}

export interface ContactFormSplitContent {
  title: string;
  description: string;
  formTitle: string;
  submitLabel: string;
  submitPendingLabel: string;
  successMessage: string;
  errorMessage: string;
  categoryPlaceholder: string;
  termsLabel: string;
  categories: string[];
  labels: ContactFormLabels;
  sidebar: ContactFormSidebarContent;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  mapLink: WpLink | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return isRecord(value) ? value : null;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function readPath(record: Record<string, unknown>, path: string): unknown {
  const segments = path.split(".");
  let cursor: unknown = record;

  for (const segment of segments) {
    if (!isRecord(cursor) || !(segment in cursor)) {
      return undefined;
    }
    cursor = cursor[segment];
  }

  return cursor;
}

function readFirst(record: Record<string, unknown>, keys: string[]): unknown {
  for (const key of keys) {
    const value = readPath(record, key);
    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return undefined;
}

function pickString(record: Record<string, unknown>, keys: string[], fallback = ""): string {
  const value = readFirst(record, keys);
  return typeof value === "string" ? value : fallback;
}

function pickStringOptions(record: Record<string, unknown>, keys: string[]): string[] {
  const value = readFirst(record, keys);
  const items = asArray(value);

  return items
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      if (isRecord(item)) {
        const label = pickString(item, ["label", "title", "value", "name"], "");
        return label.trim();
      }

      return "";
    })
    .filter((item) => item.length > 0);
}

function parseLink(value: unknown): WpLink | null {
  if (typeof value === "string" && value.trim().length > 0) {
    return {
      label: "Open map",
      url: value.trim(),
      target: null,
    };
  }

  const record = asRecord(value);
  if (!record) {
    return null;
  }

  const url = pickString(record, ["url", "href", "link"], "").trim();
  if (!url) {
    return null;
  }

  return {
    label: pickString(record, ["title", "label", "text"], "Open map"),
    url,
    target: pickString(record, ["target"], "") || null,
  };
}

function pickLink(record: Record<string, unknown>, keys: string[]): WpLink | null {
  return parseLink(readFirst(record, keys));
}

function normalizeString(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

export function buildContactPayload(
  values: ContactFormValues,
  options: ContactFormPayloadOptions = {},
): ContactPayloadInput {
  return {
    name: normalizeString(values.name),
    email: normalizeString(values.email),
    phone: normalizeString(values.phone),
    company: normalizeString(values.company),
    category: normalizeString(values.category),
    message: normalizeString(values.message),
    termsAccepted: values.termsAccepted === true,
    website: normalizeString(options.honeypot),
    turnstileToken: normalizeString(options.turnstileToken),
    sourceUrl: normalizeString(options.sourceUrl),
    blockId: normalizeString(options.blockId),
  };
}

export function mapContactFormSplitContent(raw: Record<string, unknown>): ContactFormSplitContent {
  const categories = pickStringOptions(raw, [
    "categories",
    "options",
    "inquiryOptions",
    "inquiryCategories",
    "dropdownOptions",
  ]);

  return {
    title: pickString(raw, ["title", "heading"], ""),
    description: pickString(raw, ["description", "intro"], ""),
    formTitle: pickString(raw, ["formTitle", "form_heading"], "Send us a message"),
    submitLabel: pickString(raw, ["submitLabel", "submitText"], "Submit"),
    submitPendingLabel: pickString(raw, ["submitPendingLabel", "submittingLabel"], "Sending..."),
    successMessage: pickString(raw, ["successMessage", "successText"], "Thanks. Your message has been sent."),
    errorMessage: pickString(raw, ["errorMessage", "errorText"], "We could not send your message. Try again."),
    categoryPlaceholder: pickString(raw, ["categoryPlaceholder", "dropdownPlaceholder"], "Select category"),
    termsLabel: pickString(raw, ["termsLabel", "privacyConsentLabel", "consentLabel"], "I agree to the terms."),
    categories,
    labels: {
      name: pickString(raw, ["labels.name", "fieldLabels.name", "nameLabel"], "Name"),
      email: pickString(raw, ["labels.email", "fieldLabels.email", "emailLabel"], "Email"),
      phone: pickString(raw, ["labels.phone", "fieldLabels.phone", "phoneLabel"], "Phone"),
      company: pickString(raw, ["labels.company", "fieldLabels.company", "companyLabel"], "Company"),
      category: pickString(raw, ["labels.category", "fieldLabels.category", "categoryLabel"], "Category"),
      message: pickString(raw, ["labels.message", "fieldLabels.message", "messageLabel"], "Message"),
    },
    sidebar: {
      title: pickString(raw, ["sidebar.title", "sidebarTitle", "contactTitle"], "Contact details"),
      phoneLabel: pickString(raw, ["sidebar.phoneLabel", "sidebarPhoneLabel", "contactPhoneLabel"], "Phone"),
      emailLabel: pickString(raw, ["sidebar.emailLabel", "sidebarEmailLabel", "contactEmailLabel"], "Email"),
      addressLabel: pickString(raw, ["sidebar.addressLabel", "sidebarAddressLabel", "contactAddressLabel"], "Address"),
      mapButtonLabel: pickString(raw, ["sidebar.mapButtonLabel", "mapButtonLabel", "mapLabel"], "Open map"),
    },
    contactEmail: pickString(raw, ["contactEmail", "email"], ""),
    contactPhone: pickString(raw, ["contactPhone", "phone"], ""),
    contactAddress: pickString(raw, ["contactAddress", "address"], ""),
    mapLink: pickLink(raw, ["mapLink", "locationLink", "directionsLink"]),
  };
}
