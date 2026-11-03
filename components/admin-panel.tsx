"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useLocale } from "@/components/locale-provider";
import type { TranslationKey } from "@/lib/i18n";

type ProjectContent = {
  title?: string;
  short?: string;
  description?: string;
};

type Project = {
  id: string;
  slug: string;
  category: string;
  content: { ru?: ProjectContent; en?: ProjectContent };
  cover_image: string | null;
  is_published: boolean;
  position: number;
};

type Application = {
  id: string;
  name: string;
  contact: string;
  project_type: string;
  budget: string;
  status: "new" | "in_progress" | "approved" | "rejected";
  created_at: string;
  details: string;
};

type ContentEntry = {
  id: string;
  slug: string;
  content: { ru?: ProjectContent; en?: ProjectContent };
  position: number;
  is_published: boolean;
};

type ContentData = {
  services: ContentEntry[];
  team: ContentEntry[];
  settings: { email?: string; telegram?: string };
};

type ProjectDraft = {
  id?: string;
  slug: string;
  category: string;
  titleRu: string;
  titleEn: string;
  shortRu: string;
  shortEn: string;
  descriptionRu: string;
  descriptionEn: string;
  coverImage: string;
  isPublished: boolean;
};

const emptyDraft: ProjectDraft = {
  slug: "",
  category: "Sites",
  titleRu: "",
  titleEn: "",
  shortRu: "",
  shortEn: "",
  descriptionRu: "",
  descriptionEn: "",
  coverImage: "",
  isPublished: false,
};

const tabs: { id: "dashboard" | "projects" | "applications" | "content" | "settings"; label: TranslationKey }[] = [
  { id: "dashboard", label: "admin.dashboard" },
  { id: "projects", label: "admin.projects" },
  { id: "applications", label: "admin.applications" },
  { id: "content", label: "admin.content" },
  { id: "settings", label: "admin.settings" },
];

