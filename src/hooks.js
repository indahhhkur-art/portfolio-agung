import { useEffect, useRef, useState } from "react";

/** Menambahkan class "is-visible" saat elemen masuk viewport. */
export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting) {
          node.classList.add("is-visible");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -36px 0px", threshold: 0.08 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);
  return ref;
}

/** Mengembalikan id section yang sedang aktif di tengah layar. */
export function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(en => en.isIntersecting && setActive(en.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach(id => {
      const n = document.getElementById(id);
      n && io.observe(n);
    });
    return () => io.disconnect();
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
