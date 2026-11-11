const prefetchedUrls = new Set<string>();

interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
}

/** Mengecek preferensi hemat data atau jaringan lambat (slow-2g / 2g) agar preloading tetap sopan terhadap bandwidth. */
export function isSaveData(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  if (!conn) return false;
  return Boolean(conn.saveData || conn.effectiveType === "slow-2g" || conn.effectiveType === "2g");
}

/** Memanaskan aset gambar sekali per URL dengan prioritas rendah tanpa membebani mode Save-Data. */
export function prefetchImage(url: string): void {
  if (typeof Image === "undefined" || !url || prefetchedUrls.has(url) || isSaveData()) return;
  prefetchedUrls.add(url);
  const img = new Image();
  img.decoding = "async";
  if ("fetchPriority" in img) {
    (img as HTMLImageElement & { fetchPriority?: "high" | "low" | "auto" }).fetchPriority = "low";
  }
  img.src = url;
}

/** Memanaskan daftar URL gambar secara berurutan. */
export function prefetchImages(urls: readonly string[]): void {
  for (const url of urls) prefetchImage(url);
}
