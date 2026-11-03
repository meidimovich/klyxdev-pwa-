"use client";

import { useLocale } from "@/components/locale-provider";
import type { TranslationKey } from "@/lib/i18n";
import { useSiteContent } from "@/hooks/use-site-content";

const principles = [
  "about.principle1",
  "about.principle2",
  "about.principle3",
  "about.principle4",
] as const;
const team = [
  ["team.strategy", "team.role.strategy"],
  ["team.design", "team.role.design"],
  ["team.frontend", "team.role.frontend"],
  ["team.backend", "team.role.backend"],
] as const;

export default function AboutPage() {
  const { t, locale } = useLocale();
  const content = useSiteContent();

  return (
    <main className="space-y-14 pb-8">
      <header className="max-w-4xl border-b border-white/10 pb-10 pt-5">
        <p className="text-xs uppercase tracking-[0.26em] text-[#8aa9ff]">{t("about.eyebrow")}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
          {t("about.title")}
        </h1>
      </header>

      <section className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr]">
        <h2 className="text-xs uppercase tracking-[0.22em] text-slate-500">{t("about.philosophy")}</h2>
        <div className="max-w-3xl space-y-5">
          <p className="text-xl leading-9 text-slate-200">{t("about.philosophy1")}</p>
          <p className="text-base leading-8 text-slate-400">{t("about.philosophy2")}</p>
        </div>
      </section>

      <section className="grid gap-8 border-y border-white/10 py-8 lg:grid-cols-[0.65fr_1.35fr]">
        <h2 className="text-xs uppercase tracking-[0.22em] text-slate-500">{t("about.principles")}</h2>
        <ol className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {principles.map((key, index) => (
            <li key={key} className="flex gap-4">
              <span className="text-xs tracking-[0.2em] text-[#8aa9ff]">0{index + 1}</span>
              <span className="text-sm leading-6 text-slate-300">{t(key)}</span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between border-b border-white/10 pb-4">
          <h2 className="text-xl font-medium text-white">{t("about.team")}</h2>
          <span className="text-xs text-slate-500">KLYXDEV</span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {content.team.length ? content.team.map((member, index) => (
            <article key={member.slug} className="border-t border-white/15 pt-4">
              <p className="text-xs tracking-[0.2em] text-[#8aa9ff]">0{index + 1}</p>
              <h3 className="mt-4 text-lg font-medium text-white">{member.content[locale]?.title || member.slug}</h3>
              <p className="mt-2 text-sm text-slate-500">{member.content[locale]?.description}</p>
            </article>
          )) : team.map(([name, role], index) => (
            <article key={name} className="border-t border-white/15 pt-4">
              <p className="text-xs tracking-[0.2em] text-[#8aa9ff]">0{index + 1}</p>
              <h3 className="mt-4 text-lg font-medium text-white">{t(name as TranslationKey)}</h3>
              <p className="mt-2 text-sm text-slate-500">{t(role as TranslationKey)}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
