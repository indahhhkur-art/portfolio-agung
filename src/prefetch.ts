const prefetchedUrls = new Set<string>();

/** Mengecek preferensi hemat data pengguna agar preloading tetap sopan terhadap bandwidth. */
export function isSaveData(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(conn?.saveData);
}

/** Memanaskan aset gambar sekali per URL tanpa membebani mode Save-Data. */
export function prefetchImage(url: string): void {
  if (typeof Image === "undefined" || !url || prefetchedUrls.has(url) || isSaveData()) return;
  prefetchedUrls.add(url);
  const img = new Image();
  img.decoding = "async";
  img.src = url;
}

/** Memanaskan daftar URL gambar secara berurutan. */
export function prefetchImages(urls: readonly string[]): void {
  for (const url of urls) prefetchImage(url);
}
