import { memo, useEffect, useRef } from "react";
import { IMG } from "../data.js";
import Picture, { toWebpSrc } from "./Picture.jsx";

function Hero() {
  const secRef = useRef(null);
  const textRef = useRef(null);
  const artRef = useRef(null);

  // Subtle GPU-composited scroll parallax saat scroll ke bawah (ala GSAP scrub)
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const sec = secRef.current;
      if (!sec) return;
      const h = Math.max(sec.offsetHeight, 400);
      const progress = Math.max(0, Math.min(1, window.scrollY / h));
      if (textRef.current) {
        textRef.current.style.transform = progress ? `translate3d(0, ${(-progress * 38).toFixed(1)}px, 0)` : "";
        textRef.current.style.opacity = progress ? String(Math.max(0.15, 1 - progress * 0.95).toFixed(3)) : "";
      }
      if (artRef.current) {
        artRef.current.style.transform = progress ? `translate3d(0, ${(-progress * 54).toFixed(1)}px, 0)` : "";
        artRef.current.style.opacity = progress ? String(Math.max(0.2, 1 - progress * 0.85).toFixed(3)) : "";
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
          <Picture
            src={`${IMG}hero-art.jpg`}
            webpSrc={toWebpSrc("hero-art.jpg")}
            alt="Ilustrasi desainer grafis memegang gambar, palet warna, dan ikon tipografi"
            width={1136}
            height={1193}
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}

export default memo(Hero);
