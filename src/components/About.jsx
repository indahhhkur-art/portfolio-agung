import { CERTS, EDUCATION, EXPERIENCE, IMG, TOOLS } from "../data.js";
import { useReveal } from "../hooks.js";
import CertSwitcher from "./CertSwitcher.jsx";

const STATS = [
  { value: "5+", label: "Tahun pengalaman" },
  { value: "12+", label: "Klien & proyek" },
  { value: CERTS.length, label: "Sertifikasi resmi" }
];

export default function About({ onOpenImage }) {
  const bannerRef = useReveal();
  const toolsRef = useReveal();
  const journeyRef = useReveal();

  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about__banner reveal" ref={bannerRef}>
          <div className="about__photo-card">
            <img src={`${IMG}agung-photo.jpg`} alt="Foto Agung Saeful" loading="lazy" decoding="async" />
          </div>

          <div className="about__content">
            <p className="eyebrow eyebrow--light">About Me</p>
            <h2>
              Siapa{" "}
              <a
                href="https://linkedin.com/in/agungsaeful"
                target="_blank"
                rel="noopener noreferrer"
                className="about__name-link"
                title="Kunjungi profil LinkedIn Agung Saeful"
              >
                AGUNG SAEFUL? ↗
              </a>
            </h2>
            <p className="about__lead">
              Lulusan Teknologi Informasi dengan pengalaman magang di Bank Syariah Indonesia pada bidang
              operasional, administrasi, dan layanan nasabah. Terbiasa bekerja dalam tim, mendukung kegiatan event
              perusahaan, serta mengelola konten digital untuk kebutuhan pemasaran. Memiliki minat besar untuk
              berkarier di industri perbankan dan layanan digital.
            </p>

            <div className="stats stats--dark">
              {STATS.map(s => (
                <div key={s.label}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>

            <div className="about__actions">
              <a
                href="https://linkedin.com/in/agungsaeful"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--light"
              >
                Profil LinkedIn ↗
              </a>
              <a href="#certification" className="btn btn--outline-light">Lihat Sertifikasi ↓</a>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Strip */}
      <div className="container tools-block reveal" ref={toolsRef}>
        <div className="section-center-head">
          <p className="eyebrow">My Tools</p>
          <h3 className="section-heading">
            Perangkat <span className="text-grad">Kerja & Desain</span>
          </h3>
        </div>
        <div className="tools__grid">
          {TOOLS.map(t => (
            <div className="tool-pill" key={t.code}>
              <div className="tool-pill__icon" aria-hidden="true">{t.code}</div>
              <strong>{t.name}</strong>
              <span>{t.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Academic & Experience Cards */}
      <div className="container journey reveal" ref={journeyRef}>
        <div className="section-center-head">
          <p className="eyebrow">Education & Experience</p>
          <h3 className="section-heading">
            Pendidikan & <span className="text-grad">Pengalaman Kerja</span>
          </h3>
        </div>
        <div className="journey__grid">
          <div className="journey-card">
            <div className="journey-card__head">
              <span className="journey-card__icon" aria-hidden="true">🎓</span>
              <h4>Education</h4>
            </div>
            <ul className="journey-card__list">
              {EDUCATION.map(item => (
                <li key={item.title}>
                  <span className="journey-card__period">{item.period}</span>
                  <h5>{item.title}</h5>
                  <p>{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="journey-card">
            <div className="journey-card__head">
              <span className="journey-card__icon" aria-hidden="true">💼</span>
              <h4>Work Experience</h4>
            </div>
            <ul className="journey-card__list">
              {EXPERIENCE.map(item => (
                <li key={item.title}>
                  <span className="journey-card__period">{item.period}</span>
                  <h5>{item.title}</h5>
                  <p>{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div id="certification">
        <CertSwitcher items={CERTS} onOpenImage={onOpenImage} />
      </div>
    </section>
  );
}
