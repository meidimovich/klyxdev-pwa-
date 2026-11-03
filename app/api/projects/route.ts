import { connection, NextResponse } from "next/server";

import { defaultProjects } from "@/lib/site-data";
import { createSupabasePublicClient } from "@/lib/supabase/public";

export async function GET() {
  await connection();
  const supabase = createSupabasePublicClient();
  if (!supabase) return NextResponse.json({ projects: defaultProjects });

  const { data, error } = await supabase
    .from("projects")
    .select("slug, category, content, cover_image, position")
    .eq("is_published", true)
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load published projects from Supabase:", error.message);
    return NextResponse.json({ error: "projects_load_failed" }, { status: 500 });
  }

  const projects = (data ?? []).map((row) => {
    const content = row.content as {
        ru?: { title?: string; short?: string; description?: string; details?: string[]; tech?: string[] };
        en?: { title?: string; short?: string; description?: string; details?: string[]; tech?: string[] };
      };
    const ru = content?.ru ?? {};
    return {
      slug: row.slug,
      name: ru.title || row.slug,
      category: row.category,
      short: ru.short || "",
      description: ru.description || "",
      details: Array.isArray(ru.details) ? ru.details : [],
      tags: [],
      image: row.cover_image || "",
      cover: row.cover_image || "",
      published: true,
      metrics: [],
      tech: Array.isArray(ru.tech) ? ru.tech : [],
      content,
    };
  });

  return NextResponse.json({ projects });
}
