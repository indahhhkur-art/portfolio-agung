import { CERTS, IMG } from "../data.js";
import { useReveal } from "../hooks.js";

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
  const certRef = useReveal();

  return (
    <section className="about" id="about">
      <div className="container about__inner">
        <div className="about__photo reveal" ref={photoRef}>
          <img src={`${IMG}agung-photo.jpg`} alt="Foto Agung Saeful" loading="lazy" />
        </div>
        <div className="about__text reveal" ref={textRef}>
          <p className="eyebrow">About</p>
          <h2>AGUNG SAEFUL</h2>
          <p className="about__lead">
            Graphic Designer yang menguasai pembuatan logo, materi pemasaran, dan pemasaran digital.
            Berpengalaman bekerja sebagai desainer grafis selama lebih dari 5 tahun.
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

      <div className="container certs reveal" ref={certRef}>
        <h3 className="certs__title">Certification</h3>
        <div className="certs__grid">
          {CERTS.map((c, i) => (
            <button
              key={c.src}
              type="button"
              className="cert"
              aria-label={`Lihat ${c.label}`}
              onClick={() => onOpenImage(CERTS, i)}
            >
              <img src={`${IMG}${c.src}`} alt={c.label} loading="lazy" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
