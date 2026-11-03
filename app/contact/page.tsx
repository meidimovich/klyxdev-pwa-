"use client";

import { ContactForm } from "@/components/contact-form";
import { ArrowUpRight, Mail, Send } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { useSiteContent } from "@/hooks/use-site-content";

export default function ContactPage() {
  const { t } = useLocale();
  const content = useSiteContent();
  const email = content.settings.email || "hello@klyxdev.dev";
  const telegram = content.settings.telegram || "@klyxdev";
  const telegramHandle = telegram.replace(/^@/, "");

  return (
    <main className="contact-page space-y-10 pb-8">
      <header className="contact-heading max-w-4xl border-b border-white/10 pb-10 pt-5">
        <p className="text-xs uppercase tracking-[0.26em] text-[#8aa9ff]">{t("contact.eyebrow")}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
          {t("contact.title")}
        </h1>
      </header>

      <section className="contact-layout grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
        <aside className="contact-details flex flex-col justify-between border-l border-white/15 pl-5 sm:pl-7">
          <div>
            <h2 className="text-xl font-medium text-white">{t("contact.reach")}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{t("contact.response")}</p>
          </div>
          <dl className="contact-methods mt-8 space-y-3">
            <div className="contact-method">
              <span className="contact-method-icon"><Mail size={18} aria-hidden="true" /></span>
              <div className="min-w-0">
                <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">{t("contact.email")}</dt>
                <dd className="mt-1.5">
                  <a className="text-sm text-white transition-colors hover:text-[#b7caff]" href={`mailto:${email}`}>
                    {email}
                  </a>
                </dd>
              </div>
              <ArrowUpRight className="contact-method-arrow" size={16} aria-hidden="true" />
            </div>
            <div className="contact-method">
              <span className="contact-method-icon"><Send size={18} aria-hidden="true" /></span>
              <div className="min-w-0">
                <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">{t("contact.telegram")}</dt>
                <dd className="mt-1.5">
                  <a className="text-sm text-white transition-colors hover:text-[#b7caff]" href={`https://t.me/${encodeURIComponent(telegramHandle)}`} target="_blank" rel="noreferrer">
                    {telegram.startsWith("@") ? telegram : `@${telegram}`}
                  </a>
                </dd>
              </div>
              <ArrowUpRight className="contact-method-arrow" size={16} aria-hidden="true" />
            </div>
            <div className="contact-process border-t border-white/10 pt-4">
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
