import { CONTACT } from "../data.js";
import { useReveal } from "../hooks.js";

const LINKS = [
  { key: "email", label: "✉ Email", href: v => `mailto:${v}` },
  { key: "whatsapp", label: "WhatsApp", href: v => `https://wa.me/${v}` },
  { key: "instagram", label: "Instagram", href: v => `https://instagram.com/${v}` },
  { key: "behance", label: "Behance", href: v => v },
  { key: "dribbble", label: "Dribbble", href: v => v }
].filter(l => CONTACT[l.key]);

export default function Contact() {
  const ref = useReveal();
  return (
    <section className="contact-sec" id="contact">
      <div className="container">
        <div className="contact-card reveal" ref={ref}>
          <div className="contact-card__info">
            <p className="eyebrow">Contact</p>
            <h2>
              Mari Terhubung untuk <span className="text-grad">Proyek Berikutnya</span>
            </h2>
            <p className="contact-card__desc">
              Terbuka untuk kesempatan karier di industri perbankan & layanan digital, maupun kolaborasi desain grafis dan kampanye brand.
            </p>
            <ul className="contact-card__meta">
              <li>
                <span className="meta-dot" aria-hidden="true">in</span>
                <div>
                  <strong>LinkedIn</strong>
                  <a href="https://linkedin.com/in/agungsaeful" target="_blank" rel="noopener noreferrer">
                    linkedin.com/in/agungsaeful ↗
                  </a>
                </div>
              </li>
              <li>
                <span className="meta-dot" aria-hidden="true">🎨</span>
                <div>
                  <strong>Microstock Contributor</strong>
                  <span>Adobe Stock, Shutterstock, PNGtree & Dribbble — <b>Hani Suwaryo</b></span>
                </div>
              </li>
            </ul>
          </div>

          <div className="contact-card__cta">
            <span className="contact-card__badge">Open to Collaborate</span>
            <h3>THANKS FOR VISITING</h3>
            <p>Kunjungi profil LinkedIn untuk informasi lengkap, CV, dan diskusi langsung.</p>
            <div className="contact__links">
              <a
                href="https://linkedin.com/in/agungsaeful"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-white"
              >
                Hubungi di LinkedIn ↗
              </a>
              <a href="#portfolio" className="btn-outline-white">
                Jelajahi Portfolio ↑
              </a>
              {LINKS.map(l => (
                <a key={l.key} href={l.href(CONTACT[l.key])} target="_blank" rel="noopener noreferrer" className="btn-outline-white">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
