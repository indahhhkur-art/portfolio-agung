import { memo } from "react";
import { IMG } from "../data.js";
import Picture, { toWebpSrc } from "./Picture.jsx";

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="container hero__inner">
        <div className="hero__text">
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
        <div className="hero__art">
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
