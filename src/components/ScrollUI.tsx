import { memo, useEffect, useRef, useState } from "react";

/** Indikator progres baca atas (GPU scaleX) & tombol cepat Kembali ke Atas. */
function ScrollUI({ hidden }: { hidden: boolean }) {
  const barRef = useRef<HTMLDivElement | null>(null);
  const [showTop, setShowTop] = useState(false);
  const [atFooter, setAtFooter] = useState(false);

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
    if (window.scrollY > 0) update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    let footerIo: IntersectionObserver | undefined;
    const footerEl = document.querySelector(".footer");
    if (footerEl && typeof IntersectionObserver !== "undefined") {
      footerIo = new IntersectionObserver(
        entries => {
          const footerVisible = entries.some(e => e.isIntersecting);
          setAtFooter(prev => (prev === footerVisible ? prev : footerVisible));
        },
        { threshold: 0.05 }
      );
      footerIo.observe(footerEl);
    }

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      footerIo?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const visible = showTop && !hidden && !atFooter;

  return (
    <>
      <div className="scroll-progress" ref={barRef} aria-hidden="true" />
      <a
        href="#home"
        className={`icon-btn back-top${visible ? " is-visible" : ""}`}
        aria-label="Kembali ke atas"
        title="Kembali ke atas"
        aria-hidden={!visible}
        tabIndex={visible ? undefined : -1}
      >
        ↑
      </a>
    </>
  );
}

export default memo(ScrollUI);
