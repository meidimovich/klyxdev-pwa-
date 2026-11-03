"use client";

import Link from "next/link";
import {
  ArrowRight,
  Blocks,
  Code2,
  Gauge,
  Layers3,
} from "lucide-react";

import { useLocale } from "@/components/locale-provider";
import { projectText } from "@/lib/i18n";
import { services } from "@/lib/site-data";
import { useProjects } from "@/hooks/use-projects";
import { useSiteContent } from "@/hooks/use-site-content";

const highlights = [
  { label: "home.stat.delivered", value: "01" },
  { label: "home.stat.launched", value: "02" },
  { label: "home.stat.focus", value: "03" },
];

const advantages = [
  { icon: Layers3, title: "home.why.strategy", text: "home.why.strategyText" },
  { icon: Code2, title: "home.why.engineering", text: "home.why.engineeringText" },
  { icon: Gauge, title: "home.why.delivery", text: "home.why.deliveryText" },
];

export default function HomePage() {
  const { t, locale } = useLocale();
  const { projects } = useProjects();
  const siteContent = useSiteContent();

  return (
    <main className="mobile-home-main space-y-8 pb-8">
      <section className="mobile-home-hero overflow-hidden rounded-[32px] border border-white/10 bg-[#0b0d12]">
        <div className="mobile-home-hero-content grid gap-8 px-5 pb-8 pt-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:pb-10">
          <div className="mobile-home-copy pt-3">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {t("home.availability")}
            </div>

            <h1 className="max-w-xl text-4xl leading-[0.98] font-semibold tracking-[-0.06em] text-white sm:text-6xl">
              {t("home.hero.title")}<br />
              {t("home.hero.titleLine2")}
            </h1>

            <p className="mobile-home-description mt-5 max-w-lg text-base leading-8 text-slate-300">
              {t("home.hero.description")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#397BFF] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2d68ea]"
              >
                {t("home.hero.discuss")}
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:text-white"
              >
                {t("home.hero.projects")}
              </Link>
            </div>

            <div className="mobile-home-highlights mt-10 grid max-w-xl grid-cols-3 gap-3">
              {highlights.map((item) => (
                <div key={item.label} className="border-t border-white/15 py-3">
                  <div className="text-xs font-medium tracking-[0.18em] text-[#8aa9ff]">{item.value}</div>
                  <div className="mt-2 text-xs leading-5 text-slate-400">{t(item.label as "home.stat.delivered")}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mobile-home-concept relative flex items-center justify-center">
            <div className="absolute bottom-0 left-10 h-40 w-40 rounded-full bg-[#397BFF]/10 blur-3xl" />
            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_rgba(17,22,27,0.1)_35%,_rgba(8,10,12,1)_80%)] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.45)] lg:rounded-[28px] lg:p-4">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 lg:rounded-[22px] lg:bg-[#10151b] lg:p-4">
                <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-slate-400">
                  <span>{t("home.concept")}</span>
                  <span>v2</span>
                </div>
                <div className="rounded-lg bg-transparent p-0 lg:rounded-[22px] lg:bg-[#0b0e12] lg:p-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 text-xs text-slate-400">
                    <span>KLYXDEV / STUDIO</span>
                    <span>01 — 04</span>
                  </div>
                  <div className="grid min-h-24 grid-cols-[1fr_auto] items-end gap-4 py-3 lg:min-h-48 lg:py-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#8aa9ff]">{t("home.mockup.eyebrow")}</p>
                      <p className="mt-3 max-w-[16rem] text-xl font-medium leading-tight tracking-tight text-white lg:text-2xl">{t("home.mockup.title")}</p>
                    </div>
                    <span className="mb-1 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-slate-300">↗</span>
                  </div>
                  <div className="grid grid-cols-3 border-t border-white/10 pt-4 text-[10px] uppercase tracking-[0.15em] text-slate-500">
                    <span>{t("home.mockup.strategy")}</span><span>{t("home.mockup.design")}</span><span>{t("home.mockup.engineering")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mobile-home-secondary rounded-[32px] border border-white/10 bg-[#0d1116] p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{t("home.featured.eyebrow")}</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">{t("home.featured.title")}</h2>
          </div>
          <Link href="/projects" className="text-sm text-slate-300 transition hover:text-white">
            {t("home.featured.all")}
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {projects.slice(0, 3).map((project) => (
            <Link key={project.slug} href={`/projects/${project.slug}`} className="group rounded-[26px] border border-white/10 bg-[#10161c] p-4 transition hover:border-white/20 hover:bg-[#121a21]">
              <div className="overflow-hidden rounded-[18px] border border-white/10 bg-[#0d141b]">
                <div className="h-48 bg-[radial-gradient(circle_at_top,#364154,#171d25_40%,#0d1014)]" style={project.cover ? { backgroundImage: `linear-gradient(180deg, transparent, rgba(9,10,12,.5)), url("${project.cover}")`, backgroundPosition: "center", backgroundSize: "cover" } : undefined} />
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300">
                  {t(project.category === "PWA" ? "category.pwa" : project.category === "Web Apps" ? "category.web" : project.category === "Sites" ? "category.sites" : project.category === "E-commerce" ? "category.commerce" : "category.ai")}
                </span>
                <span className="text-sm text-slate-400">→</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">{project.content?.[locale]?.title ?? projectText(locale, project.slug, "title") ?? project.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{project.content?.[locale]?.short ?? projectText(locale, project.slug, "short") ?? project.short}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mobile-home-secondary rounded-[32px] border border-white/10 bg-[#0d1116] p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{t("home.services.eyebrow")}</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">{t("home.services.title")}</h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(siteContent.services.length ? siteContent.services : services).map((service, index) => {
            const serviceKeys = ["websites", "pwa", "telegram", "ecommerce", "integrations", "ai"] as const;
            const serviceKey = serviceKeys[index];
            const featureKeys = [
              ["strategy", "landing", "cms", "seo"],
              ["offline", "install", "ux", "notifications"],
              ["bot", "flows", "light", "api"],
              ["catalog", "checkout", "inventory", "crm"],
              ["api", "automation", "reporting", "crm"],
              ["assistant", "summaries", "automation", "reporting"],
            ] as const;

            if ("content" in service) {
              return (
                <div key={service.slug} className="rounded-[24px] border border-white/10 bg-[#10161c] p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[#397BFF]/20 bg-[#397BFF]/10 text-[#9bb7ff]">
                    <Blocks size={18} />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{service.content[locale]?.title || service.slug}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{service.content[locale]?.description}</p>
                </div>
              );
            }

            return (
            <div key={service.title} className="rounded-[24px] border border-white/10 bg-[#10161c] p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[#397BFF]/20 bg-[#397BFF]/10 text-[#9bb7ff]">
                <Blocks size={18} />
              </div>
              <h3 className="text-xl font-semibold text-white">{t(`service.${serviceKey}` as "service.websites")}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{t(`service.${serviceKey}.desc` as "service.websites.desc")}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-200">
                {featureKeys[index].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#397BFF]" />
                    {t(`service.feature.${feature}` as "service.feature.strategy")}
                  </li>
                ))}
              </ul>
            </div>
            );
          })}
        </div>
      </section>

      <section className="mobile-home-secondary rounded-[32px] border border-white/10 bg-[#0d1116] p-6 sm:p-8">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{t("home.why.eyebrow")}</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">{t("home.why.title")}</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {advantages.map((item) => (
            <div key={item.title} className="border-t border-white/15 py-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#9bb7ff]">
                <item.icon size={18} />
              </div>
              <h3 className="text-xl font-semibold text-white">{t(item.title as "home.why.strategy")}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{t(item.text as "home.why.strategyText")}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mobile-home-secondary rounded-[32px] border border-white/10 bg-[#0d1116] p-6 sm:p-8">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{t("home.process.eyebrow")}</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">{t("home.process.title")}</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          {([1, 2, 3, 4] as const).map((index) => (
            <div key={index} className="border-t border-white/15 pt-4">
              <div className="mb-6 text-xs font-medium tracking-[0.2em] text-[#8aa9ff]">0{index}</div>
              <h3 className="max-w-48 text-lg font-medium text-white">{t(`home.process.${index}` as "home.process.1")}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="mobile-home-secondary rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,#10161c,#0d1116)] p-6 sm:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{t("home.cta.eyebrow")}</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">{t("home.cta.title")}</h2>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-[#397BFF] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2d68ea]"
          >
            {t("home.cta.button")}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
