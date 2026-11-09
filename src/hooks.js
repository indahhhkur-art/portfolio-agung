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
      { threshold: 0.12 }
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

/** Mengunci scroll body selama `locked` true. */
export function useBodyLock(locked) {
  useEffect(() => {
    document.body.style.overflow = locked ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [locked]);
}
