import { memo, useEffect, useRef } from "react";
import { IMG } from "../data.ts";
import { prefersReducedMotion } from "../hooks.ts";
import { isSaveData } from "../prefetch.ts";

function Hero() {
  const secRef = useRef<HTMLElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const artRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const vid = videoRef.current;
    const reduced = prefersReducedMotion();
    if (vid && !isSaveData() && !reduced) {
      vid.defaultMuted = true;
      vid.muted = true;
      void vid.play().catch(() => {});
    }

    if (reduced) return;

    let raf = 0;
    let lastProgress = -1;
    const update = () => {
      raf = 0;
      const sec = secRef.current;
      if (!sec) return;
      const h = Math.max(sec.offsetHeight, 400);
      const progress = Math.max(0, Math.min(1, window.scrollY / h));
      if (Math.abs(progress - lastProgress) < 0.001) return;
      lastProgress = progress;

      if (textRef.current) {
        textRef.current.style.transform = progress ? `translate3d(0, ${(-progress * 38).toFixed(1)}px, 0)` : "";
        textRef.current.style.opacity = progress ? String(Math.max(0.15, 1 - progress * 0.95).toFixed(3)) : "";
      }
      if (artRef.current) {
        artRef.current.style.transform = progress ? `translate3d(0, ${(-progress * 54).toFixed(1)}px, 0)` : "";
        artRef.current.style.opacity = progress ? String(Math.max(0.2, 1 - progress * 0.85).toFixed(3)) : "";
      }

      if (vid) {
        if ((progress >= 0.98 || document.hidden) && !vid.paused) vid.pause();
        else if (progress < 0.98 && !document.hidden && !reduced && !isSaveData() && vid.paused) {
          void vid.play().catch(() => {});
        }
      }
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    const onVisibility = () => {
      if (!vid) return;
      if (document.hidden && !vid.paused) vid.pause();
      else if (!document.hidden && lastProgress < 0.98 && !reduced && !isSaveData() && vid.paused) {
        void vid.play().catch(() => {});
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <section className="hero" id="home" ref={secRef}>
      <div className="container hero__inner">
        <div className="hero__text" ref={textRef}>
          <p className="eyebrow">Hi, saya Agung Saeful</p>
          <h1>PORTFOLIO<span>Graphic Design</span></h1>
          <p className="hero__lead">
            Menyediakan layanan desain grafis yang lengkap dan terbukti berhasil untuk klien korporat.
          </p>
          <div className="hero__cta">
            <a href="#portfolio" className="btn btn--grad">Get Started</a>
            <a href="#about" className="btn btn--ghost">Tentang saya</a>
          </div>
        </div>
        <div className="hero__art" ref={artRef}>
          <div className="hero__video-box">
            <video
              ref={videoRef}
              poster={`${IMG}hero-intro-poster.webp`}
              width={902}
              height={684}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Animasi ilustrasi desainer grafis memegang karya dan palet desain"
            >
              <source src={`${import.meta.env.BASE_URL}video/intro.webm`} type="video/webm" />
              <source src={`${import.meta.env.BASE_URL}video/intro.mp4`} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(Hero);
