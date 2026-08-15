// Browser / client-component Supabase client.
// Uses the public anon key only — safe to ship to the browser.
// Row Level Security policies (see supabase/schema.sql) restrict what
// an unauthenticated visitor can do with this client.
"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
