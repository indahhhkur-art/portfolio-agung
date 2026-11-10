import { useEffect, useRef } from "react";
import { IMG } from "../data.js";

export default function Lightbox({ items, index, closing, onClose, onStep }) {
  const closeRef = useRef(null);
  const figRef = useRef(null);
  const touchRef = useRef({ active: false, startX: 0, dx: 0 });
  const item = items[index];
  const single = items.length < 2;

  useEffect(() => {
    const prev = document.activeElement;
    closeRef.current?.focus();
    return () => prev?.focus?.();
  }, []);

  // Preload gambar tetangga agar navigasi kiri/kanan langsung tampil tanpa jeda
  useEffect(() => {
    if (single) return;
    const prevIdx = (index - 1 + items.length) % items.length;
    const nextIdx = (index + 1) % items.length;
    [items[prevIdx], items[nextIdx]].forEach(neighbor => {
      const preload = new Image();
      preload.decoding = "async";
      preload.src = `${IMG}${neighbor.src}`;
    });
  }, [index, items, single]);

  useEffect(() => {
    const onKey = e => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && !single) onStep(-1);
      if (e.key === "ArrowRight" && !single) onStep(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onStep, single]);

  const onTouchStart = e => {
    if (single || e.touches.length !== 1) return;
    touchRef.current = { active: true, startX: e.touches[0].clientX, dx: 0 };
  };

  const onTouchMove = e => {
    const t = touchRef.current;
    if (!t.active || e.touches.length !== 1) return;
    t.dx = e.touches[0].clientX - t.startX;
    if (figRef.current) {
      figRef.current.style.transition = "none";
      figRef.current.style.transform = `translate3d(${(t.dx * 0.45).toFixed(1)}px, 0, 0)`;
    }
  };

  const onTouchEnd = () => {
    const t = touchRef.current;
    if (!t.active) return;
    t.active = false;
    if (figRef.current) {
      figRef.current.style.transition = "transform 0.24s var(--ease-smooth)";
      figRef.current.style.transform = "";
    }
    if (Math.abs(t.dx) > 48) {
      onStep(t.dx < 0 ? 1 : -1);
    }
    t.dx = 0;
  };

  return (
    <div
      className={`lightbox ${closing ? "is-closing" : "is-open"}`}
      role="dialog"
      aria-modal="true"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={e => (e.target === e.currentTarget || e.target.tagName === "FIGURE") && onClose()}
    >
      <button className="icon-btn lightbox__close" ref={closeRef} onClick={onClose} aria-label="Tutup">✕</button>
      {!single && (
        <button className="icon-btn lightbox__nav lightbox__prev" onClick={() => onStep(-1)} aria-label="Sebelumnya">‹</button>
      )}
      <figure ref={figRef}>
        <img key={item.src} src={`${IMG}${item.src}`} alt={item.label} decoding="async" />
        <figcaption>{`${item.label} (${index + 1}/${items.length})`}</figcaption>
      </figure>
      {!single && (
        <button className="icon-btn lightbox__nav lightbox__next" onClick={() => onStep(1)} aria-label="Berikutnya">›</button>
      )}
    </div>
  );
}