export function AdminPanel() {
  const { t, locale } = useLocale();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [content, setContent] = useState<ContentData>({ services: [], team: [], settings: {} });
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("dashboard");
  const [draft, setDraft] = useState<ProjectDraft | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const endpoints = ["/api/admin/projects", "/api/admin/applications", "/api/admin/content"];
      const responses = await Promise.all(endpoints.map((endpoint) => fetch(endpoint, { cache: "no-store" })));
      if (responses.some((response) => response.status === 401)) {
        router.push("/admin/login");
        return;
      }
      if (responses.some((response) => !response.ok)) {
        setError(t("admin.loadError"));
        return;
      }

      const [projectData, applicationData, contentData] = await Promise.all(
        responses.map((response) => response.json()),
      );
      setProjects(projectData.projects);
      setApplications(applicationData.applications);
      setContent(contentData);
    } catch {
      setError(t("admin.loadError"));
    } finally {
      setLoading(false);
    }
  }, [router, t]);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active) void loadData();
    });
    return () => { active = false; };
  }, [loadData]);

  const visibleApplications = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase();
    return applications.filter((application) => {
      const matchesStatus = statusFilter === "all" || application.status === statusFilter;
      const matchesSearch = !needle || [
        application.name,
        application.contact,
        application.project_type,
        application.details,
      ].some((value) => value.toLocaleLowerCase().includes(needle));
      return matchesStatus && matchesSearch;
    });
  }, [applications, search, statusFilter]);

  async function apiRequest(url: string, method: string, body?: unknown) {
    const response = await fetch(url, {
      method,
      headers: body instanceof FormData ? undefined : { "Content-Type": "application/json" },
      body: body instanceof FormData ? body : body === undefined ? undefined : JSON.stringify(body),
    });
    if (response.status === 401) {
      router.push("/admin/login");
      throw new Error(t("admin.sessionExpired"));
    }
    if (!response.ok) throw new Error(t("admin.saveError"));
    return response;
  }

  async function logout() {
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (!response.ok) throw new Error(t("admin.saveError"));
      router.push("/admin/login");
    } catch {
      setError(t("admin.saveError"));
    }
  }

  async function saveProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...(draft.id ? { id: draft.id } : {}),
        slug: draft.slug,
        category: draft.category,
        content: {
          ru: { title: draft.titleRu, short: draft.shortRu, description: draft.descriptionRu },
          en: { title: draft.titleEn, short: draft.shortEn, description: draft.descriptionEn },
        },
        cover_image: draft.coverImage || null,
        is_published: draft.isPublished,
      };
      await apiRequest("/api/admin/projects", draft.id ? "PATCH" : "POST", payload);
      setDraft(null);
      setNotice(t("admin.projectSaveSuccess"));
      await loadData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t("admin.saveError"));
    } finally {
      setSaving(false);
    }
  }

  async function toggleProject(project: Project) {
    try {
      await apiRequest("/api/admin/projects", "PATCH", { id: project.id, is_published: !project.is_published });
      await loadData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t("admin.saveError"));
    }
  }

  async function deleteProject(project: Project) {
    if (!window.confirm(t("admin.confirmDelete"))) return;
    try {
      await apiRequest("/api/admin/projects", "DELETE", { id: project.id });
      setNotice(t("admin.projectDeleteSuccess"));
      await loadData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t("admin.saveError"));
    }
  }

  async function uploadImage(file: File) {
    setSaving(true);
    setError("");
    try {
      const formData = new FormData();
      formData.set("file", file);
      const response = await apiRequest("/api/admin/project-image", "POST", formData);
      const result = await response.json();
      setDraft((current) => current ? { ...current, coverImage: result.url } : current);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t("admin.saveError"));
    } finally {
      setSaving(false);
    }
  }

  async function updateApplication(application: Application, status: Application["status"]) {
    try {
      await apiRequest("/api/admin/applications", "PATCH", { id: application.id, status });
      setApplications((items) => items.map((item) => item.id === application.id ? { ...item, status } : item));
      setNotice(t("admin.statusSaveSuccess"));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t("admin.saveError"));
    }
  }

  async function saveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      setSaving(true);
      await apiRequest("/api/admin/content", "PATCH", {
        section: "site_settings",
        key: "public",
        content: {
          email: String(form.get("email") ?? "").trim(),
          telegram: String(form.get("telegram") ?? "").trim(),
        },
      });
      setNotice(t("admin.contentSaveSuccess"));
      await loadData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t("admin.saveError"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p role="status" className="py-16 text-center text-sm text-slate-400">{t("admin.loading")}</p>;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-[#0d1116] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{t("admin.eyebrow")}</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">KLYXDEV</h1>
        </div>
        <button type="button" onClick={logout} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/25">
          {t("admin.logout")}
        </button>
      </header>

      <nav aria-label={t("admin.dashboard")} className="flex gap-2 overflow-x-auto border-b border-white/10 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => { setActiveTab(tab.id); setNotice(""); setError(""); }}
            aria-current={activeTab === tab.id ? "page" : undefined}
            className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${activeTab === tab.id ? "bg-white text-[#090A0C]" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
          >
            {t(tab.label)}
          </button>
        ))}
      </nav>

      {notice ? <p role="status" className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-sm text-emerald-200">{notice}</p> : null}
      {error ? <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/5 px-4 py-3 text-sm text-rose-200">{error}</p> : null}

      {activeTab === "dashboard" ? (
        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              [t("admin.totalApplications"), applications.length],
              [t("admin.newApplications"), applications.filter((item) => item.status === "new").length],
              [t("admin.publishedProjects"), projects.filter((item) => item.is_published).length],
            ].map(([label, count]) => (
              <article key={label} className="border-l-2 border-[#397BFF] bg-white/[0.03] px-5 py-5">
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-2 text-3xl font-semibold text-white">{count}</p>
              </article>
            ))}
          </div>
          <section className="rounded-2xl border border-white/10 bg-[#0d1116] p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-white">{t("admin.recentActivity")}</h2>
            <div className="mt-4 divide-y divide-white/[0.07]">
              {applications.slice(0, 5).map((application) => (
                <div key={application.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-white">{application.name} <span className="text-slate-400">· {application.contact}</span></span>
                  <time className="text-xs text-slate-500">{new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(application.created_at))}</time>
                </div>
              ))}
              {applications.length === 0 ? <p className="py-5 text-sm text-slate-400">{t("admin.noApplications")}</p> : null}
            </div>
          </section>
        </section>
      ) : null}

      {activeTab === "projects" ? (
        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-white">{t("admin.projects")}</h2>
            <button type="button" onClick={() => setDraft({ ...emptyDraft })} className="rounded-full bg-[#397BFF] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#2d68ea]">
              {t("admin.createProject")}
            </button>
          </div>
          {draft ? (
            <form onSubmit={saveProject} className="grid gap-4 rounded-2xl border border-white/10 bg-[#0d1116] p-5 sm:grid-cols-2 sm:p-6">
              <label className="text-sm text-slate-300">{t("admin.projectSlug")}
                <input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} className="admin-input mt-2" />
              </label>
              <label className="text-sm text-slate-300">{t("admin.projectCategory")}
                <input required value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} className="admin-input mt-2" />
              </label>
              <label className="text-sm text-slate-300">{t("admin.projectTitleRu")}
                <input required value={draft.titleRu} onChange={(event) => setDraft({ ...draft, titleRu: event.target.value })} className="admin-input mt-2" />
              </label>
              <label className="text-sm text-slate-300">{t("admin.projectTitleEn")}
                <input required value={draft.titleEn} onChange={(event) => setDraft({ ...draft, titleEn: event.target.value })} className="admin-input mt-2" />
              </label>
              <label className="text-sm text-slate-300">{t("admin.projectShortRu")}
                <textarea required value={draft.shortRu} onChange={(event) => setDraft({ ...draft, shortRu: event.target.value })} className="admin-input mt-2 min-h-20" />
              </label>
              <label className="text-sm text-slate-300">{t("admin.projectShortEn")}
                <textarea required value={draft.shortEn} onChange={(event) => setDraft({ ...draft, shortEn: event.target.value })} className="admin-input mt-2 min-h-20" />
              </label>
              <label className="text-sm text-slate-300">{t("admin.projectDescriptionRu")}
                <textarea value={draft.descriptionRu} onChange={(event) => setDraft({ ...draft, descriptionRu: event.target.value })} className="admin-input mt-2 min-h-24" />
              </label>
              <label className="text-sm text-slate-300">{t("admin.projectDescriptionEn")}
                <textarea value={draft.descriptionEn} onChange={(event) => setDraft({ ...draft, descriptionEn: event.target.value })} className="admin-input mt-2 min-h-24" />
              </label>
              <div className="sm:col-span-2">
                <label className="block text-sm text-slate-300">{t("admin.projectImage")}</label>
                <input type="url" value={draft.coverImage} onChange={(event) => setDraft({ ...draft, coverImage: event.target.value })} className="admin-input mt-2" />
                <label className="mt-3 inline-flex cursor-pointer rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 hover:border-white/25">
                  {t("admin.uploadImage")}
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadImage(file); }} />
                </label>
              </div>
              <label className="flex items-center gap-3 text-sm text-slate-300 sm:col-span-2">
                <input type="checkbox" checked={draft.isPublished} onChange={(event) => setDraft({ ...draft, isPublished: event.target.checked })} />
                {t("admin.projectPublished")}
              </label>
              <div className="flex gap-3 sm:col-span-2">
                <button disabled={saving} className="rounded-full bg-[#397BFF] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">{saving ? t("admin.loading") : t("admin.saveProject")}</button>
                <button type="button" onClick={() => setDraft(null)} className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-slate-300">{t("admin.cancel")}</button>
              </div>
            </form>
          ) : null}
          <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#0d1116] px-5">
            {projects.map((project) => (
              <article key={project.id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h3 className="truncate font-medium text-white">{project.content?.[locale]?.title || project.slug}</h3>
                  <p className="mt-1 text-xs text-slate-400">{project.category} · {project.slug}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setDraft({
                    id: project.id, slug: project.slug, category: project.category,
                    titleRu: project.content?.ru?.title ?? "", titleEn: project.content?.en?.title ?? "",
                    shortRu: project.content?.ru?.short ?? "", shortEn: project.content?.en?.short ?? "",
                    descriptionRu: project.content?.ru?.description ?? "", descriptionEn: project.content?.en?.description ?? "",
                    coverImage: project.cover_image ?? "", isPublished: project.is_published,
                  })} className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-200 hover:border-white/25">{t("admin.edit")}</button>
                  <button type="button" onClick={() => void toggleProject(project)} className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-200 hover:border-white/25">
                    {project.is_published ? t("admin.unpublish") : t("admin.publish")}
                  </button>
                  <button type="button" onClick={() => void deleteProject(project)} className="rounded-full border border-rose-300/20 px-3 py-2 text-xs text-rose-200 hover:bg-rose-300/10">{t("admin.delete")}</button>
                </div>
              </article>
            ))}
            {projects.length === 0 ? <p className="py-8 text-sm text-slate-400">{t("admin.emptyProjects")}</p> : null}
          </div>
        </section>
      ) : null}

      {activeTab === "applications" ? (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">{t("admin.applications")}</h2>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input aria-label={t("admin.search")} placeholder={t("admin.search")} value={search} onChange={(event) => setSearch(event.target.value)} className="admin-input" />
            <select aria-label={t("admin.allStatuses")} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="admin-input sm:min-w-48">
              <option value="all">{t("admin.allStatuses")}</option>
              {(["new", "in_progress", "approved", "rejected"] as const).map((status) => <option key={status} value={status}>{t(`admin.status.${status}`)}</option>)}
            </select>
          </div>
          <div className="space-y-3">
            {visibleApplications.map((application) => (
              <article key={application.id} className="rounded-2xl border border-white/10 bg-[#0d1116] p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-medium text-white">{application.name}</h3>
                    <p className="mt-1 text-sm text-slate-300">{application.contact}</p>
                    <p className="mt-1 text-xs text-slate-500">{application.project_type} · {application.budget} · {t("admin.date")}: {new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(application.created_at))}</p>
                  </div>
                  <select value={application.status} onChange={(event) => void updateApplication(application, event.target.value as Application["status"])} className="admin-input sm:w-auto">
                    {(["new", "in_progress", "approved", "rejected"] as const).map((status) => <option key={status} value={status}>{t(`admin.status.${status}`)}</option>)}
                  </select>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-400">{application.details}</p>
              </article>
            ))}
            {visibleApplications.length === 0 ? <p className="rounded-2xl border border-white/10 bg-[#0d1116] p-5 text-sm text-slate-400">{applications.length ? t("admin.searchEmpty") : t("admin.noApplications")}</p> : null}
          </div>
        </section>
      ) : null}

      {activeTab === "content" ? (
        <ContentEditor content={content} apiRequest={apiRequest} refresh={loadData} notify={setNotice} fail={setError} saving={saving} setSaving={setSaving} />
      ) : null}

      {activeTab === "settings" ? (
        <form onSubmit={saveSettings} className="max-w-2xl space-y-5 rounded-2xl border border-white/10 bg-[#0d1116] p-5 sm:p-7">
          <h2 className="text-xl font-semibold text-white">{t("admin.contactSettings")}</h2>
          <label className="block text-sm text-slate-300">{t("admin.contactEmail")}
            <input type="email" name="email" defaultValue={content.settings.email ?? ""} className="admin-input mt-2" />
          </label>
          <label className="block text-sm text-slate-300">{t("admin.contactTelegram")}
            <input name="telegram" defaultValue={content.settings.telegram ?? ""} className="admin-input mt-2" />
          </label>
          <button disabled={saving} className="rounded-full bg-[#397BFF] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">{t("admin.saveSettings")}</button>
        </form>
      ) : null}
    </div>
  );
}

