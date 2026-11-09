import { useEffect, useRef } from "react";
import { IMG } from "../data.js";

export default function Lightbox({ items, index, onClose, onStep }) {
  const closeRef = useRef(null);
  const item = items[index];
  const single = items.length < 2;

  useEffect(() => {
    const prev = document.activeElement;
    closeRef.current?.focus();
    return () => prev?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = e => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onStep(-1);
      if (e.key === "ArrowRight") onStep(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onStep]);

  return (
    <div
      className="lightbox is-open"
      role="dialog"
      aria-modal="true"
      onClick={e => (e.target === e.currentTarget || e.target.tagName === "FIGURE") && onClose()}
    >
      <button className="icon-btn lightbox__close" ref={closeRef} onClick={onClose} aria-label="Tutup">✕</button>
      {!single && (
        <button className="icon-btn lightbox__nav lightbox__prev" onClick={() => onStep(-1)} aria-label="Sebelumnya">‹</button>
      )}
      <figure>
        <img src={`${IMG}${item.src}`} alt={item.label} />
        <figcaption>{`${item.label} (${index + 1}/${items.length})`}</figcaption>
      </figure>
      {!single && (
        <button className="icon-btn lightbox__nav lightbox__next" onClick={() => onStep(1)} aria-label="Berikutnya">›</button>
      )}
    </div>
  );
}
