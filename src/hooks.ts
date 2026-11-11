import { useEffect, useRef, useState, type RefObject } from "react";

let sharedRevealIO: IntersectionObserver | null = null;
const revealCallbacks = new WeakMap<Element, () => void>();
const pendingRevealNodes = new Set<Element>();
let sweepListenerAttached = false;
let sweepRaf = 0;

function runRevealSweep(): void {
  sweepRaf = 0;
  if (pendingRevealNodes.size === 0) return;
  const triggerLine = window.innerHeight * 0.99;
  // Fase baca layout terlebih dahulu untuk mencegah interleaved read/write layout thrashing
  const matched: Array<{ node: Element; cb: () => void }> = [];
  for (const node of pendingRevealNodes) {
    if (node.getBoundingClientRect().top <= triggerLine) {
      const cb = revealCallbacks.get(node);
      if (cb) matched.push({ node, cb });
      else pendingRevealNodes.delete(node);
    }
  }
  for (const { node, cb } of matched) {
    revealCallbacks.delete(node);
    pendingRevealNodes.delete(node);
    sharedRevealIO?.unobserve(node);
    cb();
  }
}

function scheduleRevealSweep(): void {
  if (!sweepRaf && pendingRevealNodes.size > 0) {
    sweepRaf = window.requestAnimationFrame(runRevealSweep);
  }
}

function attachSweep(): void {
  if (sweepListenerAttached) return;
  sweepListenerAttached = true;
  window.addEventListener("scroll", scheduleRevealSweep, { passive: true });
}

function getRevealObserver(): IntersectionObserver {
  if (sharedRevealIO) return sharedRevealIO;
  attachSweep();
  sharedRevealIO = new IntersectionObserver(
    entries => {
      const toRun: Array<() => void> = [];
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        const cb = revealCallbacks.get(en.target);
        if (cb) toRun.push(cb);
        revealCallbacks.delete(en.target);
        pendingRevealNodes.delete(en.target);
        sharedRevealIO?.unobserve(en.target);
      }
      for (const cb of toRun) cb();
    },
    { rootMargin: "0px 0px -1% 0px", threshold: 0.01 }
  );
  return sharedRevealIO;
}

/** Mengamati kemunculan elemen lewat satu shared IntersectionObserver & satu batched rAF sweep. */
function observeReveal(node: Element, onEnter: () => void): () => void {
  const io = getRevealObserver();
  revealCallbacks.set(node, onEnter);
  pendingRevealNodes.add(node);
  io.observe(node);
  scheduleRevealSweep();

  return () => {
    revealCallbacks.delete(node);
    pendingRevealNodes.delete(node);
    io.unobserve(node);
  };
}

/** Mengamati elemen tunggal saat masuk viewport. */
export function useReveal<T extends HTMLElement = HTMLDivElement>(): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    return observeReveal(node, () => node.classList.add("is-visible"));
  }, []);
  return ref;
}

/**
 * Mengamati kartu Pendidikan & Pengalaman Kerja dengan trigger responsif cepat
 * agar kaskade timeline langsung terasa hidup tanpa terasa menunggu.
 */
export function useJourneyReveal<T extends HTMLElement = HTMLDivElement>(
  settleMs = 960
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const card = ref.current;
    if (!card) return;
    let settled = 0;

    const unobserve = observeReveal(card, () => {
      if (card.classList.contains("is-animated")) return;
      card.classList.add("is-animated");
      settled = window.setTimeout(() => card.classList.add("is-settled"), settleMs);
    });

    return () => {
      unobserve();
      if (settled) window.clearTimeout(settled);
    };
  }, [settleMs]);
  return ref;
}

/** Mengamati elemen kartu individu dengan stagger cepat per-baris dan cleanup settle otomatis. */
export function useRevealCard<T extends HTMLElement = HTMLButtonElement>(
  delayMs = 0,
  resetKey = ""
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("is-shown", "is-settled");
    let settleTimer = 0;

    const unobserve = observeReveal(el, () => {
      el.style.setProperty("--reveal-delay", `${delayMs}ms`);
      el.classList.add("is-shown");
      settleTimer = window.setTimeout(() => {
        el.classList.add("is-settled");
        el.style.removeProperty("--reveal-delay");
      }, 460 + delayMs);
    });

    return () => {
      unobserve();
      if (settleTimer) window.clearTimeout(settleTimer);
    };
  }, [delayMs, resetKey]);
  return ref;
}

