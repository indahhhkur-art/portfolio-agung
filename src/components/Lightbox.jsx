import { memo, useCallback, useEffect, useRef, useState } from "react";
import { IMG } from "../data.js";
import { useFocusTrap } from "../hooks.js";

function Lightbox({ items, index, closing, onClose, onStep }) {
  const rootRef = useRef(null);
  const closeRef = useRef(null);
  const figRef = useRef(null);
  const stageRef = useRef(null);
  const imgRef = useRef(null);
  const touchRef = useRef({ active: false, startX: 0, startY: 0, dx: 0, dy: 0 });
  const [zoomed, setZoomed] = useState(false);

  const item = items[index];
  const single = items.length < 2;

  useFocusTrap(rootRef, !closing);

  useEffect(() => {
    const prev = document.activeElement;
    closeRef.current?.focus();
    return () => prev?.focus?.();
  }, []);

  useEffect(() => {
    setZoomed(false);
  }, [index]);

  useEffect(() => {
    if (!zoomed && imgRef.current) {
      imgRef.current.style.transformOrigin = "";
    }
  }, [zoomed]);

  // Preload 2 gambar tetangga kiri/kanan agar navigasi mulus instan
  useEffect(() => {
    if (single) return;
    const neighbors = [
      (index - 1 + items.length) % items.length,
      (index + 1) % items.length,
      (index + 2) % items.length
    ];
    new Set(neighbors).forEach(idx => {
      const preload = new Image();
      preload.decoding = "async";
      preload.src = `${IMG}${items[idx].src}`;
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

  const setZoomOrigin = useCallback(e => {
    const refEl = stageRef.current || imgRef.current;
    if (!refEl || !imgRef.current || !e?.clientX) return;
    const rect = refEl.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const ox = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const oy = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    imgRef.current.style.transformOrigin = `${ox.toFixed(1)}% ${oy.toFixed(1)}%`;
  }, []);

  const toggleZoom = useCallback(e => {
    setZoomed(z => {
      if (!z && e?.currentTarget?.tagName === "IMG") {
        setZoomOrigin(e);
      }
      return !z;
    });
  }, [setZoomOrigin]);

  const onImgMouseMove = e => {
    if (!zoomed) return;
    setZoomOrigin(e);
  };

  const onTouchStart = e => {
    if (zoomed || e.touches.length !== 1) return;
    touchRef.current = {
      active: true,
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      dx: 0,
      dy: 0
    };
  };

  const onTouchMove = e => {
    const t = touchRef.current;
    if (!t.active || e.touches.length !== 1) return;
    t.dx = e.touches[0].clientX - t.startX;
    t.dy = e.touches[0].clientY - t.startY;
    if (figRef.current) {
      figRef.current.style.transition = "none";
      if (Math.abs(t.dy) > Math.abs(t.dx) && t.dy > 0) {
        figRef.current.style.transform = `translate3d(0, ${(t.dy * 0.55).toFixed(1)}px, 0)`;
      } else if (!single) {
        figRef.current.style.transform = `translate3d(${(t.dx * 0.45).toFixed(1)}px, 0, 0)`;
      }
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
    if (Math.abs(t.dy) > Math.abs(t.dx) && t.dy > 80) {
      onClose();
    } else if (!single && Math.abs(t.dx) > 48) {
      onStep(t.dx < 0 ? 1 : -1);
    }
    t.dx = 0;
    t.dy = 0;
  };

  return (
    <div
      ref={rootRef}
      className={`lightbox ${closing ? "is-closing" : "is-open"}`}
      role="dialog"
      aria-modal="true"
      aria-label={item.label}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={e => (e.target === e.currentTarget || e.target.tagName === "FIGURE") && onClose()}
    >
      <div className="lightbox__tools">
        <button
          type="button"
          className="icon-btn"
          onClick={toggleZoom}
          aria-label={zoomed ? "Perkecil gambar" : "Perbesar gambar"}
          title={zoomed ? "Reset zoom (100%)" : "Zoom detail (170%)"}
        >
          {zoomed ? "−" : "+"}
        </button>
        <button className="icon-btn" ref={closeRef} onClick={onClose} aria-label="Tutup">✕</button>
      </div>

      {!single && (
        <button className="icon-btn lightbox__nav lightbox__prev" onClick={() => onStep(-1)} aria-label="Sebelumnya">‹</button>
      )}
      <figure ref={figRef} className={zoomed ? "is-zoomed" : ""}>
        <div
          ref={stageRef}
          className="lightbox__stage"
          onMouseMove={onImgMouseMove}
          onClick={e => e.target === stageRef.current && onClose()}
        >
          <img
            ref={imgRef}
            key={item.src}
            src={`${IMG}${item.src}`}
            alt={item.label}
            decoding="async"
            onClick={toggleZoom}
          />
        </div>
        <figcaption>
          <span>{item.label}</span>
          <span className="lightbox__counter">{index + 1} / {items.length}</span>
        </figcaption>
      </figure>
      {!single && (
        <button className="icon-btn lightbox__nav lightbox__next" onClick={() => onStep(1)} aria-label="Berikutnya">›</button>
      )}
    </div>
  );
}

export default memo(Lightbox);
