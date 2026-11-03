"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { useLocale } from "@/components/locale-provider";

const projectTypes = [
  { key: "form.website", value: "Website", base: 2000 },
  { key: "form.pwa", value: "PWA app", base: 3200 },
  { key: "form.telegramApp", value: "Telegram WebApp", base: 1800 },
  { key: "form.ecommerce", value: "E-commerce", base: 3500 },
  { key: "form.integrations", value: "Integrations", base: 2200 },
  { key: "form.ai", value: "AI solution", base: 4700 },
] as const;

const featureOptions = [
  { key: "feature.landing", value: "Landing page", price: 600 },
  { key: "feature.cms", value: "CMS", price: 800 },
  { key: "feature.auth", value: "User auth", price: 1200 },
  { key: "feature.admin", value: "Admin panel", price: 1400 },
  { key: "feature.payments", value: "Payments", price: 1500 },
  { key: "feature.automation", value: "Automation", price: 1800 },
  { key: "feature.ai", value: "AI assistant", price: 2300 },
] as const;

const scopeOptions = [
  { key: "calculator.scope.startup", value: "Startup", multiplier: 0.9 },
  { key: "calculator.scope.business", value: "Business", multiplier: 1.1 },
  { key: "calculator.scope.enterprise", value: "Enterprise", multiplier: 1.45 },
] as const;

const requirementOptions = [
  { key: "requirement.branding", value: "Branding and visuals", price: 700 },
  { key: "requirement.seo", value: "SEO and analytics", price: 500 },
  { key: "requirement.mobile", value: "Full mobile version", price: 900 },
  { key: "requirement.integrations", value: "Custom integrations", price: 1500 },
] as const;

const stepKeys = [
  "calculator.step.type",
  "calculator.step.features",
  "calculator.step.scope",
  "calculator.step.requirements",
  "calculator.step.contact",
] as const;