/** Memunculkan child [data-reveal-item] secara cepat & responsif saat masuk viewport. */
export function useRevealGroup<T extends HTMLElement = HTMLDivElement>(
  staggerMs = 50,
  triggerKey = ""
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal-item]"));
    const targets: HTMLElement[] = items.length ? items : [root];

    for (const el of targets) el.classList.remove("is-shown", "is-settled");

    let settleTimer = 0;
    const unobserve = observeReveal(root, () => {
      const maxDelay = Math.min(targets.length - 1, 8) * staggerMs;
      targets.forEach((el, idx) => {
        el.style.setProperty("--reveal-delay", `${Math.min(idx, 8) * staggerMs}ms`);
        el.classList.add("is-shown");
      });
      settleTimer = window.setTimeout(() => {
        for (const el of targets) {
          el.classList.add("is-settled");
          el.style.removeProperty("--reveal-delay");
        }
      }, 460 + maxDelay);
    });

    return () => {
      unobserve();
      if (settleTimer) window.clearTimeout(settleTimer);
    };
  }, [staggerMs, triggerKey]);
  return ref;
}

/** Mengecek preferensi pengguna untuk mengurangi animasi gerakan (a11y). */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Menghitung angka naik (0 -> target) dengan kurva easeOut saat masuk viewport. */
export function useCountUp<T extends HTMLElement = HTMLElement>(
  target: string | number,
  duration = 950
): { ref: RefObject<T | null>; display: string } {
  const ref = useRef<T | null>(null);
  const fullLabel = String(target);
  const num = Number.parseInt(fullLabel, 10) || 0;
  const suffix = fullLabel.replaceAll(/[0-9]/g, "");
  // Inisialisasi nilai asli agar SSR/non-JS menampilkan angka sebenarnya & bebas hydration mismatch
  const [display, setDisplay] = useState(fullLabel);

  useEffect(() => {
    const node = ref.current;
    if (!node || !num || prefersReducedMotion()) return;

    let raf = 0;
    let started = false;
    const unobserve = observeReveal(node, () => {
      if (started) return;
      started = true;
      setDisplay(`0${suffix}`);
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 2.2);
        setDisplay(`${Math.round(num * eased)}${suffix}`);
        if (t < 1) raf = window.requestAnimationFrame(tick);
      };
      raf = window.requestAnimationFrame(tick);
    });

    return () => {
      unobserve();
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [num, suffix, duration]);

  return { ref, display };
}

/**
 * Scroll anchor cepat & bebas lag:
 * scroll wheel / trackpad / sentuh sepenuhnya berjalan native di compositor browser (0 ms delay),
 * sementara klik tautan #section memakai animasi GPU easeOutCubic yang langsung berhenti jika user menyentuh scroll.
 */
