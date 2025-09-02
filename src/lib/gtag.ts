export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

// declare gtag on window to satisfy TypeScript
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
  }
}

// Send pageview to GA
export const pageview = (url: string) => {
  if (!GA_ID || typeof window === "undefined") return;

  window.gtag?.("event", "page_view", {
    page_location: window.location.origin + url,
    page_path: url,
    page_title: document.title,
    send_to: GA_ID,
  });
};
