"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  buildContactPayload,
  INITIAL_CONTACT_FORM_VALUES,
  type ContactFormSplitContent,
  type ContactFormValues,
} from "@/lib/forms/contactPayload";
import type { ContactApiResponse } from "@/lib/forms/contactSchema";

export type ContactFormSplitData = ContactFormSplitContent;

export interface ContactFormSplitProps {
  data: ContactFormSplitData;
  blockId: string;
}

export default function ContactFormSplit({ data, blockId }: ContactFormSplitProps) {
  const [values, setValues] = useState<ContactFormValues>({ ...INITIAL_CONTACT_FORM_VALUES });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  const categories = useMemo(() => data.categories.filter((item) => item.trim().length > 0), [data.categories]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    setApiErrorMessage("");

    try {
      const formData = new FormData(event.currentTarget);
      const payload = buildContactPayload(values, {
        blockId,
        sourceUrl: window.location.href,
        honeypot: String(formData.get("website") ?? ""),
        turnstileToken: String(formData.get("turnstileToken") ?? ""),
      });

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as ContactApiResponse | null;
      if (!response.ok || !result || result.ok !== true) {
        const message = result && result.ok === false ? result.error.message : data.errorMessage;
        throw new Error(message || data.errorMessage);
      }

      setStatus("success");
      setValues({ ...INITIAL_CONTACT_FORM_VALUES });
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setApiErrorMessage(error instanceof Error ? error.message : data.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id={blockId} className="mx-auto w-full max-w-7xl px-4 py-16">
      <div className="grid gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-2 lg:p-8">
        <div>
          {data.title ? <h2 className="text-3xl font-semibold tracking-tight text-slate-900">{data.title}</h2> : null}
          {data.description ? <p className="mt-3 text-sm text-slate-600 md:text-base">{data.description}</p> : null}
          {data.sidebar.title ? <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-slate-900">{data.sidebar.title}</h3> : null}
          <dl className="mt-8 space-y-3 text-sm text-slate-700">
            {data.contactPhone ? (
              <div>
                <dt className="font-medium text-slate-900">{data.sidebar.phoneLabel}</dt>
                <dd>
                  <a href={`tel:${data.contactPhone}`} className="hover:text-slate-900">
                    {data.contactPhone}
                  </a>
                </dd>
              </div>
            ) : null}
            {data.contactEmail ? (
              <div>
                <dt className="font-medium text-slate-900">{data.sidebar.emailLabel}</dt>
                <dd>
                  <a href={`mailto:${data.contactEmail}`} className="hover:text-slate-900">
                    {data.contactEmail}
                  </a>
                </dd>
              </div>
            ) : null}
            {data.contactAddress ? (
              <div>
                <dt className="font-medium text-slate-900">{data.sidebar.addressLabel}</dt>
                <dd>{data.contactAddress}</dd>
              </div>
            ) : null}
            {data.mapLink ? (
              <div>
                <a
                  href={data.mapLink.url}
                  target={data.mapLink.target ?? "_blank"}
                  rel="noreferrer"
                  className="inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-100"
                >
                  {data.mapLink.label || data.sidebar.mapButtonLabel}
                </a>
              </div>
            ) : null}
          </dl>
        </div>

        <div>
          {data.formTitle ? <h3 className="text-xl font-semibold text-slate-900">{data.formTitle}</h3> : null}
          <form className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1 text-sm text-slate-800">
              <span>{data.labels.name}</span>
              <input
                required
                value={values.name}
                onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-900 transition focus:ring-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-800">
              <span>{data.labels.email}</span>
              <input
                required
                type="email"
                value={values.email}
                onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-900 transition focus:ring-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-800">
              <span>{data.labels.phone}</span>
              <input
                value={values.phone}
                onChange={(event) => setValues((current) => ({ ...current, phone: event.target.value }))}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-900 transition focus:ring-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-800">
              <span>{data.labels.company}</span>
              <input
                value={values.company}
                onChange={(event) => setValues((current) => ({ ...current, company: event.target.value }))}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-900 transition focus:ring-2"
              />
            </label>
            {categories.length > 0 ? (
              <label className="flex flex-col gap-1 text-sm text-slate-800 sm:col-span-2">
                <span>{data.labels.category}</span>
                <select
                  value={values.category}
                  onChange={(event) => setValues((current) => ({ ...current, category: event.target.value }))}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-900 transition focus:ring-2"
                >
                  <option value="">{data.categoryPlaceholder}</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            <label className="flex flex-col gap-1 text-sm text-slate-800 sm:col-span-2">
              <span>{data.labels.message}</span>
              <textarea
                required
                value={values.message}
                onChange={(event) => setValues((current) => ({ ...current, message: event.target.value }))}
                className="min-h-28 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-900 transition focus:ring-2"
              />
            </label>

            <label className="flex items-start gap-2 text-xs text-slate-700 sm:col-span-2">
              <input
                required
                type="checkbox"
                checked={values.termsAccepted}
                onChange={(event) => setValues((current) => ({ ...current, termsAccepted: event.target.checked }))}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span>{data.termsLabel}</span>
            </label>

            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] top-auto h-0 w-0 opacity-0"
            />
            <input type="hidden" name="turnstileToken" data-contact-turnstile-token />

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2"
            >
              {isSubmitting ? data.submitPendingLabel : data.submitLabel}
            </button>
          </form>

          {status === "success" ? <p className="mt-3 text-sm text-emerald-700">{data.successMessage}</p> : null}
          {status === "error" ? (
            <p className="mt-3 text-sm text-rose-700">{apiErrorMessage || data.errorMessage}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
