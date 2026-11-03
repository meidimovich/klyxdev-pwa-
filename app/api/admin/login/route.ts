import { NextResponse } from "next/server";

import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "supabase_not_configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json({ error: "invalid_credentials" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "supabase_not_configured" }, { status: 503 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
    }

    const { data: role, error: roleError } = await supabase
      .from("admin_users")
      .select("role")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (roleError) {
      await supabase.auth.signOut();
      return NextResponse.json({ error: "admin_setup_incomplete" }, { status: 503 });
    }

    if (role?.role !== "admin") {
      await supabase.auth.signOut();
      return NextResponse.json({ error: "admin_access_required" }, { status: 403 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
}
