import type { ImgHTMLAttributes } from "react";
import { IMG } from "../data.ts";

/** Mengembalikan path .webp dari filename .jpg yang memiliki varian WebP. */
export const toWebpSrc = (filename: string, subdir = ""): string =>
  `${IMG}${subdir}${filename.replace(/\.[^.]+$/, ".webp")}`;

interface PictureProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  webpSrc: string;
  webpSrcSet?: string;
  alt: string;
}

/** Gambar responsif WebP + srcSet adaptif dengan fallback JPEG kompatibel penuh. */
export default function Picture({ src, webpSrc, webpSrcSet, sizes, alt, ...imgProps }: PictureProps) {
  return (
    <picture style={{ display: "contents" }}>
      <source srcSet={webpSrcSet ?? webpSrc} sizes={sizes} type="image/webp" />
      <img src={src} alt={alt} sizes={sizes} {...imgProps} />
    </picture>
  );
}
