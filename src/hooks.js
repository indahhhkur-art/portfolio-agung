import { useEffect, useRef, useState } from "react";

let sharedRevealIO = null;
const revealCallbacks = new WeakMap();
const pendingRevealNodes = new Set();
let sweepListenerAttached = false;
let sweepRaf = 0;

function runRevealSweep() {
  sweepRaf = 0;
  const triggerLine = window.innerHeight * 0.95;
  pendingRevealNodes.forEach(node => {
    const rect = node.getBoundingClientRect();
    if (rect.top <= triggerLine) {
      const cb = revealCallbacks.get(node);
      if (cb) {
        cb();
        revealCallbacks.delete(node);
      }
      pendingRevealNodes.delete(node);
      sharedRevealIO?.unobserve(node);
    }
  });
}

function attachSweep() {
  if (sweepListenerAttached) return;
  sweepListenerAttached = true;
  window.addEventListener(
    "scroll",
    () => {
      if (!sweepRaf && pendingRevealNodes.size > 0) {
        sweepRaf = window.requestAnimationFrame(runRevealSweep);
      }
    },
    { passive: true }
  );
}

function getRevealObserver() {
  if (sharedRevealIO) return sharedRevealIO;
  attachSweep();
  sharedRevealIO = new IntersectionObserver(
    entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const cb = revealCallbacks.get(en.target);
        if (cb) {
          cb();
          revealCallbacks.delete(en.target);
        }
        pendingRevealNodes.delete(en.target);
        sharedRevealIO.unobserve(en.target);
      });
    },
    { rootMargin: "0px 0px -4% 0px", threshold: 0.01 }
  );
  return sharedRevealIO;
}

/** Mengamati elemen tunggal saat masuk viewport. */
export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = getRevealObserver();
    revealCallbacks.set(node, () => node.classList.add("is-visible"));
    pendingRevealNodes.add(node);
    io.observe(node);
    return () => {
      revealCallbacks.delete(node);
      pendingRevealNodes.delete(node);
      io.unobserve(node);
    };
  }, []);
  return ref;
}

/**
 * Mengamati kartu Pendidikan & Pengalaman Kerja agar animasi bertingkat
 * baru terpicu saat kartu benar-benar masuk ke area pandang (~82% viewport),
 * sehingga rangkaian timeline terasa hidup saat dilihat.
 */
export function useJourneyReveal(settleMs = 1750) {
  const ref = useRef(null);
  useEffect(() => {
    const card = ref.current;
    if (!card) return;
    let settled = 0;

    const activate = () => {
      if (card.classList.contains("is-animated")) return;
      card.classList.add("is-animated");
      settled = window.setTimeout(() => card.classList.add("is-settled"), settleMs);
    };

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            activate();
            io.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px -16% 0px", threshold: 0.1 }
    );
    io.observe(card);

    // Fallback jika user melompat langsung melewati posisi elemen ke bagian lebih bawah
    let raf = 0;
    const onScrollPast = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        if (card.getBoundingClientRect().top <= window.innerHeight * 0.84) {
          activate();
          io.disconnect();
          window.removeEventListener("scroll", onScrollPast);
        }
      });
    };
    window.addEventListener("scroll", onScrollPast, { passive: true });
    onScrollPast();

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      if (settled) window.clearTimeout(settled);
      window.removeEventListener("scroll", onScrollPast);
      io.disconnect();
    };
  }, [settleMs]);
  return ref;
}

/** Mengamati elemen kartu individu dengan stagger per-baris dan cleanup settle otomatis. */
export function useRevealCard(delayMs = 0, resetKey = "") {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("is-shown", "is-settled");
    let settleTimer = 0;

    const show = () => {
      el.style.setProperty("--reveal-delay", `${delayMs}ms`);
      el.classList.add("is-shown");
      settleTimer = window.setTimeout(() => {
        el.classList.add("is-settled");
        el.style.removeProperty("--reveal-delay");
      }, 760 + delayMs);
    };

    const io = getRevealObserver();
    revealCallbacks.set(el, show);
    pendingRevealNodes.add(el);
    io.observe(el);

    const raf = window.requestAnimationFrame(() => {
      if (el.getBoundingClientRect().top <= window.innerHeight * 0.95 && revealCallbacks.has(el)) {
        show();
        revealCallbacks.delete(el);
        pendingRevealNodes.delete(el);
        io.unobserve(el);
      }
    });

    return () => {
      window.cancelAnimationFrame(raf);
      if (settleTimer) window.clearTimeout(settleTimer);
      revealCallbacks.delete(el);
      pendingRevealNodes.delete(el);
      io.unobserve(el);
    };
  }, [delayMs, resetKey]);
  return ref;
}

