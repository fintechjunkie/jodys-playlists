import type { MetadataRoute } from "next";
import { livePlaylists } from "@/lib/playlists";
import { playlistUrl, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...livePlaylists().map((p) => ({
      url: playlistUrl(p.slug),
      lastModified: p.published,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
