// WordPress lives on a different origin than the Next frontend
// (e.g. cms.finanstidning.se). Derive the REST base from the GraphQL URL,
// which next.config exposes to both server and client bundles.
function wpOrigin(): string {
  const g = process.env.WP_GRAPHQL_URL;
  if (g) {
    try {
      return new URL(g).origin;
    } catch {
      /* fall through */
    }
  }
  return "https://cms.finanstidning.se";
}

export const WP_REST_BASE = `${wpOrigin()}/wp-json/finanstidning/v1`;