export function useSmoothScroll(disabled: boolean): void {
  useEffect(() => {
    if (disabled) return;
    let raf = 0;

    const cancelAnim = () => {
      if (raf) {
        window.cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const animateTo = (targetY: number) => {
      cancelAnim();
      const startY = window.scrollY;
      const dist = targetY - startY;
      if (Math.abs(dist) < 2 || prefersReducedMotion()) {
        window.scrollTo({ top: targetY, behavior: "instant" });
        return;
      }
      const duration = Math.min(380, Math.max(200, Math.abs(dist) * 0.22));
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        window.scrollTo({ top: startY + dist * eased, behavior: "instant" });
        if (t < 1) raf = window.requestAnimationFrame(step);
        else raf = 0;
      };
      raf = window.requestAnimationFrame(step);
    };

    const onAnchorClick = (e: MouseEvent) => {
      const link = e.target instanceof Element ? e.target.closest('a[href^="#"]') : null;
      if (!link) return;
      const id = link.getAttribute("href")?.slice(1);
      if (!id) return;
      const destEl = document.getElementById(id);
      if (!destEl) return;
      e.preventDefault();
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const offset = id === "home" ? 0 : Math.max(0, destEl.getBoundingClientRect().top + window.scrollY - 76);
      animateTo(Math.min(maxScroll, offset));
    };

    window.addEventListener("wheel", cancelAnim, { passive: true });
    window.addEventListener("touchstart", cancelAnim, { passive: true });
    document.addEventListener("click", onAnchorClick);
    return () => {
      cancelAnim();
      window.removeEventListener("wheel", cancelAnim);
      window.removeEventListener("touchstart", cancelAnim);
      document.removeEventListener("click", onAnchorClick);
    };
  }, [disabled]);
}

/** Mengembalikan id section aktif serta flag apakah halaman sudah di-scroll. */
export function useScrollSpy(ids: readonly string[]): { active: string; scrolled: boolean } {
  const [state, setState] = useState({ active: ids[0] ?? "", scrolled: false });
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => {
        for (const en of entries) {
          if (en.isIntersecting) {
            setState(prev => (prev.active === en.target.id ? prev : { ...prev, active: en.target.id }));
          }
        }
      },
      { rootMargin: "-42% 0px -48% 0px" }
    );
    for (const id of ids) {
      const n = document.getElementById(id);
      if (n) io.observe(n);
    }

    let raf = 0;
    const onScrollEdge = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const doc = document.documentElement;
        const scrolled = window.scrollY > 20;
        let nextActive: string | null = null;
        if (window.scrollY <= 36) nextActive = ids[0] ?? null;
        else if (window.innerHeight + window.scrollY >= doc.scrollHeight - 24) {
          nextActive = ids[ids.length - 1] ?? null;
        }
        setState(prev => {
          const active = nextActive || prev.active;
          if (prev.active === active && prev.scrolled === scrolled) return prev;
          return { active, scrolled };
        });
      });
    };
    onScrollEdge();
    window.addEventListener("scroll", onScrollEdge, { passive: true });
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScrollEdge);
      io.disconnect();
    };
  }, [ids]);
  return state;
}

/** Mengunci focus Tab tetap berputar di dalam dialog aktif demi aksesibilitas penuh. */
export function useFocusTrap(containerRef: RefObject<HTMLElement | null>, active = true): void {
  useEffect(() => {
    if (!active) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !containerRef.current) return;
      const focusable = containerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [containerRef, active]);
}

/** Mengunci scroll body tanpa menyebabkan layout shift akibat hilangnya scrollbar desktop. */
export function useBodyLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    const gap = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    document.documentElement.style.setProperty("--sb-gap", `${gap}px`);
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.setProperty("--sb-gap", "0px");
      document.body.style.overflow = "";
    };
  }, [locked]);
}

/** Menjaga komponen tetap ter-mount selama exit animation yang cepat. */
export function useAnimatedPresence<T>(value: T | null, exitMs = 160): {
  rendered: T | null;
  closing: boolean;
} {
  const [cached, setCached] = useState<T | null>(value);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (value) {
      setCached(value);
      setClosing(false);
      return;
    }
    if (!cached) return;
    setClosing(true);
    const id = window.setTimeout(() => {
      setCached(null);
      setClosing(false);
    }, exitMs);
    return () => window.clearTimeout(id);
  }, [value, exitMs, cached]);

  return { rendered: value ?? cached, closing: Boolean(!value && cached && closing) };
}

/** Memastikan video terus berputar dan looping mulus tanpa jeda saat scroll maupun berpindah posisi halaman. */
export function useLoopingVideo(
  videoRef: RefObject<HTMLVideoElement | null>,
  disabled: boolean
): void {
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (disabled) {
      vid.pause();
      return;
    }

    const ensurePlay = () => {
      if (document.hidden) return;
      vid.defaultMuted = true;
      vid.muted = true;
      if (vid.paused) void vid.play().catch(() => {});
    };

    ensurePlay();

    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        entries => {
          if (entries.some(e => e.isIntersecting)) ensurePlay();
        },
        { rootMargin: "320px 0px" }
      );
      io.observe(vid);
    }

    vid.addEventListener("canplay", ensurePlay);
    document.addEventListener("visibilitychange", ensurePlay);
    return () => {
      io?.disconnect();
      vid.removeEventListener("canplay", ensurePlay);
      document.removeEventListener("visibilitychange", ensurePlay);
    };
  }, [videoRef, disabled]);
}
