import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/supabase/admin-auth";

const editableSections = ["services", "team_members"] as const;

function unauthorized(status = 401) {
  return NextResponse.json({ error: "admin_access_required" }, { status });
}

export async function GET() {
  const session = await getAdminSession();
  if (!session.configured) return unauthorized(503);
  if (session.error) return unauthorized(500);
  if (!session.user) return unauthorized();

  const [services, team, settings] = await Promise.all([
    session.client.from("services").select("*").order("position"),
    session.client.from("team_members").select("*").order("position"),
    session.client.from("site_settings").select("*").eq("key", "public").maybeSingle(),
  ]);
  if (services.error || team.error || settings.error) {
    return NextResponse.json({ error: "content_load_failed" }, { status: 500 });
  }
  return NextResponse.json({
    services: services.data,
    team: team.data,
    settings: settings.data?.content ?? {},
  });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session.configured) return unauthorized(503);
  if (session.error) return unauthorized(500);
  if (!session.user) return unauthorized();

  try {
    const body = await request.json();
    if (body.section === "site_settings" && body.key === "public" &&
        typeof body.content === "object" && body.content !== null && !Array.isArray(body.content)) {
      const { error } = await session.client
        .from("site_settings")
        .upsert({ key: "public", content: body.content, updated_at: new Date().toISOString() });
      if (error) return NextResponse.json({ error: "settings_save_failed" }, { status: 400 });
      return NextResponse.json({ ok: true });
    }

    if (!editableSections.includes(body.section) ||
        typeof body.slug !== "string" ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.slug) ||
        typeof body.content !== "object" || body.content === null || Array.isArray(body.content)) {
      return NextResponse.json({ error: "invalid_content" }, { status: 400 });
    }

    const table = body.section;
    const values = {
      slug: body.slug,
      content: body.content,
      position: Number.isInteger(body.position) ? body.position : 0,
      is_published: body.is_published !== false,
      updated_at: new Date().toISOString(),
    };
    const query = typeof body.id === "string"
      ? session.client.from(table).update(values).eq("id", body.id)
      : session.client.from(table).insert(values);
    const { error } = await query;
    if (error) return NextResponse.json({ error: "content_save_failed" }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session.configured) return unauthorized(503);
  if (session.error) return unauthorized(500);
  if (!session.user) return unauthorized();

  try {
    const body = await request.json();
    if (!editableSections.includes(body.section) || typeof body.id !== "string") {
      return NextResponse.json({ error: "invalid_content" }, { status: 400 });
    }

    const { data, error } = await session.client
      .from(body.section)
      .delete()
      .eq("id", body.id)
      .select("id")
      .maybeSingle();
    if (error) return NextResponse.json({ error: "content_delete_failed" }, { status: 400 });
    if (!data) return NextResponse.json({ error: "content_not_found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
}
