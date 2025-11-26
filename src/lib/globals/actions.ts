


export function stripHtml(s = "") {
  return s.replace(/<\/?[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}


export function capitalizeFirstLetter(val : string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}


export function limitExcerpt(text?: string, words = 16) {
  const t = stripHtml(text || "");
  const arr = t.split(/\s+/);
  return arr.length > words ? arr.slice(0, words).join(" ") + "…" : t;
}

export function handleSpecielChar(text: string) {
  return text
    .toLowerCase()
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/å/g, "a")
    .replace(/["'`“”‘’]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
    
}


export function randomIntInclusive(min: number, max: number) {
  const lo = Math.ceil(min);
  const hi = Math.floor(max);
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

// src/lib/utils/decodeHTML.ts
const htmlEntities: Record<string, string> = {
  '&amp;': '&',
  '&#038;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#039;': "'",
  '&#8211;': '–',
  '&#8212;': '—',
  '&#8230;': '…',
  '&#8217;': '’',
  '&#8220;': '“',
  '&#8221;': '”',
  '&hellip;': '…',   

};

export function decodeHTML(str?: string | null): string {
  if (!str) return '';
  return str.replace(
    new RegExp(Object.keys(htmlEntities).join('|'), 'g'),
    (m) => htmlEntities[m] || m
  );
}

const stockholmFmt = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Europe/Stockholm",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDateStockholm(iso?: string) {
  if (!iso) return "";
  return stockholmFmt.format(new Date(iso));
}

export function normalizeName(name: string){
  return name
    .split(" ")[0]
    .toLowerCase(); 
}