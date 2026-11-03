import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase/supabaseClient";
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";
import { getUserClient } from "@/lib/supabase/getUserClient";

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB in bytes

// The extension comes from the MIME type, never from the uploaded file name:
// a crafted name could otherwise write outside the user's own folder.
const EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

async function handleUpload(request) {
  // 1. Check the user is logged in
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value;

  if (!accessToken) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    return Response.json({ error: "Invalid or expired session" }, { status: 401 });
  }

  const userId = data.user.id;

  // 2. Get the image from the form data
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return Response.json({ error: "No image uploaded" }, { status: 400 });
  }

  // 3. Check type and size
  const extension = EXTENSIONS[file.type];

  if (!extension) {
    return Response.json(
      { error: "Only JPEG, PNG and WebP images are allowed" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return Response.json({ error: "Image is too big (max 2 MB)" }, { status: 400 });
  }

  // 4. Upload it, replacing whatever the user had before
  const db = getUserClient(accessToken); // acts as the logged-in user (RLS)
  const path = `${userId}/avatar.${extension}`;

  const { error: uploadError } = await db.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    console.error("Avatar upload failed:", uploadError);
    return Response.json(
      { error: `Could not upload the image: ${uploadError.message}` },
      { status: 500 }
    );
  }

  // 5. Save the URL. The path never changes, so without the version the browser
  // and CDN would keep serving the previous image.
  const {
    data: { publicUrl },
  } = db.storage.from("avatars").getPublicUrl(path);

  const avatarUrl = `${publicUrl}?v=${Date.now()}`;

  const { error: saveError } = await supabaseAdmin
    .from("users")
    .update({ avatar_url: avatarUrl })
    .eq("id", userId);

  if (saveError) {
    console.error("Save avatar_url failed:", saveError);
    return Response.json({ error: "Could not save the image" }, { status: 500 });
  }

  return Response.json({ avatar_url: avatarUrl }, { status: 200 });
}

// Wrapper: any crash becomes a readable JSON error instead of a blank 500
export async function POST(request) {
  try {
    return await handleUpload(request);
  } catch (err) {
    console.error("Avatar upload crashed:", err);
    return Response.json({ error: `Server error: ${err.message}` }, { status: 500 });
  }
}
