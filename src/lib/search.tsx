import { JSX } from "react";
export function sanitizeQuery(input: string, maxLen = 80): string {
  return (input ?? "")
    .replace(/[<>`$]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLen);
}

export function filterByTitle<T extends { title: string }>(posts: T[], q: string): T[] {
  const needle = q.toLowerCase();
  if (!needle) return [];
  return posts.filter((p) => p.title.toLowerCase().includes(needle));
}

export function highlightAll(text: string, query: string): (string | JSX.Element)[] {
  if (!query) return [text];
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(escaped, "gi");
  const out: (string | JSX.Element)[] = [];
  let last = 0;
  for (const m of text.matchAll(re)) {
    const i = m.index ?? 0;
    if (i > last) out.push(text.slice(last, i));
    out.push(
      <mark key={i} className="rounded px-0.5 group-hover:ring-1 group-hover:ring-yellow-300">
        {text.slice(i, i + m[0].length)}
      </mark>
    );
    last = i + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}


// --- Add below your existing helpers ---

// Sørensen–Dice over bigrams (simple + fast) to find "closest" titles
function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}
function bigrams(s: string): Set<string> {
  const g = new Set<string>();
  for (let i = 0; i < s.length - 1; i++) g.add(s.slice(i, i + 2));
  return g;
}
function diceSimilarity(a: string, b: string): number {
  const A = bigrams(normalize(a));
  const B = bigrams(normalize(b));
  if (A.size === 0 || B.size === 0) return 0;
  let overlap = 0;
  for (const x of A) if (B.has(x)) overlap++;
  return (2 * overlap) / (A.size + B.size);
}

/** Best-effort search:
 *  1) direct substring (case/diacritics-insensitive)
 *  2) if none, fuzzy-rank by Dice similarity and return top N
 */
export function bestEffortMatches<T extends { title: string; slug: string }>(
  posts: T[],
  q: string,
  limit = 50
): T[] {
  const term = sanitizeQuery(q);
  if (!term) return [];
  const direct = filterByTitle(posts, term);
  if (direct.length) return direct.slice(0, limit);

  return posts
    .map((p) => ({ p, score: diceSimilarity(p.title, term) }))
    .sort((a, b) => b.score - a.score)
    .filter((x) => x.score > 0)
    .slice(0, limit)
    .map((x) => x.p);
}
