import { memo } from "react";
import { CONTACT, MICROSTOCK_LINKS } from "../data.ts";
import { useRevealGroup } from "../hooks.ts";
import type { ContactConfig } from "../types.ts";

interface ContactLinkItem {
  key: keyof ContactConfig;
  label: string;
  href: (v: string) => string;
}

const LINKS: ContactLinkItem[] = (
  [
    { key: "email", label: "✉ Email", href: (v: string) => `mailto:${v}` },
    { key: "whatsapp", label: "WhatsApp", href: (v: string) => `https://wa.me/${v}` },
    { key: "instagram", label: "Instagram", href: (v: string) => `https://instagram.com/${v}` },
    { key: "behance", label: "Behance", href: (v: string) => v }
  ] satisfies ContactLinkItem[]
).filter(l => Boolean(CONTACT[l.key]));

function Contact() {
  const ref = useRevealGroup(55);
  return (
    <section className="contact" id="contact">
      <div className="container contact__inner" ref={ref}>
        <h2 data-reveal-item>THANKS</h2>
        <p data-reveal-item>Tertarik bekerja sama atau punya proyek desain? Mari ngobrol.</p>
        <div className="contact__links" data-reveal-item>
          {LINKS.map(l => (
            <a key={l.key} href={l.href(CONTACT[l.key])} target="_blank" rel="noopener noreferrer">{l.label}</a>
          ))}
          <a
            href="https://linkedin.com/in/agungsaeful"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn — Agung Saeful ↗
          </a>
        </div>
        <p className="contact__note" data-reveal-item>
          Karya microstock dengan nama pena <strong>Hani Suwaryo</strong> juga tersedia di:
        </p>
        <div className="contact__microstock" data-reveal-item>
          {MICROSTOCK_LINKS.map(m => (
            <a key={m.name} href={m.url} target="_blank" rel="noopener noreferrer">
              {m.name} ↗
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Contact);