export function Calculator() {
  const { t } = useLocale();
  const [stepIndex, setStepIndex] = useState(0);
  const [projectType, setProjectType] = useState<string>(projectTypes[0].value);
  const [features, setFeatures] = useState<string[]>(["Landing page", "CMS"]);
  const [scope, setScope] = useState<string>("Business");
  const [requirements, setRequirements] = useState<string[]>(["Branding and visuals"]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const basePrice = projectTypes.find((item) => item.value === projectType)?.base ?? 2000;
  const featureTotal = featureOptions
    .filter((item) => features.includes(item.value))
    .reduce((sum, item) => sum + item.price, 0);
  const requirementTotal = requirementOptions
    .filter((item) => requirements.includes(item.value))
    .reduce((sum, item) => sum + item.price, 0);
  const multiplier = scopeOptions.find((item) => item.value === scope)?.multiplier ?? 1.1;
  const total = Math.round((basePrice + featureTotal + requirementTotal) * multiplier);
  const currentType = projectTypes.find((item) => item.value === projectType) ?? projectTypes[0];
  const canSubmit = name.trim().length > 0 && contact.trim().length > 0;

  function toggle(value: string, values: string[], setValues: (next: string[]) => void) {
    setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
    setStatus("idle");
  }

  function next() {
    setStepIndex((current) => Math.min(current + 1, stepKeys.length - 1));
  }

  function back() {
    setStepIndex((current) => Math.max(current - 1, 0));
  }

  async function submit() {
    if (!canSubmit || status === "sending") return;
    setStatus("sending");

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          contact: contact.trim(),
          projectType: t(currentType.key),
          budget: `$${total.toLocaleString()} estimate`,
          details: `${t("calculator.estimate")}: $${total.toLocaleString()}. ${features
            .map((feature) => {
              const option = featureOptions.find((item) => item.value === feature);
              return option ? t(option.key) : feature;
            })
            .join(", ")}`,
        }),
      });

      if (!response.ok) throw new Error(t("calculator.error"));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const stepContent = useMemo(() => {
    if (stepIndex === 0) {
      return (
        <div>
          <h2 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">{t("calculator.type.title")}</h2>
          <div className="mt-6 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {projectTypes.map((option, index) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={projectType === option.value}
                onClick={() => setProjectType(option.value)}
                className={`min-h-28 bg-[#0b0d11] p-4 text-left transition-colors hover:bg-[#11161c] sm:p-5 ${
                  projectType === option.value ? "bg-[#101a2b] ring-1 ring-inset ring-[#397BFF]" : ""
                }`}
              >
                <span className="flex items-start justify-between gap-3">
                  <span>
                    <span className="block text-xs tracking-[0.18em] text-slate-500">0{index + 1}</span>
                    <span className="mt-3 block text-sm font-medium text-white">{t(option.key)}</span>
                  </span>
                  {projectType === option.value ? <Check size={17} className="text-[#8aa9ff]" /> : null}
                </span>
                <span className="mt-3 block text-xs text-slate-500">{t("calculator.type.from")} ${option.base.toLocaleString()}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (stepIndex === 1) {
      return (
        <div>
          <h2 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">{t("calculator.features.title")}</h2>
          <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
            {featureOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={features.includes(option.value)}
                onClick={() => toggle(option.value, features, setFeatures)}
                className="flex w-full items-center justify-between gap-3 py-4 text-left transition-colors hover:text-white"
              >
                <span className="flex items-center gap-3 text-sm text-slate-200">
                  <span className={`flex h-5 w-5 items-center justify-center border ${features.includes(option.value) ? "border-[#397BFF] bg-[#397BFF] text-white" : "border-white/20 text-transparent"}`}>
                    <Check size={13} />
                  </span>
                  {t(option.key)}
                </span>
                <span className="text-xs text-slate-500">+${option.price.toLocaleString()}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (stepIndex === 2) {
      return (
        <div>
          <h2 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">{t("calculator.scope.title")}</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {scopeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={scope === option.value}
                onClick={() => setScope(option.value)}
                className={`min-h-32 border p-5 text-left transition-colors ${
                  scope === option.value ? "border-[#397BFF] bg-[#101a2b]" : "border-white/10 hover:border-white/25"
                }`}
              >
                <span className="text-lg font-medium text-white">{t(option.key)}</span>
                <span className="mt-3 block text-xs text-slate-500">×{option.multiplier}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (stepIndex === 3) {
      return (
        <div>
          <h2 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">{t("calculator.requirements.title")}</h2>
          <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
            {requirementOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={requirements.includes(option.value)}
                onClick={() => toggle(option.value, requirements, setRequirements)}
                className="flex w-full items-center justify-between gap-3 py-4 text-left"
              >
                <span className="flex items-center gap-3 text-sm text-slate-200">
                  <span className={`flex h-5 w-5 items-center justify-center border ${requirements.includes(option.value) ? "border-[#397BFF] bg-[#397BFF] text-white" : "border-white/20 text-transparent"}`}>
                    <Check size={13} />
                  </span>
                  {t(option.key)}
                </span>
                <span className="text-xs text-slate-500">+${option.price.toLocaleString()}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div>
        <h2 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">{t("calculator.contact.title")}</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="text-sm text-slate-300">
            <span className="mb-2 block">{t("calculator.name")}</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              autoComplete="name"
              placeholder={t("form.namePlaceholder")}
              className="w-full border border-white/10 bg-[#0b0d11] px-4 py-3 text-white outline-none transition-colors placeholder:text-slate-600 focus:border-[#397BFF]"
            />
          </label>
          <label className="text-sm text-slate-300">
            <span className="mb-2 block">{t("calculator.contact")}</span>
            <input
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              required
              autoComplete="email"
              placeholder={t("form.contactPlaceholder")}
              className="w-full border border-white/10 bg-[#0b0d11] px-4 py-3 text-white outline-none transition-colors placeholder:text-slate-600 focus:border-[#397BFF]"
            />
          </label>
        </div>
      </div>
    );
  }, [contact, features, name, projectType, requirements, scope, stepIndex, t]);

  return (
    <section className="grid gap-8 rounded-[1.5rem] border border-white/10 bg-[#0d1014] p-5 sm:p-8 lg:grid-cols-[1fr_19rem] lg:gap-12">
      <div>
        <ol className="mb-8 grid grid-cols-5 border-b border-white/10 pb-4">
          {stepKeys.map((key, index) => (
            <li
              key={key}
              className={`border-t pt-3 text-[10px] uppercase tracking-[0.12em] sm:text-xs ${
                index === stepIndex ? "border-[#397BFF] text-white" : index < stepIndex ? "border-white/50 text-slate-300" : "border-white/10 text-slate-600"
              }`}
            >
              <span className="mr-1 hidden sm:inline">0{index + 1}</span>
              {t(key)}
            </li>
          ))}
        </ol>

        {stepContent}
        {status === "success" ? <p role="status" className="mt-5 text-sm text-emerald-300">{t("calculator.sent")}</p> : null}
        {status === "error" ? <p role="alert" className="mt-5 text-sm text-rose-300">{t("calculator.error")}</p> : null}

        <div className="mt-8 flex justify-between gap-3 border-t border-white/10 pt-5">
          <button
            type="button"
            onClick={back}
            disabled={stepIndex === 0 || status === "sending"}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition-colors hover:border-white/25 hover:text-white disabled:opacity-40"
          >
            <ArrowLeft size={15} /> {t("calculator.back")}
          </button>
          {stepIndex < stepKeys.length - 1 ? (
            <button type="button" onClick={next} className="inline-flex items-center gap-2 rounded-full bg-[#397BFF] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2d68ea]">
              {t("calculator.continue")} <ArrowRight size={15} />
            </button>
          ) : (
            <button type="button" onClick={() => void submit()} disabled={!canSubmit || status === "sending"} className="inline-flex items-center gap-2 rounded-full bg-[#397BFF] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2d68ea] disabled:cursor-not-allowed disabled:opacity-50">
              {status === "sending" ? t("calculator.sending") : t("calculator.send")}
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>

      <aside className="h-fit border-t border-white/10 pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{t("calculator.estimate")}</p>
        <p className="mt-3 text-4xl font-medium tracking-tight text-white">${total.toLocaleString()}</p>
        <dl className="mt-6 space-y-3 border-t border-white/10 pt-4 text-xs text-slate-400">
          <div className="flex justify-between gap-3">
            <dt>{t(currentType.key)}</dt>
            <dd>${basePrice.toLocaleString()}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>{t("calculator.featuresCount")}</dt>
            <dd>{features.length}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>{t("calculator.scope.title")}</dt>
            <dd>{t((scopeOptions.find((item) => item.value === scope) ?? scopeOptions[1]).key)}</dd>
          </div>
        </dl>
        <p className="mt-6 text-xs leading-5 text-slate-600">{t("calculator.description")}</p>
      </aside>
    </section>
  );
}
