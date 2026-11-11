import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IMG } from "../data.ts";
import { useRevealGroup } from "../hooks.ts";
import { prefetchImage } from "../prefetch.ts";
import type { Certification, LightboxItem } from "../types.ts";

const COPIES = 4;

interface CertCardProps {
  cert: Certification;
  slot: number;
  logicalIndex: number;
  copy: number;
  total: number;
  focused: boolean;
  eager: boolean;
  setCardRef: (slot: number, el: HTMLButtonElement | null) => void;
  onPrefetch: () => void;
  onCardClick: (logicalIndex: number, e: React.MouseEvent<HTMLButtonElement>) => void;
}

const CertCard = memo(function CertCard({
  cert,
  slot,
  logicalIndex,
  copy,
  total,
  focused,
  eager,
  setCardRef,
  onPrefetch,
  onCardClick
}: CertCardProps) {
  const warmCert = () => {
    onPrefetch();
    prefetchImage(`${IMG}${cert.src}`);
  };

  return (
    <button
      ref={el => setCardRef(slot, el)}
      type="button"
      tabIndex={total > 1 ? (copy === 1 ? 0 : -1) : 0}
      className={`cert-app${focused ? " is-focused" : ""}`}
      aria-label={`Lihat ${cert.label}`}
      onPointerEnter={warmCert}
      onTouchStart={warmCert}
      onFocus={warmCert}
      onClick={e => onCardClick(logicalIndex, e)}
    >
      <div className="cert-app__bar">
        <span className="cert-app__badge">{cert.badge || "CERT"}</span>
        <div className="cert-app__meta">
          <strong>{cert.shortTitle || cert.label}</strong>
          <span>{cert.issuer ? `${cert.issuer} · ${cert.year}` : "Sertifikat Resmi"}</span>
        </div>
        <span className="cert-app__zoom" aria-hidden="true">↗</span>
      </div>
      <div className="cert-app__screen">
        <img
          src={`${IMG}thumbs/${cert.src}`}
          alt={cert.label}
          width={cert.w}
          height={cert.h}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
        />
      </div>
    </button>
  );
});

interface CertSwitcherProps {
  items: Certification[];
  onOpenImage: (items: LightboxItem[], index: number) => void;
  onPrefetch: () => void;
}

