import { memo } from "react";
import { CONTACT } from "../data.js";
import { useReveal } from "../hooks.js";

const LINKS = [
  { key: "email", label: "✉ Email", href: v => `mailto:${v}` },
  { key: "whatsapp", label: "WhatsApp", href: v => `https://wa.me/${v}` },
  { key: "instagram", label: "Instagram", href: v => `https://instagram.com/${v}` },
  { key: "behance", label: "Behance", href: v => v },
  { key: "dribbble", label: "Dribbble", href: v => v }
].filter(l => CONTACT[l.key]);

function Contact() {
  const ref = useReveal();
  return (
    <section className="contact" id="contact">
      <div className="container contact__inner reveal" ref={ref}>
        <h2>THANKS</h2>
        <p>Tertarik bekerja sama atau punya proyek desain? Mari ngobrol.</p>
        {LINKS.length > 0 && (
          <div className="contact__links">
            {LINKS.map(l => (
              <a key={l.key} href={l.href(CONTACT[l.key])} target="_blank" rel="noopener noreferrer">{l.label}</a>
            ))}
          </div>
        )}
        <p className="contact__note">
          Karya microstock tersedia di Adobe Stock, Shutterstock, PNGtree, dan Dribbble dengan nama pena{" "}
          <strong>Hani Suwaryo</strong>.
        </p>
      </div>
    </section>
  );
}

export default memo(Contact);
