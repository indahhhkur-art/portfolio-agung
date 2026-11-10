import { IMG } from "../data.js";
import { useReveal } from "../hooks.js";

const RIBBON_ITEMS = [
  "E-Commerce Design",
  "Social Media Campaign",
  "Packaging & Print",
  "Corporate Branding",
  "Icon & Ilustrasi Vektor",
  "Digital Marketing Assets"
];

export default function Hero() {
  const textRef = useReveal();
  const artRef = useReveal();

  return (
    <section className="hero" id="home">
      <div className="container hero__inner">
        <div className="hero__text reveal" ref={textRef}>
          <span className="hello-pill">
            <span className="hello-pill__dot" aria-hidden="true" />
            Hi, saya Agung Saeful
          </span>
          <h1>
            PORTFOLIO <span className="text-grad">Graphic Design</span>
          </h1>
          <p className="hero__lead">
            Menyediakan layanan desain grafis yang lengkap, komunikatif, dan terbukti efektif untuk brand digital maupun klien korporat.
          </p>
          <div className="hero__cta">
            <a href="#portfolio" className="btn btn--compound">
              <span>Lihat Portfolio</span>
              <span className="btn__circle" aria-hidden="true">↗</span>
            </a>
            <a href="#about" className="btn btn--ghost">Tentang saya</a>
          </div>
        </div>

        <div className="hero__art reveal" ref={artRef}>
          <div className="hero__frame">
            <img
              src={`${IMG}hero-art.jpg`}
              alt="Ilustrasi desainer grafis memegang gambar, palet warna, dan ikon tipografi"
              fetchPriority="high"
              decoding="async"
            />
            <span className="float-pill float-pill--top">Brand & Social Media</span>
            <span className="float-pill float-pill--bottom">5+ Tahun Pengalaman</span>
          </div>
        </div>
      </div>

      <div className="ribbon" aria-hidden="true">
        <div className="ribbon__track">
          {[...RIBBON_ITEMS, ...RIBBON_ITEMS].map((item, i) => (
            <span className="ribbon__item" key={`${item}-${i}`}>
              <span className="ribbon__star">✦</span> {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
