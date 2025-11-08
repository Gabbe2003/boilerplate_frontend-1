// src/server/updateViewedPost.ts
import "server-only";

export async function updateViewedPost(databaseId: number | string) {
  const fullUrl = process.env.WP_GRAPHQL_URL || "";
  const baseUrl = fullUrl.split("/graphql")[0];
  const url = `${baseUrl}/wp-json/hpv/v1/log-view/${databaseId}`;

  await fetch(url, {
    method: "POST",
    cache: "no-store",
    next: { revalidate: 0 },
    headers: {
      secret: process.env.REVALIDATE_SECRET || "",
    },
    keepalive: true as any,
  }).catch((err) => {
    console.error("[updateViewedPost] failed:", err);
  });
}
