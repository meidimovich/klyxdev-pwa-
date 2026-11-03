import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function getAdminSession() {
  if (!isSupabaseConfigured()) {
    return { configured: false as const, client: null, user: null, error: null };
  }

  const client = await createSupabaseServerClient();
  if (!client) {
    return { configured: false as const, client: null, user: null, error: null };
  }

  const { data: userData, error: userError } = await client.auth.getUser();
  if (!userData.user) {
    const missingSession = userError?.name === "AuthSessionMissingError";
    return { configured: true as const, client, user: null, error: missingSession ? null : userError };
  }

  const { data: admin, error: roleError } = await client
    .from("admin_users")
    .select("user_id, role")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (roleError) {
    return { configured: true as const, client, user: null, error: roleError };
  }

  if (admin?.role !== "admin") {
    return { configured: true as const, client, user: null, error: null };
  }

  return { configured: true as const, client, user: userData.user, error: null };
}
