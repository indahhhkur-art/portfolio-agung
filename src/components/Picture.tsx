import type { ImgHTMLAttributes } from "react";
import { IMG } from "../data.ts";

/** Mengembalikan path .webp dari filename .jpg yang memiliki varian WebP. */
export const toWebpSrc = (filename: string, subdir = ""): string =>
  `${IMG}${subdir}${filename.replace(/\.[^.]+$/, ".webp")}`;

interface PictureProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  webpSrc: string;
  alt: string;
}

/** Gambar responsif WebP + fallback JPEG agar lebih cepat tanpa mengorbankan kompatibilitas. */
export default function Picture({ src, webpSrc, alt, ...imgProps }: PictureProps) {
  return (
    <picture style={{ display: "contents" }}>
      <source srcSet={webpSrc} type="image/webp" />
      <img src={src} alt={alt} {...imgProps} />
    </picture>
  );
}
