import { useEffect, useRef, useState } from "react";

let sharedRevealIO = null;
const revealCallbacks = new WeakMap();

function getRevealObserver() {
  if (sharedRevealIO) return sharedRevealIO;
  sharedRevealIO = new IntersectionObserver(
    entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const cb = revealCallbacks.get(en.target);
        if (cb) {
          cb();
          revealCallbacks.delete(en.target);
        }
        sharedRevealIO.unobserve(en.target);
      });
    },
    { rootMargin: "0px 0px -32px 0px", threshold: 0.06 }
  );
  return sharedRevealIO;
}

/** Menambahkan class "is-visible" saat elemen masuk viewport via shared observer tunggal. */
export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = getRevealObserver();
    revealCallbacks.set(node, () => node.classList.add("is-visible"));
    io.observe(node);
    return () => {
      revealCallbacks.delete(node);
      io.unobserve(node);
    };
  }, []);
  return ref;
}

/** Mengembalikan id section aktif dengan penanganan akurat di ujung atas dan bawah halaman. */
export function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(en => {
          if (en.isIntersecting) setActive(en.target.id);
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
        if (window.scrollY <= 36) setActive(ids[0]);
        else if (window.innerHeight + window.scrollY >= doc.scrollHeight - 24) {
          setActive(ids[ids.length - 1]);
        }
      });
    };
    window.addEventListener("scroll", onScrollEdge, { passive: true });
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScrollEdge);
      io.disconnect();
    };
  }, [ids]);
  return active;
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