function CertSwitcher({ items, onOpenImage, onPrefetch }: CertSwitcherProps) {
  const count = items.length;
  const [infiniteReady, setInfiniteReady] = useState(false);

  useEffect(() => {
    setInfiniteReady(true);
  }, []);

  const copies = infiniteReady && count > 1 ? COPIES : 1;
  const repeated = useMemo(
    () =>
      copies > 1
        ? Array.from({ length: copies }, (_, copy) =>
            items.map((item, idx) => ({ item, idx, copy, slot: copy * count + idx }))
          ).flat()
        : items.map((item, idx) => ({ item, idx, copy: 0, slot: idx })),
    [items, count, copies]
  );

  const sectionRef = useRevealGroup<HTMLDivElement>(50);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dragRef = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startScroll: 0,
    moved: false,
    lastX: 0,
    lastT: 0,
    vx: 0
  });
  const suppressClickRef = useRef(false);
  const animRafRef = useRef(0);
  const targetSlotRef = useRef<number | null>(null);
  const initializedRef = useRef(false);
  const [eagerImgs, setEagerImgs] = useState(false);
  const [activeSlot, setActiveSlot] = useState(0);
  const active = count > 0 ? ((activeSlot % count) + count) % count : 0;

  // Muat seluruh salinan sertifikat begitu section mendekati viewport agar swipe unlimited tanpa gambar kosong
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || eagerImgs) return;
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(en => en.isIntersecting)) {
          setEagerImgs(true);
          io.disconnect();
        }
      },
      { rootMargin: "350px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eagerImgs, sectionRef]);

  const setCardRef = useCallback((slot: number, el: HTMLButtonElement | null) => {
    cardRefs.current[slot] = el;
  }, []);

  const stopAnim = useCallback(() => {
    if (animRafRef.current) {
      window.cancelAnimationFrame(animRafRef.current);
      animRafRef.current = 0;
    }
    targetSlotRef.current = null;
  }, []);

  const getMetrics = useCallback(
    (track: HTMLDivElement) => {
      const padLeft = Number.parseFloat(window.getComputedStyle(track).paddingLeft) || 0;
      const first = cardRefs.current[0];
      const nextSet = count > 1 ? cardRefs.current[count] : null;
      const setWidth =
        first && nextSet ? Math.max(1, nextSet.offsetLeft - first.offsetLeft) : track.scrollWidth;
      return { padLeft, setWidth, isNarrow: track.clientWidth < 680 };
    },
    [count]
  );

  const getSlotTargetScroll = useCallback(
    (track: HTMLDivElement, slot: number, metrics: { padLeft: number; isNarrow: boolean }) => {
      const card = cardRefs.current[slot];
      if (!card) return 0;
      const raw = metrics.isNarrow
        ? card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2
        : card.offsetLeft - metrics.padLeft;
      return Math.max(0, Math.min(track.scrollWidth - track.clientWidth, raw));
    },
    []
  );

  const normalizeBoundary = useCallback(
    (track: HTMLDivElement, metrics: { setWidth: number }): number => {
      if (copies <= 1 || count <= 1 || metrics.setWidth <= 0) return 0;
      const low = metrics.setWidth * 0.55;
      const high = metrics.setWidth * (copies - 1.45);
      let delta = 0;
      if (track.scrollLeft < low) delta = metrics.setWidth;
      else if (track.scrollLeft >= high) delta = -metrics.setWidth;
      if (!delta) return 0;

      track.style.scrollSnapType = "none";
      track.scrollLeft += delta;
      if (dragRef.current.active) dragRef.current.startScroll += delta;
      if (!dragRef.current.active && !animRafRef.current) {
        window.requestAnimationFrame(() => {
          if (trackRef.current && !dragRef.current.active && !animRafRef.current) {
            trackRef.current.style.scrollSnapType = "";
          }
        });
      }
      return delta;
    },
    [copies, count]
  );

  const findNearestSlot = useCallback((track: HTMLDivElement, metrics: { padLeft: number; isNarrow: boolean }) => {
    const anchor = metrics.isNarrow
      ? track.scrollLeft + track.clientWidth / 2
      : track.scrollLeft + metrics.padLeft;
    let closestSlot = 0;
    let closestDist = Infinity;
    for (let i = 0; i < cardRefs.current.length; i++) {
      const card = cardRefs.current[i];
      if (!card) continue;
      const point = metrics.isNarrow ? card.offsetLeft + card.offsetWidth / 2 : card.offsetLeft;
      const d = Math.abs(point - anchor);
      if (d < closestDist) {
        closestDist = d;
        closestSlot = i;
      }
    }
    return closestSlot;
  }, []);

  const syncCards = useCallback(() => {
    const track = trackRef.current;
    if (!track || count === 0) return;

    const metrics = getMetrics(track);
    if (!dragRef.current.active && !animRafRef.current) {
      normalizeBoundary(track, metrics);
    }

    const clientW = track.clientWidth;
    const centerX = track.scrollLeft + clientW / 2;
    const anchor = metrics.isNarrow ? centerX : track.scrollLeft + metrics.padLeft;
    const itemsMetrics = cardRefs.current.map(card =>
      card ? { card, left: card.offsetLeft, width: card.offsetWidth } : null
    );

    let closestSlot = 0;
    let closestDist = Infinity;
    const updates: { card: HTMLButtonElement; transform: string; opacity: string }[] = [];

    for (let i = 0; i < itemsMetrics.length; i++) {
      const m = itemsMetrics[i];
      if (!m) continue;
      const point = metrics.isNarrow ? m.left + m.width / 2 : m.left;
      const absDelta = Math.abs(point - anchor);
      if (absDelta < closestDist) {
        closestDist = absDelta;
        closestSlot = i;
      }

      if (metrics.isNarrow && !dragRef.current.active) {
        const delta = m.left + m.width / 2 - centerX;
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
    }

    for (const u of updates) {
      if (u.card.style.transform !== u.transform) u.card.style.transform = u.transform;
      if (u.card.style.opacity !== u.opacity) u.card.style.opacity = u.opacity;
    }

    if (animRafRef.current && targetSlotRef.current !== null) return;
    setActiveSlot(prev => (prev === closestSlot ? prev : closestSlot));
  }, [count, getMetrics, normalizeBoundary]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || count === 0) return;

    cardRefs.current.length = repeated.length;

    if (!initializedRef.current && copies > 1 && count > 1) {
      initializedRef.current = true;
      const metrics = getMetrics(track);
      track.scrollTo({ left: getSlotTargetScroll(track, count, metrics), behavior: "instant" });
      setActiveSlot(count);
    }

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
      stopAnim();
      track.removeEventListener("scroll", scheduleSync);
      ro.disconnect();
    };
  }, [copies, count, getMetrics, getSlotTargetScroll, repeated.length, stopAnim, syncCards]);

  /** Tween horizontal GPU cepat (240ms) tanpa lock penahan klik berturut-turut. */
  const animateToSlot = useCallback(
    (slot: number) => {
      const track = trackRef.current;
      if (!track || count === 0) return;
      stopAnim();

      const metrics = getMetrics(track);
      let safeSlot = slot;
      if (count > 1) {
        while (safeSlot < count) {
          track.scrollLeft += metrics.setWidth;
          safeSlot += count;
        }
        while (safeSlot >= (COPIES - 1) * count) {
          track.scrollLeft -= metrics.setWidth;
          safeSlot -= count;
        }
      }

      targetSlotRef.current = safeSlot;
      setActiveSlot(safeSlot);

      const startX = track.scrollLeft;
      const destX = getSlotTargetScroll(track, safeSlot, metrics);
      const dist = destX - startX;
      if (Math.abs(dist) < 1) {
        targetSlotRef.current = null;
        return;
      }

      track.style.scrollSnapType = "none";
      const startTime = performance.now();
      const duration = 240;

      const frame = (now: number) => {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        track.scrollLeft = startX + dist * eased;
        if (t < 1) {
          animRafRef.current = window.requestAnimationFrame(frame);
        } else {
          animRafRef.current = 0;
          targetSlotRef.current = null;
          const m = getMetrics(track);
          const delta = normalizeBoundary(track, m);
          if (delta) setActiveSlot(findNearestSlot(track, m));
          track.style.scrollSnapType = "";
        }
      };
      animRafRef.current = window.requestAnimationFrame(frame);
    },
    [count, findNearestSlot, getMetrics, getSlotTargetScroll, normalizeBoundary, stopAnim]
  );

  /** Momentum glide cepat setelah mouse drag cepat dilepaskan. */
  const startGlide = useCallback(
    (initialVx: number) => {
      const track = trackRef.current;
      if (!track || Math.abs(initialVx) < 0.08) return;
      stopAnim();
      let vx = initialVx;
      let lastT = performance.now();
      track.style.scrollSnapType = "none";

      const tick = (now: number) => {
        const dt = Math.min(40, Math.max(4, now - lastT));
        lastT = now;
        track.scrollLeft -= vx * dt;
        const m = getMetrics(track);
        normalizeBoundary(track, m);
        vx *= Math.pow(0.91, dt / 16.67);
        if (Math.abs(vx) > 0.04) {
          animRafRef.current = window.requestAnimationFrame(tick);
        } else {
          animRafRef.current = 0;
          track.style.scrollSnapType = "";
          syncCards();
        }
      };
      animRafRef.current = window.requestAnimationFrame(tick);
    },
    [getMetrics, normalizeBoundary, stopAnim, syncCards]
  );

  const step = useCallback(
    (dir: number) => {
      const track = trackRef.current;
      if (!track || count === 0) return;
      const baseSlot =
        targetSlotRef.current !== null ? targetSlotRef.current : findNearestSlot(track, getMetrics(track));
      animateToSlot(baseSlot + dir);
    },
    [animateToSlot, count, findNearestSlot, getMetrics]
  );

  const scrollToLogical = useCallback(
    (logicalIndex: number) => {
      const track = trackRef.current;
      if (!track || count <= 1) return;
      const metrics = getMetrics(track);
      const anchor = metrics.isNarrow
        ? track.scrollLeft + track.clientWidth / 2
        : track.scrollLeft + metrics.padLeft;

      let bestSlot = logicalIndex;
      let bestDist = Infinity;
      for (let copy = 0; copy < COPIES; copy++) {
        const s = copy * count + logicalIndex;
        const card = cardRefs.current[s];
        if (!card) continue;
        const pt = metrics.isNarrow ? card.offsetLeft + card.offsetWidth / 2 : card.offsetLeft;
        const d = Math.abs(pt - anchor);
        if (d < bestDist) {
          bestDist = d;
          bestSlot = s;
        }
      }
      animateToSlot(bestSlot);
    },
    [animateToSlot, count, getMetrics]
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const d = dragRef.current;
      const track = trackRef.current;
      if (!d.active || !track || e.pointerId !== d.pointerId) return;

      const now = performance.now();
      const dt = Math.max(4, now - d.lastT);
      const instantVx = Math.max(-2.6, Math.min(2.6, ((e.clientX - d.lastX) * 1.1) / dt));
      d.vx = d.vx * 0.45 + instantVx * 0.55;
      d.lastX = e.clientX;
      d.lastT = now;

      const dx = e.clientX - d.startX;
      if (!d.moved && Math.abs(dx) > 3) {
        d.moved = true;
        track.classList.add("is-dragging");
      }
      if (d.moved) {
        track.scrollLeft = d.startScroll - dx * 1.1;
        if (count > 1) {
          const metrics = getMetrics(track);
          if (track.scrollLeft < metrics.setWidth * 0.5) {
            track.scrollLeft += metrics.setWidth;
            d.startScroll += metrics.setWidth;
          } else if (track.scrollLeft >= metrics.setWidth * (COPIES - 1.5)) {
            track.scrollLeft -= metrics.setWidth;
            d.startScroll -= metrics.setWidth;
          }
        }
      }
    };
    const onEnd = (e: PointerEvent) => {
      const d = dragRef.current;
      const track = trackRef.current;
      if (!d.active || e.pointerId !== d.pointerId) return;
      const wasMoved = d.moved;
      const releaseVx = performance.now() - d.lastT < 90 ? d.vx : 0;
      if (wasMoved) {
        suppressClickRef.current = true;
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 80);
      }
      d.active = false;
      if (track) {
        track.classList.remove("is-dragging");
        track.style.scrollSnapType = "";
      }
      if (wasMoved && Math.abs(releaseVx) >= 0.08) {
        startGlide(releaseVx);
      } else {
        syncCards();
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onEnd);
    window.addEventListener("pointercancel", onEnd);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onEnd);
      window.removeEventListener("pointercancel", onEnd);
    };
  }, [count, getMetrics, startGlide, syncCards]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || !trackRef.current) return;
    stopAnim();
    dragRef.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startScroll: trackRef.current.scrollLeft,
      moved: false,
      lastX: e.clientX,
      lastT: performance.now(),
      vx: 0
    };
  };

  const onCardClick = useCallback(
    (logicalIndex: number, e: React.MouseEvent<HTMLButtonElement>) => {
      if (suppressClickRef.current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onOpenImage(items, logicalIndex);
    },
    [items, onOpenImage]
  );

  const onTrackKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
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
          <p className="certs__sub">Geser tanpa batas kiri ke kanan atau klik kartu untuk memperbesar</p>
        </div>
        <div className="certs__nav" aria-label="Navigasi sertifikat">
          <span className="certs__counter">{active + 1} / {count}</span>
          <button
            type="button"
            className="icon-btn certs__arrow"
            onClick={() => step(-1)}
            aria-label="Sertifikat sebelumnya"
          >
            ‹
          </button>
          <button
            type="button"
            className="icon-btn certs__arrow"
            onClick={() => step(1)}
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
          onTouchStart={stopAnim}
          onDragStart={e => e.preventDefault()}
          role="region"
          aria-label="Daftar sertifikasi model recent apps geser tanpa batas"
        >
          {repeated.map(({ item: c, idx, copy, slot }) => (
            <CertCard
              key={`${copy}-${c.src}`}
              cert={c}
              slot={slot}
              logicalIndex={idx}
              copy={copy}
              total={count}
              focused={activeSlot === slot}
              eager={eagerImgs}
              setCardRef={setCardRef}
              onPrefetch={onPrefetch}
              onCardClick={onCardClick}
            />
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
            onClick={() => scrollToLogical(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(CertSwitcher);
