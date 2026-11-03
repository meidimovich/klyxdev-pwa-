"use client";

import { useLocale } from "@/components/locale-provider";

export function AdminSetupNotice() {
  const { t } = useLocale();

  return (
    <section className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-[#0d1116] p-6 sm:p-9">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{t("admin.eyebrow")}</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">{t("admin.configTitle")}</h1>
      <p className="mt-5 text-sm leading-7 text-slate-300">{t("admin.configSteps")}</p>
      <p className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4 font-mono text-xs leading-6 text-slate-300">
        SUPABASE_URL=…<br />
        SUPABASE_ANON_KEY=…
      </p>
      <p className="mt-4 text-sm text-slate-400">{t("admin.noRegistration")}</p>
    </section>
  );
}
