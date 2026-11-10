import { memo } from "react";
import { CERTS, EDUCATION_LIST, EXPERIENCE_LIST, IMG, KEY_SKILLS, TOOLS } from "../data.js";
import { useCountUp, useJourneyReveal, useReveal, useRevealGroup } from "../hooks.js";
import CertSwitcher from "./CertSwitcher.jsx";
import ToolIcon from "./ToolIcons.jsx";

const STATS = [
  { value: "5+", label: "Tahun pengalaman" },
  { value: "12+", label: "Klien & proyek" },
  { value: String(CERTS.length), label: "Sertifikasi" }
];

function StatCounter({ value, label }) {
  const { ref, display } = useCountUp(value, 1400);
  return (
    <div>
      <strong ref={ref}>{display}</strong>
      <span>{label}</span>
    </div>
  );
}

function About({ onOpenImage, onPrefetchLightbox }) {
  const photoRef = useReveal();
  const textRef = useRevealGroup(85);
  const toolsRef = useRevealGroup(65);
  const journeyHeadRef = useRevealGroup(80);
  const eduCardRef = useJourneyReveal(1750);
  const expCardRef = useJourneyReveal(1850);

  return (
    <section className="about" id="about">
      <div className="container about__inner">
        <div className="about__photo reveal" ref={photoRef}>
          <img
            src={`${IMG}agung-photo.webp`}
            alt="Foto Agung Saeful"
            width={960}
            height={1104}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="about__text" ref={textRef}>
          <p className="eyebrow" data-reveal-item>About</p>
          <h2 data-reveal-item>
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
          <p className="about__lead" data-reveal-item>
            Lulusan Teknologi Informasi dengan pengalaman magang di Bank Syariah Indonesia pada bidang
            operasional, administrasi, dan layanan nasabah. Terbiasa bekerja dalam tim, mendukung kegiatan event
            perusahaan, serta mengelola konten digital untuk kebutuhan pemasaran. Memiliki minat besar untuk
            berkarier di industri perbankan dan layanan digital.
          </p>

          <div className="stats" data-reveal-item>
            {STATS.map(s => (
              <StatCounter key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </div>

      {/* Perangkat Kerja & Desain */}
      <div className="container tools-block" ref={toolsRef}>
        <div className="section-center-head" data-reveal-item>
          <p className="eyebrow">My Tools</p>
          <h3 className="section-heading">
            Perangkat <span className="text-grad">Kerja & Desain</span>
          </h3>
        </div>
        <div className="tools__grid">
          {TOOLS.map(t => (
            <div className="tool-pill" key={t.code} data-reveal-item>
              <div className="tool-pill__icon" aria-hidden="true">
                <ToolIcon code={t.code} />
              </div>
              <strong>{t.name}</strong>
              <span>{t.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pendidikan & Pengalaman Kerja */}
      <div className="container journey">
        <div className="section-center-head" ref={journeyHeadRef} data-reveal-item>
          <p className="eyebrow">Education & Experience</p>
          <h3 className="section-heading">
            Pendidikan & <span className="text-grad">Pengalaman Kerja</span>
          </h3>
        </div>
        <div className="journey__grid">
          <div className="journey-card journey-card--left" ref={eduCardRef}>
            <div className="journey-card__head">
              <span className="journey-card__icon" aria-hidden="true">🎓</span>
              <h4>Education</h4>
            </div>
            <ul className="journey-card__list">
              {EDUCATION_LIST.map((item, idx) => (
                <li key={item.title} style={{ "--item-i": idx }}>
                  <span className="journey-card__period">{item.period}</span>
                  <h5>{item.title}</h5>
                  <p>{item.detail}</p>
                </li>
              ))}
            </ul>
            <div className="journey-skills">
              <span className="journey-skills__label">Key Skills</span>
              <div className="journey-skills__tags">
                {KEY_SKILLS.map((skill, idx) => (
                  <span key={skill} className="skill-chip" style={{ "--chip-i": idx }}>{skill}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="journey-card journey-card--right" ref={expCardRef}>
            <div className="journey-card__head">
              <span className="journey-card__icon" aria-hidden="true">💼</span>
              <h4>Work Experience</h4>
            </div>
            <ul className="journey-card__list">
              {EXPERIENCE_LIST.map((item, idx) => (
                <li key={item.title} style={{ "--item-i": idx }}>
                  <span className="journey-card__period">{item.period}</span>
                  <h5>{item.title}</h5>
                  <p>{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <CertSwitcher items={CERTS} onOpenImage={onOpenImage} onPrefetch={onPrefetchLightbox} />
    </section>
  );
}

export default memo(About);
