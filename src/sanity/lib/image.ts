import { client } from "./client";
import imageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";

const builder = imageUrlBuilder(client);

// ✅ Properly typed and compatible helper
export function urlFor(source: Image | any) {
  return builder.image(source);
}
