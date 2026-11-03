import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/supabase/admin-auth";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.configured) {
    return NextResponse.json({ error: "supabase_not_configured" }, { status: 503 });
  }
  if (session.error) return NextResponse.json({ error: "admin_role_check_failed" }, { status: 500 });
  if (!session.user) return NextResponse.json({ error: "admin_access_required" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File) || !allowedTypes.has(file.type) || file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "invalid_image" }, { status: 400 });
  }

  const extension = file.type.split("/")[1].replace("jpeg", "jpg");
  const path = `${session.user.id}/${crypto.randomUUID()}.${extension}`;
  const { error } = await session.client.storage
    .from("project-images")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) return NextResponse.json({ error: "image_upload_failed" }, { status: 400 });
  const { data } = session.client.storage.from("project-images").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl }, { status: 201 });
}
