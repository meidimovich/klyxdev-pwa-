import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/supabase/admin-auth";

const statuses = ["new", "in_progress", "approved", "rejected"] as const;

function unauthorized(status = 401) {
  return NextResponse.json({ error: "admin_access_required" }, { status });
}

export async function GET() {
  const session = await getAdminSession();
  if (!session.configured) return unauthorized(503);
  if (session.error) return unauthorized(500);
  if (!session.user) return unauthorized();

  const { data, error } = await session.client
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) return NextResponse.json({ error: "applications_load_failed" }, { status: 500 });
  return NextResponse.json({ applications: data });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session.configured) return unauthorized(503);
  if (session.error) return unauthorized(500);
  if (!session.user) return unauthorized();

  try {
    const body = await request.json();
    if (typeof body.id !== "string" || !statuses.includes(body.status)) {
      return NextResponse.json({ error: "invalid_application_update" }, { status: 400 });
    }

    const { data, error } = await session.client
      .from("applications")
      .update({ status: body.status })
      .eq("id", body.id)
      .select()
      .maybeSingle();

    if (error) return NextResponse.json({ error: "application_update_failed" }, { status: 400 });
    if (!data) return NextResponse.json({ error: "application_not_found" }, { status: 404 });
    return NextResponse.json({ application: data });
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
}
