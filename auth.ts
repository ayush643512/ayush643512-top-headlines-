import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";

// Call at the top of any admin server component/route that must be
// protected. Throws a redirect if there is no valid admin session.
export async function requireAdmin() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return user;
}

export async function getCurrentAdmin() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
