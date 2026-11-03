import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

import { AdminPanel } from "@/components/admin-panel";
import { AdminLoadingNotice } from "@/components/admin-loading-notice";
import { AdminSetupNotice } from "@/components/admin-setup-notice";
import { getAdminSession } from "@/lib/supabase/admin-auth";

export const metadata = {
  title: "Admin | KLYXDEV",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  return (
    <Suspense fallback={<main className="py-8 sm:py-12"><AdminLoadingNotice /></main>}>
      <AdminContent />
    </Suspense>
  );
}

async function AdminContent() {
  await connection();
  const session = await getAdminSession();

  if (!session.configured) {
    return <main className="py-8 sm:py-12"><AdminSetupNotice /></main>;
  }
  if (session.error) {
    return <main className="py-8 sm:py-12"><AdminSetupNotice /></main>;
  }
  if (!session.user) redirect("/admin/login");

  return <main className="py-4 sm:py-8"><AdminPanel /></main>;
}
