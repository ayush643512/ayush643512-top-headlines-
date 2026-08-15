import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, createAdminSupabase } from "@/lib/supabase-server";
import { isImageFile, sanitizeFileName, MAX_IMAGE_BYTES } from "@/lib/validations";
import { nanoid } from "nanoid";

// POST /api/media/upload — admin only, multipart/form-data with one or
// more "images" fields. Supports multiple files in a single request.
export async function POST(request: NextRequest) {
  const authed = await createServerSupabase();
  const {
    data: { user },
  } = await authed.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "You don't have permission to access this page." }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const files = formData.getAll("images").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "At least one image is required." }, { status: 400 });
  }

  const admin = createAdminSupabase();
  const uploaded = [];

  for (const file of files) {
    if (!isImageFile(file) || file.size > MAX_IMAGE_BYTES) continue;

    const path = `library/${nanoid(8)}-${sanitizeFileName(file.name)}`;
    const { error: uploadError } = await admin.storage
      .from("images")
      .upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: false });

    if (uploadError) continue;

    const publicUrl = admin.storage.from("images").getPublicUrl(path).data.publicUrl;

    const { data: row } = await admin
      .from("media")
      .insert({
        file_name: file.name,
        file_url: publicUrl,
        file_path: path,
        file_type: file.type,
        file_size: file.size,
      })
      .select()
      .single();

    if (row) uploaded.push(row);
  }

  if (uploaded.length === 0) {
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ media: uploaded }, { status: 201 });
}
