"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { useLocale } from "@/components/locale-provider";
import { projectText } from "@/lib/i18n";
import { useProjects } from "@/hooks/use-projects";

const filters = [
  { key: "all", translation: "projects.filter.all" },
  { key: "PWA", translation: "projects.filter.pwa" },
  { key: "Web Apps", translation: "projects.filter.web" },
  { key: "Sites", translation: "projects.filter.sites" },
  { key: "E-commerce", translation: "projects.filter.commerce" },
  { key: "AI", translation: "projects.filter.ai" },
] as const;

export default function ProjectsPage() {
  const { t, locale } = useLocale();
  const { projects: allProjects } = useProjects();
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]["key"]>("all");
  const projects = useMemo(
    () =>
      allProjects.filter(
        (project) => activeFilter === "all" || project.category === activeFilter,
      ),
    [activeFilter, allProjects],
  );

  return (
    <main className="space-y-12 pb-8">
      <header className="grid gap-8 border-b border-white/10 pb-10 pt-5 lg:grid-cols-[1fr_0.7fr] lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-[#8aa9ff]">{t("projects.eyebrow")}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
            {t("projects.title")}
          </h1>
        </div>
        <p className="max-w-xl text-sm leading-7 text-slate-400 lg:justify-self-end">
          {t("projects.description")}
        </p>
      </header>

      <div className="flex flex-wrap gap-2" role="group" aria-label={t("projects.eyebrow")}>
        {filters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            aria-pressed={activeFilter === filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#397BFF] ${
              activeFilter === filter.key
                ? "border-white bg-white text-[#090A0C]"
                : "border-white/10 text-slate-400 hover:border-white/30 hover:text-white"
            }`}
          >
            {t(filter.translation)}
          </button>
        ))}
      </div>

      {projects.length === 0 ? (
        <p className="py-16 text-center text-sm text-slate-400">{t("projects.empty")}</p>
      ) : (
        <section className="grid gap-x-6 gap-y-10 md:grid-cols-2">
          {projects.map((project, index) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group"
            >
              <div
                className={`relative overflow-hidden border border-white/10 bg-[#11161b] ${
                  index % 3 === 1 ? "rounded-[1.4rem]" : "rounded-[1.4rem] sm:rounded-[2rem]"
                }`}
              >
                <div className={`relative flex items-end justify-between p-5 sm:p-7 ${index % 2 ? "h-64 sm:h-80" : "h-56 sm:h-72"} bg-[radial-gradient(ellipse_at_68%_22%,#364154_0%,#1b222c_34%,#101317_76%)] transition-transform duration-500 group-hover:scale-[1.015]`} style={project.cover ? { backgroundImage: `linear-gradient(180deg, transparent, rgba(9,10,12,.45)), url("${project.cover}")`, backgroundPosition: "center", backgroundSize: "cover" } : undefined}>
                  <span className="text-xs uppercase tracking-[0.18em] text-white/60">
                    KLYXDEV / {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition-colors group-hover:bg-white group-hover:text-black">
                    <ArrowUpRight size={17} />
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#8aa9ff]">
                    {t(
                      project.category === "PWA"
                        ? "category.pwa"
                        : project.category === "Web Apps"
                          ? "category.web"
                          : project.category === "Sites"
                            ? "category.sites"
                            : project.category === "E-commerce"
                              ? "category.commerce"
                              : "category.ai",
                    )}
                  </p>
                  <h2 className="mt-2 text-xl font-medium text-white">
                    {project.content?.[locale]?.title ?? projectText(locale, project.slug, "title") ?? project.name}
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                    {project.content?.[locale]?.short ?? projectText(locale, project.slug, "short") ?? project.short}
                  </p>
                </div>
                <span className="hidden text-xs text-slate-500 sm:block">
                  {project.tech.slice(0, 2).join(" · ")}
                </span>
              </div>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
