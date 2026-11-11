import { memo, useEffect, useRef } from "react";
import { CERTS, EDUCATION_LIST, EXPERIENCE_LIST, IMG, KEY_SKILLS, TOOLS } from "../data.ts";
import { useCountUp, useJourneyReveal, useReveal, useRevealGroup } from "../hooks.ts";
import { isSaveData } from "../prefetch.ts";
import type { LightboxItem } from "../types.ts";
import CertSwitcher from "./CertSwitcher.tsx";
import ToolIcon from "./ToolIcons.tsx";

const STATS = [
  { value: "5+", label: "Tahun pengalaman" },
  { value: "12+", label: "Klien & proyek" },
  { value: String(CERTS.length), label: "Sertifikasi" }
];

function StatCounter({ value, label }: { value: string; label: string }) {
  const { ref, display } = useCountUp<HTMLElement>(value, 950);
  return (
    <div>
      <strong ref={ref}>{display}</strong>
      <span>{label}</span>
    </div>
  );
}

interface AboutProps {
  onOpenImage: (items: LightboxItem[], index: number) => void;
  onPrefetchLightbox: () => void;
}

function About({ onOpenImage, onPrefetchLightbox }: AboutProps) {
  const photoRef = useReveal<HTMLDivElement>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const textRef = useRevealGroup<HTMLDivElement>(50);
  const toolsRef = useRevealGroup<HTMLDivElement>(45);
  const journeyHeadRef = useRevealGroup<HTMLDivElement>(45);
  const eduCardRef = useJourneyReveal<HTMLDivElement>(940);
  const expCardRef = useJourneyReveal<HTMLDivElement>(1020);

  // Lazy load & playback video About hanya saat mendekati viewport & tab aktif (hemat bandwidth & baterai)
  useEffect(() => {
    const wrap = photoRef.current;
    const vid = videoRef.current;
    if (!wrap || !vid || isSaveData() || typeof IntersectionObserver === "undefined") return;

    let visible = false;
    const syncPlayback = () => {
      if (visible && !document.hidden) {
        vid.defaultMuted = true;
        vid.muted = true;
        if (vid.paused) void vid.play().catch(() => {});
      } else if (!vid.paused) {
        vid.pause();
      }
    };

    const io = new IntersectionObserver(
      entries => {
        for (const en of entries) visible = en.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.18 }
    );
    io.observe(wrap);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, [photoRef]);

  return (
    <section className="about" id="about">
      <div className="container about__inner">
        <div className="about__photo reveal" ref={photoRef}>
          <video
            ref={videoRef}
            poster={`${IMG}agung-about-poster.webp`}
            width={760}
            height={600}
            muted
            loop
            playsInline
            preload="none"
            aria-label="Video perkenalan Agung Saeful dengan latar grafis desain"
          >
            <source src={`${import.meta.env.BASE_URL}video/about.webm`} type="video/webm" />
            <source src={`${import.meta.env.BASE_URL}video/about.mp4`} type="video/mp4" />
          </video>
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

          <div className="journey-card journey-card--right" ref={expCardRef}>
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

      <CertSwitcher items={CERTS} onOpenImage={onOpenImage} onPrefetch={onPrefetchLightbox} />
    </section>
  );
}

export default memo(About);
