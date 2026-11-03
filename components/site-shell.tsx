"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { LocaleProvider, useLocale } from "@/components/locale-provider";
import type { TranslationKey } from "@/lib/i18n";
import { useSiteContent } from "@/hooks/use-site-content";

const navItems: { href: string; label: TranslationKey }[] = [
  { href: "/", label: "nav.home" },
  { href: "/projects", label: "nav.projects" },
  { href: "/services", label: "nav.services" },
  { href: "/about", label: "nav.about" },
  { href: "/contact", label: "nav.contact" },
  { href: "/calculator", label: "nav.calculator" },
];

function LanguageSwitcher({ mobile = false }: { mobile?: boolean }) {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.03] p-1 ${mobile ? "w-full justify-center" : ""}`}
      aria-label={t("nav.language")}
    >
      {(["ru", "en"] as const).map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => setLocale(value)}
          aria-pressed={locale === value}
          className={`min-w-10 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#397BFF] ${
            locale === value
              ? "bg-white text-[#090A0C]"
              : "text-slate-400 hover:text-white"
          }`}
        >
          {value}
        </button>
      ))}
    </div>
  );
}

function ShellContent({ children }: { children: React.ReactNode }) {
  const { t } = useLocale();
  const { settings } = useSiteContent();
  const email = settings.email || "hello@klyxdev.dev";
  const telegram = settings.telegram || "@klyxdev";
  const telegramHandle = telegram.replace(/^@/, "");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#090A0C] text-[#F5F5F5]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#090A0C]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3"
            onClick={() => setMenuOpen(false)}
          >
            <Image
              src="/klyxdev-logo.png"
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 shrink-0 object-contain"
            />
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-white">
              KLYXDEV
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-[13px] text-slate-300 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#397BFF]"
              >
                {t(item.label)}
              </Link>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <LanguageSwitcher />
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#397BFF] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2d68ea] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {t("nav.discuss")}
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-200 transition-colors hover:border-white/25 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#397BFF] lg:hidden"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {menuOpen ? (
          <div className="border-t border-white/10 bg-[#0b0d11] px-4 py-5 lg:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-white/[0.06] py-3 text-sm text-slate-200 transition-colors hover:text-white"
                >
                  {t(item.label)}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#397BFF] px-4 py-3 text-sm font-medium text-white"
              >
                {t("nav.discuss")}
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
              <div className="mt-4">
                <LanguageSwitcher mobile />
              </div>
            </nav>
          </div>
        ) : null}
      </header>

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        {children}
      </div>

      <footer className="border-t border-white/10 bg-[#0b0d11]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_0.8fr_0.8fr] lg:px-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 font-semibold">
                <Image
                  src="/klyxdev-logo.png"
                  alt=""
                  width={36}
                  height={36}
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="text-sm font-semibold uppercase tracking-[0.22em]">
                KLYXDEV
              </span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
              {t("footer.description")}
            </p>
            <div className="mt-6">
              <LanguageSwitcher />
            </div>
          </div>

          <div>
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              {t("footer.navigation")}
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-slate-300">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {t(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              {t("footer.contact")}
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>
                <a href={`mailto:${email}`} className="hover:text-white">
                  {email}
                </a>
              </li>
              <li>
                <a
                  href={`https://t.me/${encodeURIComponent(telegramHandle)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  {telegram.startsWith("@") ? telegram : `@${telegram}`}
                </a>
              </li>
              <li className="inline-flex items-center gap-2 text-xs text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {t("footer.availability")}
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/[0.06]">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-xs text-slate-600 sm:px-6 lg:px-8">
            <span>© KLYXDEV</span>
            <Link href="/admin/login" className="transition-colors hover:text-slate-300">
              {t("nav.admin")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <ShellContent>{children}</ShellContent>
    </LocaleProvider>
  );
}
