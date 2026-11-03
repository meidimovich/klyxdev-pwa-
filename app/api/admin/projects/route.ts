import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/supabase/admin-auth";

function unauthorized(status = 401) {
  return NextResponse.json({ error: "admin_access_required" }, { status });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function GET() {
  const session = await getAdminSession();
  if (!session.configured) return unauthorized(503);
  if (session.error) return unauthorized(500);
  if (!session.user) return unauthorized();

  const { data, error } = await session.client
    .from("projects")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "projects_load_failed" }, { status: 500 });
  return NextResponse.json({ projects: data });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.configured) return unauthorized(503);
  if (session.error) return unauthorized(500);
  if (!session.user) return unauthorized();

  try {
    const body: unknown = await request.json();
    if (!isRecord(body) || typeof body.slug !== "string" ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.slug) ||
        typeof body.category !== "string" || !isRecord(body.content)) {
      return NextResponse.json({ error: "invalid_project" }, { status: 400 });
    }

    const { data, error } = await session.client
      .from("projects")
      .insert({
        slug: body.slug,
        category: body.category,
        content: body.content,
        cover_image: typeof body.cover_image === "string" ? body.cover_image : null,
        is_published: body.is_published === true,
        position: Number.isInteger(body.position) ? body.position : 0,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: "project_create_failed" }, { status: 400 });
    return NextResponse.json({ project: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session.configured) return unauthorized(503);
  if (session.error) return unauthorized(500);
  if (!session.user) return unauthorized();

  try {
    const body: unknown = await request.json();
    if (!isRecord(body) || typeof body.id !== "string") {
      return NextResponse.json({ error: "invalid_project" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (typeof body.slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.slug)) updates.slug = body.slug;
    if (typeof body.category === "string") updates.category = body.category;
    if (isRecord(body.content)) updates.content = body.content;
    if (typeof body.cover_image === "string" || body.cover_image === null) updates.cover_image = body.cover_image;
    if (typeof body.is_published === "boolean") updates.is_published = body.is_published;
    if (Number.isInteger(body.position)) updates.position = body.position;

    if (!Object.keys(updates).length) {
      return NextResponse.json({ error: "empty_project_update" }, { status: 400 });
    }

    const { data, error } = await session.client
      .from("projects")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", body.id)
      .select()
      .maybeSingle();

    if (error) return NextResponse.json({ error: "project_update_failed" }, { status: 400 });
    if (!data) return NextResponse.json({ error: "project_not_found" }, { status: 404 });
    return NextResponse.json({ project: data });
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
    const { id } = await request.json();
    if (typeof id !== "string") return NextResponse.json({ error: "invalid_project" }, { status: 400 });

    const { data, error } = await session.client
      .from("projects")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) return NextResponse.json({ error: "project_delete_failed" }, { status: 400 });
    if (!data) return NextResponse.json({ error: "project_not_found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
}
