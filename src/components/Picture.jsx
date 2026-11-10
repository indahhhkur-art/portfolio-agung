import { IMG } from "../data.js";

/** Mengembalikan path .webp dari filename .jpg yang memiliki varian WebP. */
export const toWebpSrc = (filename, subdir = "") =>
  `${IMG}${subdir}${filename.replace(/\.[^.]+$/, ".webp")}`;

/** Gambar responsif WebP + fallback JPEG agar lebih cepat tanpa mengorbankan kompatibilitas. */
export default function Picture({ src, webpSrc, alt, ...imgProps }) {
  return (
    <picture style={{ display: "contents" }}>
      <source srcSet={webpSrc} type="image/webp" />
      <img src={src} alt={alt} {...imgProps} />
    </picture>
  );
}
