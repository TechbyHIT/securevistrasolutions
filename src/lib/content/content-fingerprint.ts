/**
 * Content fingerprinting — detect location-swap / near-duplicate copy.
 */
export function normalizeForFingerprint(
  text: string,
  tokensToStrip: string[] = [],
): string {
  let out = text.toLowerCase();
  for (const token of tokensToStrip) {
    if (!token) continue;
    out = out.split(token.toLowerCase()).join(" ");
  }
  return out
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function shingleSet(text: string, size = 3): Set<string> {
  const words = text.split(" ").filter(Boolean);
  const set = new Set<string>();
  if (words.length < size) {
    if (words.length) set.add(words.join(" "));
    return set;
  }
  for (let i = 0; i <= words.length - size; i++) {
    set.add(words.slice(i, i + size).join(" "));
  }
  return set;
}

export function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const item of a) if (b.has(item)) inter += 1;
  return inter / (a.size + b.size - inter);
}

export function contentFingerprint(
  text: string,
  tokensToStrip: string[] = [],
): { normalized: string; shingles: Set<string>; hash: string } {
  const normalized = normalizeForFingerprint(text, tokensToStrip);
  const shingles = shingleSet(normalized, 3);
  // Stable short hash for reporting (not cryptographic)
  let h = 0;
  for (let i = 0; i < normalized.length; i++) {
    h = (h * 31 + normalized.charCodeAt(i)) >>> 0;
  }
  return { normalized, shingles, hash: h.toString(16).padStart(8, "0") };
}

export function similarityScore(
  aText: string,
  bText: string,
  tokensToStrip: string[] = [],
): number {
  const a = contentFingerprint(aText, tokensToStrip);
  const b = contentFingerprint(bText, tokensToStrip);
  return jaccardSimilarity(a.shingles, b.shingles);
}

/** Location-token share of total words (proxy for location-swap dominance). */
export function locationTokenRatio(text: string, locationTokens: string[]): number {
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 0;
  const tokens = locationTokens.map((t) => t.toLowerCase()).filter(Boolean);
  let hits = 0;
  for (const word of words) {
    if (tokens.some((t) => word.includes(t) || t.includes(word))) hits += 1;
  }
  return hits / words.length;
}
