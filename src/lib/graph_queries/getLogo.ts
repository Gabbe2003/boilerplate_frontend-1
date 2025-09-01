import "server-only";

import favicon from "../../../public./full_logo_with_slogan.png";

export async function getLogo() {
  return {
    sourceUrl: favicon.src, 
    altText: "Custom site favicon",  
    title: { rendered: "Site Logo" },
    meta: {},
  };
}
