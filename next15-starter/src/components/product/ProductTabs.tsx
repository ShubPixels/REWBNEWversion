"use client";

import { useEffect, useMemo, useState } from "react";
import type { WpProductApplicationsData, WpProductSpecification } from "@/types/wp";

type ProductTabKey = "benefits" | "specifications" | "applications";

interface ProductTabItem {
  key: ProductTabKey;
  label: string;
  hasContent: boolean;
}

export interface ProductTabsProps {
  benefits: string[];
  specifications: WpProductSpecification[];
  applications: WpProductApplicationsData;
}

function tabButtonClass(active: boolean): string {
  return active
    ? "border-slate-900 bg-slate-900 text-white"
    : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:text-slate-900";
}

export default function ProductTabs({ benefits, specifications, applications }: ProductTabsProps) {
  const tabs = useMemo<ProductTabItem[]>(
    () => [
      { key: "benefits", label: "Benefits", hasContent: benefits.length > 0 },
      { key: "specifications", label: "Specifications", hasContent: specifications.length > 0 },
      {
        key: "applications",
        label: "Applications",
        hasContent: applications.materials.length > 0 || applications.industries.length > 0,
      },
    ],
    [applications.industries.length, applications.materials.length, benefits.length, specifications.length],
  );

  const firstAvailableTab = tabs.find((tab) => tab.hasContent)?.key ?? "benefits";
  const [activeTab, setActiveTab] = useState<ProductTabKey>(firstAvailableTab);

  useEffect(() => {
    setActiveTab(firstAvailableTab);
  }, [firstAvailableTab]);

  if (!tabs.some((tab) => tab.hasContent)) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            disabled={!tab.hasContent}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${tabButtonClass(
              activeTab === tab.key,
            )} disabled:cursor-not-allowed disabled:opacity-45`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        {activeTab === "benefits" ? (
          <ul className="grid gap-3 md:grid-cols-2">
            {benefits.map((benefit) => (
              <li key={benefit} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                {benefit}
              </li>
            ))}
          </ul>
        ) : null}

        {activeTab === "specifications" ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-3 py-2 font-semibold text-slate-900">Specification</th>
                  <th className="px-3 py-2 font-semibold text-slate-900">Value</th>
                </tr>
              </thead>
              <tbody>
                {specifications.map((spec, index) => (
                  <tr key={`${spec.label}-${index}`} className="border-b border-slate-100">
                    <td className="px-3 py-2 text-slate-700">{spec.label}</td>
                    <td className="px-3 py-2 text-slate-700">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {activeTab === "applications" ? (
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-slate-900">Materials</h3>
              {applications.materials.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {applications.materials.map((material) => (
                    <li key={material} className="text-sm text-slate-700">
                      {material}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-slate-500">No materials listed.</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-wide text-slate-900">Industries</h3>
              {applications.industries.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {applications.industries.map((industry) => (
                    <li key={industry} className="text-sm text-slate-700">
                      {industry}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-slate-500">No industries listed.</p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
