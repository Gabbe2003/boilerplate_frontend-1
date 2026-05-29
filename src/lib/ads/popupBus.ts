declare global {
  interface Window {
    __popupActive?: boolean;
  }
}

/** True while any popup (ad or newsletter) is currently on screen. */
export function isPopupActive(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.__popupActive);
}

export function setPopupActive(active: boolean): void {
  if (typeof window === "undefined") return;
  window.__popupActive = active;
}
