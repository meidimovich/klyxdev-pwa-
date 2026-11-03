"use client";

import { ContactForm } from "@/components/contact-form";
import { useLocale } from "@/components/locale-provider";
import { useSiteContent } from "@/hooks/use-site-content";

export default function ContactPage() {
  const { t } = useLocale();
  const content = useSiteContent();
  const email = content.settings.email || "hello@klyxdev.dev";
  const telegram = content.settings.telegram || "@klyxdev";
  const telegramHandle = telegram.replace(/^@/, "");

  return (
    <main className="space-y-10 pb-8">
      <header className="max-w-4xl border-b border-white/10 pb-10 pt-5">
        <p className="text-xs uppercase tracking-[0.26em] text-[#8aa9ff]">{t("contact.eyebrow")}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
          {t("contact.title")}
        </h1>
      </header>

      <section className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
        <aside className="flex flex-col justify-between border-l border-white/15 pl-5 sm:pl-7">
          <div>
            <h2 className="text-xl font-medium text-white">{t("contact.reach")}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{t("contact.response")}</p>
          </div>
          <dl className="mt-8 divide-y divide-white/10 border-y border-white/10">
            <div className="py-4">
              <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">{t("contact.email")}</dt>
              <dd className="mt-2">
                <a className="text-sm text-white hover:text-[#9bb7ff]" href={`mailto:${email}`}>
                  {email}
                </a>
              </dd>
            </div>
            <div className="py-4">
              <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">{t("contact.telegram")}</dt>
              <dd className="mt-2">
                <a className="text-sm text-white hover:text-[#9bb7ff]" href={`https://t.me/${encodeURIComponent(telegramHandle)}`} target="_blank" rel="noreferrer">
                  {telegram.startsWith("@") ? telegram : `@${telegram}`} ↗
                </a>
              </dd>
            </div>
            <div className="py-4">
              <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">{t("contact.process")}</dt>
              <dd className="mt-2 text-sm text-slate-300">{t("contact.processValue")}</dd>
            </div>
          </dl>
        </aside>
        <ContactForm />
      </section>
    </main>
  );
}
