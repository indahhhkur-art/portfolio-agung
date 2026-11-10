import { memo } from "react";
import { CERTS, EDUCATION_LIST, EXPERIENCE_LIST, IMG, KEY_SKILLS, TOOLS } from "../data.js";
import { useReveal } from "../hooks.js";
import CertSwitcher from "./CertSwitcher.jsx";
import Picture, { toWebpSrc } from "./Picture.jsx";

const STATS = [
  { value: "5+", label: "Tahun pengalaman" },
  { value: "12+", label: "Klien & proyek" },
  { value: CERTS.length, label: "Sertifikasi" }
];

function About({ onOpenImage }) {
  const photoRef = useReveal();
  const textRef = useReveal();
  const toolsRef = useReveal();
  const journeyRef = useReveal();

  return (
    <section className="about" id="about">
      <div className="container about__inner">
        <div className="about__photo reveal" ref={photoRef}>
          <Picture
            src={`${IMG}agung-photo.jpg`}
            webpSrc={toWebpSrc("agung-photo.jpg")}
            alt="Foto Agung Saeful"
            width={1140}
            height={1311}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="about__text reveal" ref={textRef}>
          <p className="eyebrow">About</p>
          <h2>
            <a
              href="https://linkedin.com/in/agungsaeful"
              target="_blank"
              rel="noopener noreferrer"
              className="about__name-link"
              title="Kunjungi profil LinkedIn Agung Saeful"
            >
              AGUNG SAEFUL
            </a>
          </h2>
          <p className="about__lead">
            Lulusan Teknologi Informasi dengan pengalaman magang di Bank Syariah Indonesia pada bidang
            operasional, administrasi, dan layanan nasabah. Terbiasa bekerja dalam tim, mendukung kegiatan event
            perusahaan, serta mengelola konten digital untuk kebutuhan pemasaran. Memiliki minat besar untuk
            berkarier di industri perbankan dan layanan digital.
          </p>

          <div className="stats">
            {STATS.map(s => (
              <div key={s.label}><strong>{s.value}</strong><span>{s.label}</span></div>
            ))}
          </div>
        </div>
      </div>

      {/* Perangkat Kerja & Desain */}
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

      {/* Pendidikan & Pengalaman Kerja */}
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
              {EDUCATION_LIST.map(item => (
                <li key={item.title}>
                  <span className="journey-card__period">{item.period}</span>
                  <h5>{item.title}</h5>
                  <p>{item.detail}</p>
                </li>
              ))}
            </ul>
            <div className="journey-skills">
              <span className="journey-skills__label">Key Skills</span>
              <div className="journey-skills__tags">
                {KEY_SKILLS.map(skill => (
                  <span key={skill} className="skill-chip">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="journey-card">
            <div className="journey-card__head">
              <span className="journey-card__icon" aria-hidden="true">💼</span>
              <h4>Work Experience</h4>
            </div>
            <ul className="journey-card__list">
              {EXPERIENCE_LIST.map(item => (
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

      <CertSwitcher items={CERTS} onOpenImage={onOpenImage} />
    </section>
  );
}

export default memo(About);
