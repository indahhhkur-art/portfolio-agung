import { memo, useCallback, useEffect, useRef, useState } from "react";
import { IMG } from "../data.js";
import { useRevealGroup } from "../hooks.js";
import Picture, { toWebpSrc } from "./Picture.jsx";

function CertSwitcher({ items, onOpenImage }) {
  const sectionRef = useRevealGroup(95);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const dragRef = useRef({ active: false, pointerId: null, startX: 0, startScroll: 0, moved: false });
  const suppressClickRef = useRef(false);
  const scrollLockRef = useRef({ index: null, until: 0 });
  const [active, setActive] = useState(0);

  const syncCards = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    // Batch seluruh DOM reads terlebih dahulu sebelum melakukan writes agar tidak memicu layout thrashing
    const clientW = track.clientWidth;
    const scrollLeft = track.scrollLeft;
    const scrollW = track.scrollWidth;
    const isNarrow = clientW < 680;
    const centerX = scrollLeft + clientW / 2;
    const metrics = cardRefs.current.map(card =>
      card ? { card, left: card.offsetLeft, width: card.offsetWidth } : null
    );

    let closestIdx = 0;
    let closestDist = Infinity;
    const updates = [];

    metrics.forEach((m, i) => {
      if (!m) return;
      const cardCenter = m.left + m.width / 2;
      const delta = cardCenter - centerX;
      const absDelta = Math.abs(delta);
      if (absDelta < closestDist) {
        closestDist = absDelta;
        closestIdx = i;
      }

      if (isNarrow && !dragRef.current.active) {
        const norm = Math.max(-1.6, Math.min(1.6, delta / Math.max(m.width, 1)));
        const absNorm = Math.abs(norm);
        const scale = 1 - Math.min(absNorm, 1.4) * 0.085;
        const opacity = 1 - Math.min(absNorm, 1.5) * 0.22;
        const shiftY = Math.min(absNorm, 1.4) * 8;
        updates.push({
          card: m.card,
          transform: `translate3d(0, ${shiftY.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`,
          opacity: opacity.toFixed(3)
        });
      } else {
        updates.push({ card: m.card, transform: "", opacity: "" });
      }
    });

    // Batch seluruh DOM writes sekaligus
    updates.forEach(u => {
      if (u.card.style.transform !== u.transform) u.card.style.transform = u.transform;
      if (u.card.style.opacity !== u.opacity) u.card.style.opacity = u.opacity;
    });

    if (Date.now() < scrollLockRef.current.until && scrollLockRef.current.index != null) {
      return;
    }

    if (!isNarrow) {
      const maxScroll = Math.max(0, scrollW - clientW);
      if (maxScroll > 0) {
        const progress = Math.max(0, Math.min(1, scrollLeft / maxScroll));
        closestIdx = Math.round(progress * Math.max(1, items.length - 1));
      }
    }

    setActive(prev => (prev === closestIdx ? prev : closestIdx));
  }, [items.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const scheduleSync = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        syncCards();
      });
    };

    syncCards();
    track.addEventListener("scroll", scheduleSync, { passive: true });
    const ro = new ResizeObserver(scheduleSync);
    ro.observe(track);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      track.removeEventListener("scroll", scheduleSync);
      ro.disconnect();
    };
  }, [syncCards]);

  const scrollToIndex = useCallback(index => {
    const track = trackRef.current;
    const card = cardRefs.current[index];
    if (!track || !card) return;
    scrollLockRef.current = { index, until: Date.now() + 450 };
    const isNarrow = track.clientWidth < 680;
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    const target = isNarrow
      ? card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2
      : maxScroll * (index / Math.max(1, items.length - 1));
    const clamped = Math.max(0, Math.min(maxScroll, target));
    track.scrollTo({ left: clamped, behavior: "smooth" });
    setActive(index);
  }, [items.length]);

  const step = useCallback(dir => {
    const next = Math.max(0, Math.min(items.length - 1, active + dir));
    scrollToIndex(next);
  }, [active, items.length, scrollToIndex]);

  useEffect(() => {
    const onMove = e => {
      const d = dragRef.current;
      const track = trackRef.current;
      if (!d.active || !track || e.pointerId !== d.pointerId) return;
      const dx = e.clientX - d.startX;
      if (!d.moved && Math.abs(dx) > 6) {
        d.moved = true;
        track.classList.add("is-dragging");
      }
      if (d.moved) {
        track.scrollLeft = d.startScroll - dx * 1.15;
      }
    };
    const onEnd = e => {
      const d = dragRef.current;
      const track = trackRef.current;
      if (!d.active || e.pointerId !== d.pointerId) return;
      if (d.moved) {
        suppressClickRef.current = true;
        window.setTimeout(() => { suppressClickRef.current = false; }, 120);
      }
      d.active = false;
      track?.classList.remove("is-dragging");
      syncCards();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onEnd);
    window.addEventListener("pointercancel", onEnd);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onEnd);
      window.removeEventListener("pointercancel", onEnd);
    };
  }, [syncCards]);

  const onPointerDown = e => {
    if (e.pointerType !== "mouse" || e.button !== 0 || !trackRef.current) return;
    dragRef.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startScroll: trackRef.current.scrollLeft,
      moved: false
    };
  };

  const onCardClick = (index, e) => {
    if (suppressClickRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onOpenImage(items, index);
  };

  const onTrackKeyDown = e => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    }
  };

  return (
    <div className="certs" ref={sectionRef}>
      <div className="container certs__head" data-reveal-item>
        <div>
          <h3 className="certs__title">Certification</h3>
          <p className="certs__sub">Geser kiri ke kanan atau klik kartu untuk memperbesar</p>
        </div>
        <div className="certs__nav" aria-label="Navigasi sertifikat">
          <span className="certs__counter">{active + 1} / {items.length}</span>
          <button
            type="button"
            className="icon-btn certs__arrow"
            onClick={() => step(-1)}
            disabled={active === 0}
            aria-label="Sertifikat sebelumnya"
          >
            ‹
          </button>
          <button
            type="button"
            className="icon-btn certs__arrow"
            onClick={() => step(1)}
            disabled={active === items.length - 1}
            aria-label="Sertifikat berikutnya"
          >
            ›
          </button>
        </div>
      </div>

      <div className="certs-recent" onKeyDown={onTrackKeyDown} data-reveal-item>
        <div
          className="certs-recent__track"
          ref={trackRef}
          onPointerDown={onPointerDown}
          onDragStart={e => e.preventDefault()}
          role="region"
          aria-label="Daftar sertifikasi model recent apps kiri ke kanan"
        >
          {items.map((c, i) => (
            <button
              key={c.src}
              ref={el => { cardRefs.current[i] = el; }}
              type="button"
              className={`cert-app${active === i ? " is-focused" : ""}`}
              aria-label={`Lihat ${c.label}`}
              onClick={e => onCardClick(i, e)}
            >
              <div className="cert-app__bar">
                <span className="cert-app__badge">{c.badge || "CERT"}</span>
                <div className="cert-app__meta">
                  <strong>{c.shortTitle || c.label}</strong>
                  <span>{c.issuer ? `${c.issuer} · ${c.year}` : "Sertifikat Resmi"}</span>
                </div>
                <span className="cert-app__zoom" aria-hidden="true">↗</span>
              </div>
              <div className="cert-app__screen">
                <Picture
                  src={`${IMG}${c.src}`}
                  webpSrc={toWebpSrc(c.src)}
                  alt={c.label}
                  width={c.w}
                  height={c.h}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="container certs__dots" role="tablist" aria-label="Pilih sertifikat" data-reveal-item>
        {items.map((c, i) => (
          <button
            key={c.src}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-label={c.shortTitle || c.label}
            className={`certs__dot${active === i ? " is-active" : ""}`}
            onClick={() => scrollToIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(CertSwitcher);
