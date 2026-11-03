"use client";

import { useEffect, useRef, useState } from "react";

import { useLocale } from "@/components/locale-provider";

const initialState = {
  name: "",
  contact: "",
  projectType: "website",
  budget: "10k-25k",
  details: "",
};

export function ContactForm() {
  const { t } = useLocale();
  const focusCheckTimers = useRef<number[]>([]);
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => () => {
    focusCheckTimers.current.forEach(window.clearTimeout);
  }, []);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const keepFocusedControlVisible = (control: HTMLElement) => {
    if (!window.matchMedia("(max-width: 1023px)").matches) return;

    const routeFrame = control.closest<HTMLElement>(".site-route-frame");
    if (!routeFrame) return;

    const viewport = window.visualViewport;
    const headerBottom = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0;
    const navigationTop = document.querySelector(".mobile-navigation")?.getBoundingClientRect().top
      ?? window.innerHeight;
    const visibleTop = Math.max(headerBottom, viewport?.offsetTop ?? 0) + 12;
    const visibleBottom = Math.min(
      navigationTop,
      (viewport?.offsetTop ?? 0) + (viewport?.height ?? window.innerHeight),
    ) - 12;
    const bounds = control.getBoundingClientRect();

    if (bounds.bottom > visibleBottom) {
      routeFrame.scrollTop += bounds.bottom - visibleBottom;
    } else if (bounds.top < visibleTop) {
      routeFrame.scrollTop -= visibleTop - bounds.top;
    }
  };

  const handleFocusCapture = (event: React.FocusEvent<HTMLFormElement>) => {
    const control = event.target;
    if (!(control instanceof HTMLElement) ||
      !control.matches("input, textarea, select, button[type='submit']")) {
      return;
    }

    requestAnimationFrame(() => keepFocusedControlVisible(control));
    focusCheckTimers.current.push(
      window.setTimeout(() => keepFocusedControlVisible(control), 100),
      window.setTimeout(() => keepFocusedControlVisible(control), 300),
      window.setTimeout(() => keepFocusedControlVisible(control), 600),
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(t("form.error"));
      }

      setStatus("success");
      setForm(initialState);
    } catch (submitError) {
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : t("form.error"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onFocusCapture={handleFocusCapture}
      className="space-y-5 rounded-[26px] border border-white/10 bg-[#0d1015] p-6 sm:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm text-slate-300">
          <span className="mb-2.5 block">{t("form.name")}</span>
          <input
            value={form.name}
            onChange={(event) => handleChange("name", event.target.value)}
            required
            className="w-full rounded-xl border border-white/10 bg-[#11161b] px-4 py-3 text-white outline-none transition focus:border-[#397BFF]"
            placeholder={t("form.namePlaceholder")}
          />
        </label>

        <label className="block text-sm text-slate-300">
          <span className="mb-2.5 block">{t("form.contact")}</span>
          <input
            value={form.contact}
            onChange={(event) => handleChange("contact", event.target.value)}
            required
            className="w-full rounded-xl border border-white/10 bg-[#11161b] px-4 py-3 text-white outline-none transition focus:border-[#397BFF]"
            placeholder={t("form.contactPlaceholder")}
          />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm text-slate-300">
          <span className="mb-2.5 block">{t("form.projectType")}</span>
          <select
            value={form.projectType}
            onChange={(event) => handleChange("projectType", event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#11161b] px-4 py-3 text-white outline-none transition focus:border-[#397BFF]"
          >
            <option value="website">{t("form.website")}</option>
            <option value="pwa">{t("form.pwa")}</option>
            <option value="telegram">{t("form.telegramApp")}</option>
            <option value="ecommerce">{t("form.ecommerce")}</option>
            <option value="integrations">{t("form.integrations")}</option>
            <option value="ai">{t("form.ai")}</option>
          </select>
        </label>

        <label className="block text-sm text-slate-300">
          <span className="mb-2.5 block">{t("form.budget")}</span>
          <select
            value={form.budget}
            onChange={(event) => handleChange("budget", event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#11161b] px-4 py-3 text-white outline-none transition focus:border-[#397BFF]"
          >
            <option value="below-5k">{t("form.budgetBelow5")}</option>
            <option value="5k-10k">{t("form.budget5to10")}</option>
            <option value="10k-25k">{t("form.budget10to25")}</option>
            <option value="25k-50k">{t("form.budget25to50")}</option>
            <option value="50k+">{t("form.budget50plus")}</option>
          </select>
        </label>
      </div>

      <label className="block text-sm text-slate-300">
        <span className="mb-2.5 block">{t("form.details")}</span>
        <textarea
          value={form.details}
          onChange={(event) => handleChange("details", event.target.value)}
          required
          rows={5}
          className="w-full rounded-xl border border-white/10 bg-[#11161b] px-4 py-3 text-white outline-none transition focus:border-[#397BFF]"
          placeholder={t("form.detailsPlaceholder")}
        />
      </label>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {status === "success" ? (
        <p className="text-sm text-emerald-300">{t("form.success")}</p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center justify-center rounded-full bg-[#397BFF] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2d68ea] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? t("form.sending") : t("form.send")}
      </button>
    </form>
  );
}
