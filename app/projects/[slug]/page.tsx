"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { useLocale } from "@/components/locale-provider";
import { projectText } from "@/lib/i18n";
import { useProjects } from "@/hooks/use-projects";

export default function ProjectDetailPage() {
  const { t } = useLocale();

  return (
    <Suspense fallback={<p role="status" className="py-16 text-center text-sm text-slate-400">{t("project.loading")}</p>}>
      <ProjectDetailContent />
    </Suspense>
  );
}

function ProjectDetailContent() {
  const { slug } = useParams<{ slug: string }>();
  const { t, locale } = useLocale();
  const { projects, loading } = useProjects();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    if (loading) return <p role="status" className="py-16 text-center text-sm text-slate-400">{t("project.loading")}</p>;
    notFound();
  }

  const localized = (field: "title" | "description" | "detail1" | "detail2" | "detail3") =>
    field === "title" || field === "description"
      ? project.content?.[locale]?.[field] ?? projectText(locale, project.slug, field)
      : projectText(locale, project.slug, field);
  const projectDetails = project.content?.[locale]?.details?.length
    ? project.content[locale]?.details
    : ([1, 2, 3] as const)
        .map((index) => projectText(locale, project.slug, `detail${index}` as "detail1"))
        .filter((detail) => detail !== undefined);

  const categoryKey =
    project.category === "PWA"
      ? "category.pwa"
      : project.category === "Web Apps"
        ? "category.web"
        : project.category === "Sites"
          ? "category.sites"
          : project.category === "E-commerce"
            ? "category.commerce"
            : "category.ai";

  return (
    <main className="space-y-12 pb-8">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft size={16} />
        {t("project.back")}
      </Link>

      <header className="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#8aa9ff]">{t(categoryKey)}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
            {localized("title") ?? project.name}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
            {localized("description") ?? project.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tech.map((item) => (
              <span key={item} className="border border-white/10 px-3 py-1.5 text-xs text-slate-300">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="relative flex h-64 items-end justify-between overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(ellipse_at_68%_22%,#364154_0%,#1b222c_34%,#101317_76%)] p-6 sm:h-96 sm:p-8" style={project.cover ? { backgroundImage: `linear-gradient(180deg, transparent, rgba(9,10,12,.45)), url("${project.cover}")`, backgroundPosition: "center", backgroundSize: "cover" } : undefined}>
          <span className="text-xs uppercase tracking-[0.2em] text-white/60">{t("project.caseStudy")}</span>
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white">
            <ArrowUpRight size={18} />
          </span>
        </div>
      </header>

      {projectDetails.length ? (
        <section className="grid gap-8 lg:grid-cols-[0.55fr_1.45fr]">
          <h2 className="text-xs uppercase tracking-[0.22em] text-slate-500">{t("project.solution")}</h2>
          <ol className="divide-y divide-white/10 border-y border-white/10">
            {projectDetails.map((detail, index) => (
            <li key={index} className="grid gap-3 py-5 sm:grid-cols-[3rem_1fr]">
              <span className="text-xs tracking-[0.2em] text-[#8aa9ff]">0{index + 1}</span>
              <p className="max-w-2xl text-base leading-7 text-slate-300">
                {detail}
              </p>
            </li>
          ))}
          </ol>
        </section>
      ) : null}

      <section>
        <div className="mb-5 flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-medium text-white">{t("project.gallery")}</h2>
          <span className="text-xs uppercase tracking-[0.18em] text-slate-500">01 — 03</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((image) => (
            <div
              key={image}
              className={`h-48 overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(ellipse_at_60%_20%,#303b4b_0%,#161b22_40%,#0d1014_90%)] ${
                image === 1 ? "sm:mt-8" : ""
              }`}
              aria-label={`${t("project.gallery")} ${image + 1}`}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
