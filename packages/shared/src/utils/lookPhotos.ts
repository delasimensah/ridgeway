/**
 * Which stock portrait a name uses. The website and the phone both call this
 * so the same person gets the same picture. Free under the Unsplash License
 * (https://unsplash.com/license). Not stored on the person, and not an upload.
 *
 * People: photo-1531123897727, photo-1589156280159, photo-1611432579402,
 * photo-1507152832244, photo-1763328728510, photo-1531384441138,
 * photo-1506277886164, photo-1566492031773, photo-1463453091185,
 * photo-rerxHYCYofw.
 */

const WOMEN = ["w1.jpg", "w2.jpg", "w3.jpg", "w4.jpg", "w6.jpg"] as const;

const MEN = ["m1.jpg", "m2.jpg", "m3.jpg", "m4.jpg", "m5.jpg"] as const;

export type PersonLookPhotoFile = (typeof WOMEN)[number] | (typeof MEN)[number];

const FEMALE_FIRST_NAMES = new Set([
  "aba",
  "abena",
  "adjoa",
  "adwoa",
  "afia",
  "aisha",
  "akosua",
  "akua",
  "ama",
  "dzifa",
  "efua",
  "esi",
  "maame",
  "mansa",
  "naa",
  "serwaa",
  "yaa",
]);

function hashName(name: string): number {
  let hash = 0;
  for (const char of name) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash;
}

function pick<T extends string>(pool: readonly T[], name: string): T {
  const photo = pool[hashName(name) % pool.length];
  return photo ?? pool[0];
}

export function personLookPhotoFile(displayName: string): PersonLookPhotoFile {
  const first = displayName.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  const pool = FEMALE_FIRST_NAMES.has(first) ? WOMEN : MEN;
  return pick(pool, displayName);
}