/**
 * Mengamati kontainer dan memunculkan seluruh child [data-reveal-item] secara bertahap
 * (staggered power3.out), lalu membersihkan delay setelah selesai.
 */
export function useRevealGroup(staggerMs = 85, triggerKey = "") {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll("[data-reveal-item]"));
    const targets = items.length ? items : [root];

    targets.forEach(el => el.classList.remove("is-shown", "is-settled"));

    let settleTimer = 0;
    const triggerShow = () => {
      const maxDelay = Math.min(targets.length - 1, 10) * staggerMs;
      targets.forEach((el, idx) => {
        el.style.setProperty("--reveal-delay", `${Math.min(idx, 10) * staggerMs}ms`);
        el.classList.add("is-shown");
      });
      settleTimer = window.setTimeout(() => {
        targets.forEach(el => {
          el.classList.add("is-settled");
          el.style.removeProperty("--reveal-delay");
        });
      }, 760 + maxDelay);
    };

    const io = getRevealObserver();
    revealCallbacks.set(root, triggerShow);
    pendingRevealNodes.add(root);
    io.observe(root);

    const immediateCheck = window.requestAnimationFrame(() => {
      if (root.getBoundingClientRect().top <= window.innerHeight * 0.95 && revealCallbacks.has(root)) {
        triggerShow();
        revealCallbacks.delete(root);
        pendingRevealNodes.delete(root);
        io.unobserve(root);
      }
    });

    return () => {
      window.cancelAnimationFrame(immediateCheck);
      if (settleTimer) window.clearTimeout(settleTimer);
      revealCallbacks.delete(root);
      pendingRevealNodes.delete(root);
      io.unobserve(root);
    };
  }, [staggerMs, triggerKey]);
  return ref;
}

/** Menghitung angka naik (0 -> target) dengan kurva power2.out saat masuk viewport. */
export function useCountUp(target, duration = 1500) {
  const ref = useRef(null);
  const num = parseInt(String(target), 10) || 0;
  const suffix = String(target).replace(/[0-9]/g, "");
  const [display, setDisplay] = useState(`0${suffix}`);

  useEffect(() => {
    const node = ref.current;
    if (!node || !num) return;

    setDisplay(`0${suffix}`);
    let raf = 0;
    const io = getRevealObserver();
    let started = false;
    const startCount = () => {
      if (started) return;
      started = true;
      const start = performance.now();
      const tick = now => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 2.2);
        setDisplay(`${Math.round(num * eased)}${suffix}`);
        if (t < 1) raf = window.requestAnimationFrame(tick);
      };
      raf = window.requestAnimationFrame(tick);
    };
    revealCallbacks.set(node, startCount);
    pendingRevealNodes.add(node);
    io.observe(node);

    const immediateRaf = window.requestAnimationFrame(() => {
      if (!started && node.getBoundingClientRect().top <= window.innerHeight * 0.95) {
        startCount();
        revealCallbacks.delete(node);
        pendingRevealNodes.delete(node);
        io.unobserve(node);
      }
    });

    return () => {
      window.cancelAnimationFrame(immediateRaf);
      if (raf) window.cancelAnimationFrame(raf);
      revealCallbacks.delete(node);
      pendingRevealNodes.delete(node);
      io.unobserve(node);
    };
  }, [num, suffix, duration]);

  return { ref, display };
}

