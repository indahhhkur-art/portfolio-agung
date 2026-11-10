import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IMG } from "../data.js";
import { useRevealGroup } from "../hooks.js";

const COPIES = 4;

function CertSwitcher({ items, onOpenImage, onPrefetch }) {
  const count = items.length;
  const repeated = useMemo(
    () =>
      count > 1
        ? Array.from({ length: COPIES }, (_, copy) =>
            items.map((item, idx) => ({ item, idx, copy, slot: copy * count + idx }))
          ).flat()
        : items.map((item, idx) => ({ item, idx, copy: 0, slot: idx })),
    [items, count]
  );

  const sectionRef = useRevealGroup(95);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const dragRef = useRef({ active: false, pointerId: null, startX: 0, startScroll: 0, moved: false });
  const suppressClickRef = useRef(false);
  const scrollLockRef = useRef({ until: 0 });
  const settleTimerRef = useRef(0);
  const initializedRef = useRef(false);
  const [activeSlot, setActiveSlot] = useState(count > 1 ? count : 0);
  const active = count > 0 ? ((activeSlot % count) + count) % count : 0;

  const getTrackMetrics = useCallback(
    track => {
      const padLeft = parseFloat(window.getComputedStyle(track).paddingLeft) || 0;
      const first = cardRefs.current[0];
      const nextSet = count > 1 ? cardRefs.current[count] : null;
      const setWidth =
        first && nextSet ? Math.max(1, nextSet.offsetLeft - first.offsetLeft) : track.scrollWidth;
      return { padLeft, setWidth, isNarrow: track.clientWidth < 680 };
    },
    [count]
  );

  const getSlotTargetScroll = useCallback((track, slot, metrics) => {
    const card = cardRefs.current[slot];
    if (!card) return 0;
    const raw = metrics.isNarrow
      ? card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2
      : card.offsetLeft - metrics.padLeft;
    return Math.max(0, Math.min(track.scrollWidth - track.clientWidth, raw));
  }, []);

  const normalizeBoundary = useCallback(
    (track, metrics) => {
      if (count <= 1 || metrics.setWidth <= 0) return false;
      const low = metrics.setWidth * 0.55;
      const high = metrics.setWidth * (COPIES - 1.45);
      let delta = 0;
      if (track.scrollLeft < low) delta = metrics.setWidth;
      else if (track.scrollLeft >= high) delta = -metrics.setWidth;
      if (!delta) return false;

      const prevSnap = track.style.scrollSnapType;
      track.style.scrollSnapType = "none";
      track.scrollLeft += delta;
      if (dragRef.current.active) dragRef.current.startScroll += delta;
      window.requestAnimationFrame(() => {
        if (trackRef.current && !dragRef.current.active) {
          trackRef.current.style.scrollSnapType = prevSnap;
        }
      });
      return true;
    },
    [count]
  );

  const findNearestSlot = useCallback(
    (track, metrics) => {
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
    },
    []
  );

  const syncCards = useCallback(() => {
    const track = trackRef.current;
    if (!track || count === 0) return;

    const metrics = getTrackMetrics(track);
    if (!dragRef.current.active && (!scrollLockRef.current.until || Date.now() >= scrollLockRef.current.until)) {
      normalizeBoundary(track, metrics);
    }

    // Batch seluruh DOM reads terlebih dahulu sebelum writes (cegah layout thrashing)
    const clientW = track.clientWidth;
    const centerX = track.scrollLeft + clientW / 2;
    const anchor = metrics.isNarrow ? centerX : track.scrollLeft + metrics.padLeft;
    const itemsMetrics = cardRefs.current.map(card =>
      card ? { card, left: card.offsetLeft, width: card.offsetWidth } : null
    );

    let closestSlot = 0;
    let closestDist = Infinity;
    const updates = [];

    itemsMetrics.forEach((m, i) => {
      if (!m) return;
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
    });

    updates.forEach(u => {
      if (u.card.style.transform !== u.transform) u.card.style.transform = u.transform;
      if (u.card.style.opacity !== u.opacity) u.card.style.opacity = u.opacity;
    });

    if (Date.now() < scrollLockRef.current.until) return;
    setActiveSlot(prev => (prev === closestSlot ? prev : closestSlot));
  }, [count, getTrackMetrics, normalizeBoundary]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || count === 0) return;

    if (!initializedRef.current && count > 1) {
      initializedRef.current = true;
      const metrics = getTrackMetrics(track);
      const startSlot = count; // Copy ke-1 sebagai posisi awal agar kiri & kanan bebas digeser
      track.scrollTo({ left: getSlotTargetScroll(track, startSlot, metrics), behavior: "instant" });
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
      if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current);
      track.removeEventListener("scroll", scheduleSync);
      ro.disconnect();
    };
  }, [count, getSlotTargetScroll, getTrackMetrics, syncCards]);

  const animateToSlot = useCallback(
    slot => {
      const track = trackRef.current;
      if (!track || count === 0) return;
      const metrics = getTrackMetrics(track);

      // Pastikan slot target punya ruang buffer kiri/kanan sebelum smooth-scroll
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

      const target = getSlotTargetScroll(track, safeSlot, metrics);
      scrollLockRef.current = { until: Date.now() + 460 };
      track.scrollTo({ left: target, behavior: "smooth" });
      setActiveSlot(safeSlot);

      if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current);
      settleTimerRef.current = window.setTimeout(() => {
        if (trackRef.current) {
          const m = getTrackMetrics(trackRef.current);
          const wrapped = normalizeBoundary(trackRef.current, m);
          if (wrapped) {
            setActiveSlot(findNearestSlot(trackRef.current, m));
          } else {
            syncCards();
          }
        }
      }, 480);
    },
    [count, findNearestSlot, getSlotTargetScroll, getTrackMetrics, normalizeBoundary, syncCards]
  );

  const step = useCallback(
    dir => {
      const track = trackRef.current;
      if (!track || count === 0) return;
      const curSlot = findNearestSlot(track, getTrackMetrics(track));
      animateToSlot(curSlot + dir);
    },
    [animateToSlot, count, findNearestSlot, getTrackMetrics]
  );

  const scrollToLogical = useCallback(
    logicalIndex => {
      const track = trackRef.current;
      if (!track || count <= 1) return;
      const metrics = getTrackMetrics(track);
      const anchor = metrics.isNarrow
        ? track.scrollLeft + track.clientWidth / 2
        : track.scrollLeft + metrics.padLeft;

      // Cari salinan kartu terdekat agar perpindahan ke dot target menempuh jarak paling singkat
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
    [animateToSlot, count, getTrackMetrics]
  );

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
        if (count > 1) {
          const metrics = getTrackMetrics(track);
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
    const onEnd = e => {
      const d = dragRef.current;
      const track = trackRef.current;
      if (!d.active || e.pointerId !== d.pointerId) return;
      if (d.moved) {
        suppressClickRef.current = true;
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 120);
      }
      d.active = false;
      if (track) {
        track.classList.remove("is-dragging");
        track.style.scrollSnapType = "";
      }
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
  }, [count, getTrackMetrics, syncCards]);

  const onPointerDown = e => {
    if (e.pointerType !== "mouse" || e.button !== 0 || !trackRef.current) return;
    scrollLockRef.current = { until: 0 };
    dragRef.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startScroll: trackRef.current.scrollLeft,
      moved: false
    };
  };

  const onCardClick = (logicalIndex, e) => {
    if (suppressClickRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onOpenImage(items, logicalIndex);
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
          onDragStart={e => e.preventDefault()}
          role="region"
          aria-label="Daftar sertifikasi model recent apps geser tanpa batas"
        >
          {repeated.map(({ item: c, idx, copy, slot }) => (
            <button
              key={`${copy}-${c.src}`}
              ref={el => { cardRefs.current[slot] = el; }}
              type="button"
              tabIndex={count > 1 ? (copy === 1 ? 0 : -1) : 0}
              className={`cert-app${activeSlot === slot ? " is-focused" : ""}`}
              aria-label={`Lihat ${c.label}`}
              onPointerEnter={onPrefetch}
              onFocus={onPrefetch}
              onClick={e => onCardClick(idx, e)}
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
                <img
                  src={`${IMG}thumbs/${c.src}`}
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
            onClick={() => scrollToLogical(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(CertSwitcher);
