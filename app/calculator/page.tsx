"use client";

import { Calculator } from "@/components/calculator";
import { useLocale } from "@/components/locale-provider";

export default function CalculatorPage() {
  const { t } = useLocale();

  return (
    <main className="space-y-10 pb-8">
      <header className="max-w-4xl border-b border-white/10 pb-8 pt-5">
        <p className="text-xs uppercase tracking-[0.26em] text-[#8aa9ff]">{t("calculator.eyebrow")}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
          {t("calculator.title")}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
          {t("calculator.description")}
        </p>
      </header>
      <Calculator />
    </main>
  );
}
