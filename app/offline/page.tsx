"use client";

import Link from "next/link";
import { useLocale } from "@/components/locale-provider";

export default function OfflinePage() {
  const { t } = useLocale();

  return (
    <main className="page-shell min-h-screen">
      <div className="mx-auto max-w-xl rounded-[28px] border border-white/10 bg-[#0e1116] p-10 text-center shadow-2xl shadow-black/30">
        <h1 className="text-4xl font-semibold text-white">{t("offline.title")}</h1>
        <p className="mt-4 text-base text-slate-300">
          {t("offline.description")}
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full border border-[#397BFF] bg-[#397BFF] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2e69e8]"
        >
          {t("offline.home")}
        </Link>
      </div>
    </main>
  );
}
