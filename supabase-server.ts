import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient as createAdminClient } from "@supabase/supabase-js";

// Server-component / route-handler client, scoped to the signed-in admin's
// session cookie. Respects Row Level Security — this is what every
// authenticated read/write in the app should use by default.
export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll is called from a Server Component during rendering.
            // Middleware refreshes the session in that case, so this is safe to ignore.
          }
        },
      },
    }
  );
}

// Privileged client for server-only operations (uploads, deletes, download
// counters). Bypasses RLS via the service-role key.
// SUPABASE_SERVICE_ROLE_KEY must never be imported into a "use client" file
// or a Client Component — this module is only ever imported from
// app/api/** route handlers and server actions.
export function createAdminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
