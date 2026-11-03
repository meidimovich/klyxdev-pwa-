import { NextResponse } from "next/server";

import { appendApplication } from "@/lib/data-store";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const name = typeof payload?.name === "string" ? payload.name.trim() : "";
    const contact = typeof payload?.contact === "string" ? payload.contact.trim() : "";
    const details = typeof payload?.details === "string" ? payload.details.trim() : "";

    if (!name || name.length > 120 || !contact || contact.length > 240 || !details || details.length > 5000) {
      return NextResponse.json(
        { error: "Name, contact, and project details are required." },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("applications")
        .insert({
          name,
          contact,
          project_type: typeof payload.projectType === "string" ? payload.projectType.slice(0, 120) : "",
          budget: typeof payload.budget === "string" ? payload.budget.slice(0, 120) : "",
          details,
        })
        .select("id, created_at")
        .single();

      if (error) {
        return NextResponse.json({ error: "Unable to save application." }, { status: 500 });
      }

      return NextResponse.json({ ok: true, application: data }, { status: 201 });
    }

    const application = await appendApplication({
      name,
      contact,
      projectType: String(payload.projectType ?? "Website"),
      budget: String(payload.budget ?? "Not specified"),
      details,
      source: "web-form",
    });

    return NextResponse.json({ ok: true, application }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save application." },
      { status: 500 },
    );
  }
}
