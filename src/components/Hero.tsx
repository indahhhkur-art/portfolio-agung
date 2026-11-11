import { memo, useEffect, useRef } from "react";
import { IMG } from "../data.ts";

function Hero() {
  const secRef = useRef<HTMLElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const artRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.defaultMuted = true;
      vid.muted = true;
      void vid.play().catch(() => {});
    }

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
        if (progress >= 0.98 && !vid.paused) vid.pause();
        else if (progress < 0.98 && vid.paused) void vid.play().catch(() => {});
      }
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
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
              src={`${import.meta.env.BASE_URL}video/intro.mp4`}
              poster={`${IMG}hero-intro-poster.webp`}
              width={1280}
              height={720}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label="Animasi ilustrasi desainer grafis memegang karya dan palet desain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(Hero);
