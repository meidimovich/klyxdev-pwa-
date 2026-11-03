"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, BriefcaseBusiness, Home, Layers3, Mail, UsersRound } from "lucide-react";

import { LocaleProvider, useLocale } from "@/components/locale-provider";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";
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

const mobileNavItems = [
  { href: "/", label: "nav.home", icon: Home },
  { href: "/projects", label: "nav.projects", icon: BriefcaseBusiness },
  { href: "/services", label: "nav.services", icon: Layers3 },
  { href: "/about", label: "nav.about", icon: UsersRound },
  { href: "/contact", label: "nav.contact", icon: Mail },
] as const satisfies { href: string; label: TranslationKey; icon: typeof Home }[];

function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      className="mobile-language-switcher inline-flex items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.03] p-1"
      aria-label={t("nav.language")}
    >
      {(["ru", "en"] as const).map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => setLocale(value)}
          aria-pressed={locale === value}
          className={`mobile-language-option min-w-10 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#397BFF] ${
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

function RouteOutlet({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const outletRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outlet = outletRef.current;
    if (!outlet) return;

    const target = window.location.hash
      ? document.getElementById(window.location.hash.slice(1))
      : null;
    if (!target) {
      outlet.scrollTop = 0;
      return;
    }

    outlet.scrollTo({
      top:
        outlet.scrollTop +
        target.getBoundingClientRect().top -
        outlet.getBoundingClientRect().top,
    });
  }, [pathname]);

  return (
    <div ref={outletRef} className="site-route-frame">
      <div className="site-route-outlet mx-auto w-full max-w-7xl px-4 pb-20 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <div key={pathname} className="mobile-route-screen">
          {children}
        </div>
      </div>
      {footer}
    </div>
  );
}

function MobileNavigation() {
  const pathname = usePathname();
  const { t } = useLocale();
  const activeIndex = mobileNavItems.findIndex((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
  );

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="mobile-navigation" aria-label={t("nav.mobileNavigation")}>
      <span
        className="mobile-navigation-indicator"
        aria-hidden="true"
        style={{
          transform: `translateX(${Math.max(activeIndex, 0) * 100}%)`,
          opacity: activeIndex < 0 ? 0 : 1,
        }}
      />
      {mobileNavItems.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`mobile-navigation-link ${active ? "mobile-navigation-link-active" : ""}`}
          >
            <Icon size={19} strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
            <span>{t(item.label)}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SiteFooter() {
  const { t } = useLocale();
  const { settings } = useSiteContent();
  const email = settings.email || "hello@klyxdev.dev";
  const telegram = settings.telegram || "@klyxdev";
  const telegramHandle = telegram.replace(/^@/, "");

  return (
    <footer className="site-footer border-t border-white/10 bg-[#0b0d11]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 font-semibold">
              <Image
                src="/klyxdev-logo.png"
                alt=""
                width={36}
                height={36}
                unoptimized
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
  );
}

function ShellContent({ children }: { children: React.ReactNode }) {
  const { t } = useLocale();

  useEffect(() => {
    const root = document.documentElement;
    const viewport = window.visualViewport;

    const updateKeyboardInset = () => {
      const focusedControl = document.activeElement instanceof HTMLElement
        && document.activeElement.matches(".contact-page input, .contact-page textarea, .contact-page select");
      const viewportInset = viewport
        ? Math.max(0, window.innerHeight - viewport.offsetTop - viewport.height)
        : 0;
      const keyboardInset = focusedControl && viewportInset >= 80 ? viewportInset : 0;
      root.style.setProperty("--mobile-keyboard-inset", `${keyboardInset}px`);
    };

    document.addEventListener("focusin", updateKeyboardInset);
    window.addEventListener("resize", updateKeyboardInset);
    viewport?.addEventListener("resize", updateKeyboardInset);
    viewport?.addEventListener("scroll", updateKeyboardInset);
    updateKeyboardInset();

    return () => {
      document.removeEventListener("focusin", updateKeyboardInset);
      window.removeEventListener("resize", updateKeyboardInset);
      viewport?.removeEventListener("resize", updateKeyboardInset);
      viewport?.removeEventListener("scroll", updateKeyboardInset);
      root.style.removeProperty("--mobile-keyboard-inset");
    };
  }, []);

  return (
    <div className="site-shell flex min-h-screen flex-col bg-[#090A0C] text-[#F5F5F5]">
      <header className="site-header sticky top-0 z-40 border-b border-white/10 bg-[#090A0C]/90 backdrop-blur-xl">
        <div className="mobile-header-content mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3"
          >
            <Image
              src="/klyxdev-logo.png"
              alt=""
              width={48}
              height={48}
              unoptimized
              className="mobile-header-logo h-12 w-12 shrink-0 object-contain"
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

          <div className="flex shrink-0 items-center gap-2 lg:hidden">
            <LanguageSwitcher />
          </div>
        </div>
      </header>
      <Suspense fallback={null}>
        <PwaInstallPrompt />
      </Suspense>

      <Suspense
        fallback={
          <div className="site-route-frame">
            <div className="site-route-outlet mx-auto w-full max-w-7xl px-4 pb-20 pt-6 sm:px-6 sm:pt-8 lg:px-8">
              {children}
            </div>
            <SiteFooter />
          </div>
        }
      >
        <RouteOutlet footer={<SiteFooter />}>{children}</RouteOutlet>
      </Suspense>
      <Suspense fallback={null}>
        <MobileNavigation />
      </Suspense>
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
