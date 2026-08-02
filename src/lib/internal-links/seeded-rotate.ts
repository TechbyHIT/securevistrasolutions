/**
 * Deterministic page-seeded helpers so every URL gets a unique but stable
 * Explore More layout (order + link rotation) without client randomness.
 */

export function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function next() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  const rand = mulberry32(seed);
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function seededSlice<T>(items: T[], seed: number, count: number, offset = 0): T[] {
  if (items.length === 0 || count <= 0) return [];
  const start = (Math.abs(seed) + offset) % items.length;
  const out: T[] = [];
  for (let i = 0; i < Math.min(count, items.length); i += 1) {
    out.push(items[(start + i) % items.length]);
  }
  return out;
}