/** Smooth weighted wheel scroll (lerp ala Lenis) untuk desktop tanpa mengganggu modal atau touch. */
export function useSmoothScroll(disabled) {
  useEffect(() => {
    if (disabled) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let current = window.scrollY;
    let target = window.scrollY;
    let lastDrivenY = window.scrollY;
    let raf = 0;
    let lastTime = 0;
    let driving = false;

    const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const stopDriving = () => {
      if (raf) {
        window.cancelAnimationFrame(raf);
        raf = 0;
      }
      driving = false;
      current = window.scrollY;
      target = current;
      lastDrivenY = current;
    };

    const step = now => {
      const dt = Math.min(0.05, Math.max(0.004, (now - lastTime) / 1000));
      lastTime = now;
      const alpha = 1 - Math.pow(1 - 0.11, dt * 60);
      current += (target - current) * alpha;

      if (Math.abs(target - current) < 0.6) {
        lastDrivenY = target;
        window.scrollTo({ top: target, behavior: "instant" });
        driving = false;
        raf = 0;
        return;
      }

      lastDrivenY = current;
      window.scrollTo({ top: current, behavior: "instant" });
      raf = window.requestAnimationFrame(step);
    };

    const kick = () => {
      if (!raf) {
        driving = true;
        lastDrivenY = window.scrollY;
        lastTime = performance.now();
        raf = window.requestAnimationFrame(step);
      }
    };

    const onWheel = e => {
      if (e.ctrlKey || e.metaKey) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (e.target instanceof Element && e.target.closest(".modal__panel")) return;

      e.preventDefault();
      if (!driving) {
        current = window.scrollY;
        target = current;
      }
      const scale = e.deltaMode === 1 ? 36 : e.deltaMode === 2 ? window.innerHeight : 1;
      target = Math.max(0, Math.min(maxScroll(), target + e.deltaY * scale * 0.92));
      kick();
    };

    const onNativeScroll = () => {
      if (!driving) {
        current = window.scrollY;
        target = current;
      } else if (Math.abs(window.scrollY - lastDrivenY) > 24) {
        stopDriving();
      }
    };

    const onKeyScroll = e => {
      if (driving && ["PageUp", "PageDown", "Home", "End", "ArrowUp", "ArrowDown", " "].includes(e.key)) {
        stopDriving();
      }
    };

    const onAnchorClick = e => {
      const link = e.target instanceof Element ? e.target.closest('a[href^="#"]') : null;
      if (!link) return;
      const id = link.getAttribute("href").slice(1);
      if (!id) return;
      const destEl = document.getElementById(id);
      if (!destEl) return;
      e.preventDefault();
      current = window.scrollY;
      const offset = id === "home" ? 0 : Math.max(0, destEl.getBoundingClientRect().top + window.scrollY - 76);
      target = Math.min(maxScroll(), offset);
      kick();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    window.addEventListener("keydown", onKeyScroll, { passive: true });
    document.addEventListener("click", onAnchorClick);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("keydown", onKeyScroll);
      document.removeEventListener("click", onAnchorClick);
    };
  }, [disabled]);
}

/** Mengembalikan id section aktif serta flag apakah halaman sudah di-scroll. */
export function useScrollSpy(ids) {
  const [state, setState] = useState({ active: ids[0], scrolled: false });
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            setState(prev => (prev.active === en.target.id ? prev : { ...prev, active: en.target.id }));
          }
        });
      },
      { rootMargin: "-42% 0px -48% 0px" }
    );
    ids.forEach(id => {
      const n = document.getElementById(id);
      if (n) io.observe(n);
    });

    let raf = 0;
    const onScrollEdge = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const doc = document.documentElement;
        const scrolled = window.scrollY > 20;
        let nextActive = null;
        if (window.scrollY <= 36) nextActive = ids[0];
        else if (window.innerHeight + window.scrollY >= doc.scrollHeight - 24) {
          nextActive = ids[ids.length - 1];
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
export function useFocusTrap(containerRef, active = true) {
  useEffect(() => {
    if (!active) return;
    const onKeyDown = e => {
      if (e.key !== "Tab" || !containerRef.current) return;
      const focusable = containerRef.current.querySelectorAll(
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
export function useBodyLock(locked) {
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

/** Menjaga komponen tetap ter-mount selama exit animation agar transisi keluar tetap mulus. */
export function useAnimatedPresence(value, exitMs = 220) {
  const [cached, setCached] = useState(value);
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

  return { rendered: value || cached, closing: Boolean(!value && cached && closing) };
}
