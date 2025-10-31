

export function stripHtml(s = "") {
  return s.replace(/<\/?[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}


export function getExcerpt(text?: string, words = 16) {
  const t = stripHtml(text || "");
  const arr = t.split(/\s+/);
  return arr.length > words ? arr.slice(0, words).join(" ") + "…" : t;
}





export function handleSpecielChar(text: string) {
  return text.toLowerCase()
        .replace(/ä/g, "a")
        .replace(/ö/g, "o")
        .replace(/å/g, "a")
        .replace(/\s+/g, "-");
}