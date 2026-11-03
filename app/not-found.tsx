"use client";

import Link from "next/link";
import { useLocale } from "@/components/locale-provider";

export default function NotFound() {
  const { t } = useLocale();

  return (
    <main className="page-shell min-h-screen">
      <div className="mx-auto max-w-xl rounded-[28px] border border-white/10 bg-[#0e1116] p-10 text-center shadow-2xl shadow-black/30">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#8aa9ff]">404</p>
        <h1 className="text-4xl font-semibold text-white">{t("notFound.title")}</h1>
        <p className="mt-4 text-base text-slate-300">
          {t("notFound.description")}
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full border border-[#397BFF] bg-[#397BFF] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2e69e8]"
        >
          {t("notFound.home")}
        </Link>
      </div>
    </main>
  );
}
