"use client";

import { useLocale } from "@/components/locale-provider";

export function AdminLoadingNotice() {
  const { t } = useLocale();

  return (
    <p role="status" className="mx-auto max-w-3xl py-16 text-center text-sm text-slate-400">
      {t("admin.loading")}
    </p>
  );
}