function ContentEditor({
  content, apiRequest, refresh, notify, fail, saving, setSaving,
}: {
  content: ContentData;
  apiRequest: (url: string, method: string, body?: unknown) => Promise<Response>;
  refresh: () => Promise<void>;
  notify: (message: string) => void;
  fail: (message: string) => void;
  saving: boolean;
  setSaving: (value: boolean) => void;
}) {
  const { t } = useLocale();
  const [section, setSection] = useState<"services" | "team_members">("services");
  const [entryId, setEntryId] = useState("");
  const [slug, setSlug] = useState("");
  const [titleRu, setTitleRu] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descriptionRu, setDescriptionRu] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");

  const entries = section === "services" ? content.services : content.team;
  const sectionName = section === "services" ? t("admin.services") : t("admin.team");

  function editEntry(entry?: ContentEntry) {
    setEntryId(entry?.id ?? "");
    setSlug(entry?.slug ?? "");
    setTitleRu(entry?.content?.ru?.title ?? "");
    setTitleEn(entry?.content?.en?.title ?? "");
    setDescriptionRu(entry?.content?.ru?.description ?? "");
    setDescriptionEn(entry?.content?.en?.description ?? "");
  }

  async function saveEntry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      await apiRequest("/api/admin/content", "PATCH", {
        section,
        ...(entryId ? { id: entryId } : {}),
        slug,
        content: {
          ru: { title: titleRu, description: descriptionRu },
          en: { title: titleEn, description: descriptionEn },
        },
      });
      notify(t("admin.contentSaveSuccess"));
      editEntry();
      await refresh();
    } catch (requestError) {
      fail(requestError instanceof Error ? requestError.message : t("admin.saveError"));
    } finally {
      setSaving(false);
    }
  }

  async function deleteEntry(entry: ContentEntry) {
    if (!window.confirm(t("admin.confirmDeleteContent"))) return;
    setSaving(true);
    try {
      await apiRequest("/api/admin/content", "DELETE", { section, id: entry.id });
      notify(t("admin.contentDeleteSuccess"));
      if (entry.id === entryId) editEntry();
      await refresh();
    } catch (requestError) {
      fail(requestError instanceof Error ? requestError.message : t("admin.saveError"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {(["services", "team_members"] as const).map((value) => (
          <button key={value} type="button" onClick={() => { setSection(value); editEntry(); }} className={`rounded-full px-4 py-2 text-sm ${section === value ? "bg-white text-[#090A0C]" : "border border-white/10 text-slate-300"}`}>
            {value === "services" ? t("admin.services") : t("admin.team")}
          </button>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-2">
          <button type="button" onClick={() => editEntry()} className="w-full rounded-xl border border-dashed border-white/20 p-3 text-left text-sm text-slate-300 hover:border-white/40">{t("admin.create")} · {sectionName}</button>
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center gap-2">
              <button type="button" onClick={() => editEntry(entry)} className={`min-w-0 flex-1 truncate rounded-xl border p-3 text-left text-sm ${entry.id === entryId ? "border-[#397BFF]/60 bg-[#397BFF]/10 text-white" : "border-white/10 bg-[#0d1116] text-slate-300"}`}>
                {entry.content?.ru?.title || entry.slug}
              </button>
              <button type="button" disabled={saving} onClick={() => void deleteEntry(entry)} className="rounded-full border border-rose-300/20 px-3 py-2 text-xs text-rose-200 hover:bg-rose-300/10">{t("admin.delete")}</button>
            </div>
          ))}
          {entries.length === 0 ? <p className="px-2 py-3 text-sm text-slate-500">{t("admin.emptyProjects")}</p> : null}
        </div>
        <form onSubmit={saveEntry} className="space-y-4 rounded-2xl border border-white/10 bg-[#0d1116] p-5">
          <h2 className="text-lg font-semibold text-white">{t("admin.contentSettings")} · {sectionName}</h2>
          <label className="block text-sm text-slate-300">{t("admin.projectSlug")}
            <input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={slug} onChange={(event) => setSlug(event.target.value)} className="admin-input mt-2" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-slate-300">{t("admin.projectTitleRu")}
              <input required value={titleRu} onChange={(event) => setTitleRu(event.target.value)} className="admin-input mt-2" />
            </label>
            <label className="block text-sm text-slate-300">{t("admin.projectTitleEn")}
              <input required value={titleEn} onChange={(event) => setTitleEn(event.target.value)} className="admin-input mt-2" />
            </label>
            <label className="block text-sm text-slate-300">{t("admin.projectDescriptionRu")}
              <textarea value={descriptionRu} onChange={(event) => setDescriptionRu(event.target.value)} className="admin-input mt-2 min-h-28" />
            </label>
            <label className="block text-sm text-slate-300">{t("admin.projectDescriptionEn")}
              <textarea value={descriptionEn} onChange={(event) => setDescriptionEn(event.target.value)} className="admin-input mt-2 min-h-28" />
            </label>
          </div>
          <button disabled={saving} className="rounded-full bg-[#397BFF] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">{t("admin.save")}</button>
        </form>
      </div>
    </section>
  );
}
