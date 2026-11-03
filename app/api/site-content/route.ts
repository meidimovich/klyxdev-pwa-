import { connection, NextResponse } from "next/server";

import { createSupabasePublicClient } from "@/lib/supabase/public";
import { siteSettings } from "@/lib/site-data";

export async function GET() {
  await connection();
  const supabase = createSupabasePublicClient();
  if (!supabase) {
    return NextResponse.json({ services: [], team: [], settings: siteSettings });
  }

  const [services, team, settings] = await Promise.all([
    supabase.from("services").select("slug, content, position").eq("is_published", true).order("position"),
    supabase.from("team_members").select("slug, content, position").eq("is_published", true).order("position"),
    supabase.from("site_settings").select("content").eq("key", "public").maybeSingle(),
  ]);
  if (services.error || team.error || settings.error) {
    console.error("Failed to load public site content from Supabase:", services.error?.message ?? team.error?.message ?? settings.error?.message);
    return NextResponse.json({ error: "site_content_load_failed" }, { status: 500 });
  }

  return NextResponse.json({
    services: services.data ?? [],
    team: team.data ?? [],
    settings: settings.data?.content ?? siteSettings,
  });
}
