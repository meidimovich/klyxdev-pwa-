"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useLocale } from "@/components/locale-provider";

export function AdminLoginForm({ configured }: { configured: boolean }) {
  const { t } = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const result = await response.json() as { error?: string };
        setError(result.error === "admin_setup_incomplete" ? t("admin.setupIncomplete") :
          result.error === "supabase_not_configured" ? t("admin.notConfigured") : t("admin.loginError"));
        return;
      }

      router.push("/admin");
    } catch {
      setError(t("admin.loginError"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-[#0d1116] p-6 sm:p-9">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{t("admin.eyebrow")}</p>
      <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{t("admin.title")}</h1>
      <p className="mt-3 text-sm leading-6 text-slate-400">{t("admin.noRegistration")}</p>

      {!configured ? (
        <p role="status" className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm leading-6 text-amber-100">
          {t("admin.notConfigured")}
        </p>
      ) : (
        <form onSubmit={submit} className="mt-7 space-y-5">
          <label className="block text-sm text-slate-300">
            <span className="mb-2 block">{t("admin.email")}</span>
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#11161b] px-4 py-3 text-white outline-none transition focus:border-[#397BFF]"
            />
          </label>
          <label className="block text-sm text-slate-300">
            <span className="mb-2 block">{t("admin.password")}</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#11161b] px-4 py-3 text-white outline-none transition focus:border-[#397BFF]"
            />
          </label>
          {error ? <p role="alert" className="text-sm text-rose-300">{error}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#397BFF] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2d68ea] disabled:cursor-wait disabled:opacity-60"
          >
            {busy ? t("admin.loggingIn") : t("admin.login")}
          </button>
        </form>
      )}
    </section>
  );
}
