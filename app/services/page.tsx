"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { useLocale } from "@/components/locale-provider";
import type { TranslationKey } from "@/lib/i18n";
import { useSiteContent } from "@/hooks/use-site-content";

const serviceKeys = ["websites", "pwa", "telegram", "ecommerce", "integrations", "ai"] as const;
const featureKeys = [
  ["strategy", "landing", "cms", "seo"],
  ["offline", "install", "ux", "notifications"],
  ["bot", "flows", "light", "api"],
  ["catalog", "checkout", "inventory", "crm"],
  ["api", "automation", "reporting", "crm"],
  ["assistant", "summaries", "automation", "reporting"],
] as const;

export default function ServicesPage() {
  const { t, locale } = useLocale();
  const content = useSiteContent();

  return (
    <main className="space-y-12 pb-8">
      <header className="grid gap-8 border-b border-white/10 pb-10 pt-5 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-[#8aa9ff]">{t("services.eyebrow")}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
            {t("services.title")}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Link
            href="/calculator"
            className="inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-white"
          >
            {t("nav.calculator")} <ArrowUpRight size={16} />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-white"
          >
            {t("services.cta")} <ArrowUpRight size={16} />
          </Link>
        </div>
      </header>

      <section className="divide-y divide-white/10 border-y border-white/10">
        {content.services.length ? content.services.map((service, index) => (
          <article key={service.slug} className="grid gap-4 py-6 sm:grid-cols-[5rem_0.85fr_1.15fr] sm:gap-8 sm:py-8">
            <span className="text-xs tracking-[0.2em] text-[#8aa9ff]">0{index + 1}</span>
            <h2 className="text-2xl font-medium tracking-tight text-white">{service.content[locale]?.title || service.slug}</h2>
            <p className="max-w-xl text-sm leading-7 text-slate-400">{service.content[locale]?.description}</p>
          </article>
        )) : serviceKeys.map((key, index) => (
          <article key={key} className="grid gap-4 py-6 sm:grid-cols-[5rem_0.85fr_1.15fr] sm:gap-8 sm:py-8">
            <span className="text-xs tracking-[0.2em] text-[#8aa9ff]">0{index + 1}</span>
            <h2 className="text-2xl font-medium tracking-tight text-white">
              {t(`service.${key}` as TranslationKey)}
            </h2>
            <div>
              <p className="max-w-xl text-sm leading-7 text-slate-400">
                {t(`service.${key}.desc` as TranslationKey)}
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {featureKeys[index].map((feature) => (
                  <li key={feature} className="text-xs text-slate-300">
                    {t(`service.feature.${feature}` as TranslationKey)}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
