import type { ImageSource } from "expo-image";
import { type PersonLookPhotoFile, personLookPhotoFile } from "shared";

/**
 * The same portraits as the website, bundled for the phone.
 * `require` must be a literal path so the packager can include the file.
 */

const PEOPLE: Record<PersonLookPhotoFile, ImageSource> = {
  "w1.jpg": require("../assets/look/people/w1.jpg"),
  "w2.jpg": require("../assets/look/people/w2.jpg"),
  "w3.jpg": require("../assets/look/people/w3.jpg"),
  "w4.jpg": require("../assets/look/people/w4.jpg"),
  "w6.jpg": require("../assets/look/people/w6.jpg"),
  "m1.jpg": require("../assets/look/people/m1.jpg"),
  "m2.jpg": require("../assets/look/people/m2.jpg"),
  "m3.jpg": require("../assets/look/people/m3.jpg"),
  "m4.jpg": require("../assets/look/people/m4.jpg"),
  "m5.jpg": require("../assets/look/people/m5.jpg"),
};

export function personLookPhoto(displayName: string): ImageSource {
  return PEOPLE[personLookPhotoFile(displayName)];
}
