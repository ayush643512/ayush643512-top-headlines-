import type { MetadataRoute } from "next";
import { createAdminSupabase } from "@/lib/supabase-server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const supabase = createAdminSupabase();

  const { data: docs } = await supabase
    .from("documents")
    .select("id, updated_at")
    .eq("published", true);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/documents`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const docRoutes: MetadataRoute.Sitemap = (docs ?? []).map((d) => ({
    url: `${siteUrl}/documents/${d.id}`,
    lastModified: d.updated_at,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...docRoutes];
}
