import { memo, useEffect, useRef, useState } from "react";

/** Indikator progres baca atas (GPU scaleX) & tombol cepat Kembali ke Atas. */
function ScrollUI({ hidden }) {
  const barRef = useRef(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const ratio = Math.max(0, Math.min(1, window.scrollY / max));
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${ratio.toFixed(4)})`;
      }
      const nextShow = window.scrollY > 520;
      setShowTop(prev => (prev === nextShow ? prev : nextShow));
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" ref={barRef} aria-hidden="true" />
      <a
        href="#home"
        className={`icon-btn back-top${showTop && !hidden ? " is-visible" : ""}`}
        aria-label="Kembali ke atas"
        title="Kembali ke atas"
      >
        ↑
      </a>
    </>
  );
}

export default memo(ScrollUI);
