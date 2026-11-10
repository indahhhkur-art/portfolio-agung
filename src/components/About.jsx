import { CERTS, IMG } from "../data.js";
import { useReveal } from "../hooks.js";
import CertSwitcher from "./CertSwitcher.jsx";

const EDUCATION = [
  { school: "STMIK IKMI Cirebon", detail: "Sarjana (S1), Teknik Informatika" },
  {
    school: "California Institute of the Arts",
    detail: "Kursus online Graphic Design, program sertifikat 20 minggu / 70 jam bersama Coursera."
  }
];

const STATS = [
  { value: "5+", label: "Tahun pengalaman" },
  { value: "12+", label: "Klien & proyek" },
  { value: CERTS.length, label: "Sertifikasi" }
];

export default function About({ onOpenImage }) {
  const photoRef = useReveal();
  const textRef = useReveal();

  return (
    <section className="about" id="about">
      <div className="container about__inner">
        <div className="about__photo reveal" ref={photoRef}>
          <img src={`${IMG}agung-photo.jpg`} alt="Foto Agung Saeful" loading="lazy" decoding="async" />
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

          <ul className="edu">
            {EDUCATION.map(e => (
              <li key={e.school}>
                <span className="edu__icon" aria-hidden="true">🎓</span>
                <div>
                  <h3>{e.school}</h3>
                  <p>{e.detail}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="stats">
            {STATS.map(s => (
              <div key={s.label}><strong>{s.value}</strong><span>{s.label}</span></div>
            ))}
          </div>
        </div>
      </div>

      <CertSwitcher items={CERTS} onOpenImage={onOpenImage} />
    </section>
  );
}
