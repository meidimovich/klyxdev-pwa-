import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

import { AdminLoadingNotice } from "@/components/admin-loading-notice";
import { AdminLoginForm } from "@/components/admin-login-form";
import { AdminSetupNotice } from "@/components/admin-setup-notice";
import { getAdminSession } from "@/lib/supabase/admin-auth";

export const metadata = {
  title: "Admin sign in | KLYXDEV",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  return (
    <Suspense fallback={<main className="py-8 sm:py-12"><AdminLoadingNotice /></main>}>
      <AdminLoginContent />
    </Suspense>
  );
}

async function AdminLoginContent() {
  await connection();
  const session = await getAdminSession();
  if (session.user) redirect("/admin");
  if (session.error) return <main className="py-8 sm:py-12"><AdminSetupNotice /></main>;

  return <main className="py-8 sm:py-14"><AdminLoginForm configured={session.configured} /></main>;
}
