import "server-only";

import favicon from "../../../public/favicon_logo.png";

export async function getLogo() {
  return {
    sourceUrl: favicon.src, // Next.js static import gives you .src
    altText: "Custom site favicon", // <-- your custom alt tag
    title: { rendered: "Site Logo" },
    meta: {},
  };
}
