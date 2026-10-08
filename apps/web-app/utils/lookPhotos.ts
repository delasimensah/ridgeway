/**
 * Temporary pictures so the screens can be judged with photos in place.
 * Free to use under the Unsplash License (https://unsplash.com/license).
 * They are not stored on a building or a person, and they are not uploads.
 * Which person gets which file lives in shared `personLookPhotoFile`.
 *
 * Buildings: photo-1564013799919, photo-1570129477492, photo-1600585154340,
 * photo-1600596542815, photo-1512917774080, photo-1580587771525,
 * photo-1755735340764, photo-1755896487242, photo-1768760906477,
 * photo-1759277700809.
 */

import { personLookPhotoFile } from "shared";

const BUILDINGS = [
  "/look/buildings/b1.jpg",
  "/look/buildings/b2.jpg",
  "/look/buildings/b3.jpg",
  "/look/buildings/b4.jpg",
  "/look/buildings/b5.jpg",
  "/look/buildings/b6.jpg",
  "/look/buildings/b7.jpg",
  "/look/buildings/b8.jpg",
  "/look/buildings/b9.jpg",
  "/look/buildings/b10.jpg",
];

function hashName(name: string): number {
  let hash = 0;
  for (const char of name) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash;
}

function pick(pool: string[], name: string): string {
  const photo = pool[hashName(name) % pool.length];
  return photo ?? pool[0] ?? "";
}

export function personLookPhoto(displayName: string): string {
  return `/look/people/${personLookPhotoFile(displayName)}`;
}

export function buildingLookPhoto(name: string): string {
  return pick(BUILDINGS, name);
}
