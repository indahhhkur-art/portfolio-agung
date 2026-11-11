import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CONTACT, MICROSTOCK_LINKS } from "../data.ts";
import { prefersReducedMotion, useRevealGroup } from "../hooks.ts";
import type { ContactConfig } from "../types.ts";

type OrbTarget = "tl" | "br" | "both";

interface ContactLinkItem {
  key: keyof ContactConfig;
  label: string;
  href: (v: string) => string;
}

interface SparkleSpec {
  id: number;
  zone: "tl" | "br";
  kind: "ring" | "dot" | "diamond";
  size: number;
}

const SPARKLES: SparkleSpec[] = [
  { id: 1, zone: "tl", kind: "diamond", size: 13 },
  { id: 2, zone: "tl", kind: "ring", size: 13 },
  { id: 3, zone: "tl", kind: "dot", size: 10 },
  { id: 4, zone: "tl", kind: "ring", size: 11 },
  { id: 5, zone: "tl", kind: "diamond", size: 12 },
  { id: 6, zone: "br", kind: "diamond", size: 12 },
  { id: 7, zone: "br", kind: "ring", size: 14 },
  { id: 8, zone: "br", kind: "diamond", size: 12 },
  { id: 9, zone: "br", kind: "ring", size: 13 },
  { id: 10, zone: "br", kind: "dot", size: 10 }
];

const MICROSTOCK_TARGET: Record<string, OrbTarget> = {
  "Adobe Stock": "br",
  "Shutterstock": "tl",
  "PNGtree": "br"
};

const LINKS: ContactLinkItem[] = (
  [
    { key: "email", label: "Email", href: (v: string) => `mailto:${v}` },
    { key: "whatsapp", label: "WhatsApp", href: (v: string) => `https://wa.me/${v}` },
    { key: "instagram", label: "Instagram", href: (v: string) => `https://instagram.com/${v}` },
    { key: "behance", label: "Behance", href: (v: string) => v }
  ] satisfies ContactLinkItem[]
).filter(l => Boolean(CONTACT[l.key]));

function SparkleShape({ spec }: { spec: SparkleSpec }) {
  if (spec.kind === "ring") {
    return (
      <svg viewBox="0 0 24 24" width={spec.size} height={spec.size}>
        <circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" strokeWidth="3" />
      </svg>
    );
  }
  if (spec.kind === "diamond") {
    return (
      <svg viewBox="0 0 24 24" width={spec.size} height={spec.size}>
        <polygon points="12,2 22,12 12,22 2,12" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width={spec.size} height={spec.size}>
      <circle cx="12" cy="12" r="8" fill="currentColor" />
    </svg>
  );
}

function Contact() {
  const revealRef = useRevealGroup<HTMLDivElement>(55);
  const secRef = useRef<HTMLElement | null>(null);
  const pointerRafRef = useRef(0);
  const burstTimerRef = useRef(0);

  const [inView, setInView] = useState(false);
  const [hoverTarget, setHoverTarget] = useState<OrbTarget | null>(null);
  const [bursting, setBursting] = useState(false);
  const [burstTarget, setBurstTarget] = useState<OrbTarget>("both");
  const [burstId, setBurstId] = useState(0);

  useEffect(() => {
    const sec = secRef.current;
    if (!sec || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      entries => {
        for (const en of entries) {
          setInView(en.isIntersecting);
        }
      },
      { threshold: 0.05 }
    );
    io.observe(sec);
    return () => {
      io.disconnect();
      if (pointerRafRef.current) window.cancelAnimationFrame(pointerRafRef.current);
      if (burstTimerRef.current) window.clearTimeout(burstTimerRef.current);
    };
  }, []);

  const triggerBurst = useCallback((target: OrbTarget) => {
    setBurstTarget(target);
    setBursting(true);
    setBurstId(id => id + 1);
    if (burstTimerRef.current) window.clearTimeout(burstTimerRef.current);
    burstTimerRef.current = window.setTimeout(() => setBursting(false), 920);
  }, []);

  const bindTarget = useCallback(
    (target: OrbTarget) => ({
      onClick: () => triggerBurst(target),
      onPointerEnter: () => setHoverTarget(target),
      onPointerLeave: () => setHoverTarget(prev => (prev === target ? null : prev)),
      onFocus: () => setHoverTarget(target),
      onBlur: () => setHoverTarget(prev => (prev === target ? null : prev))
    }),
    [triggerBurst]
  );

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const sec = secRef.current;
    if (!sec) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    if (pointerRafRef.current) return;
    pointerRafRef.current = window.requestAnimationFrame(() => {
      pointerRafRef.current = 0;
      const r = sec.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const nx = Math.max(-1, Math.min(1, ((clientX - r.left) / r.width) * 2 - 1));
      const ny = Math.max(-1, Math.min(1, ((clientY - r.top) / r.height) * 2 - 1));
      sec.style.setProperty("--px", nx.toFixed(3));
      sec.style.setProperty("--py", ny.toFixed(3));
    });
  }, []);

  const onPointerLeave = useCallback(() => {
    setHoverTarget(null);
    const sec = secRef.current;
    if (!sec) return;
    sec.style.setProperty("--px", "0");
    sec.style.setProperty("--py", "0");
  }, []);

  const tlEnergized = hoverTarget === "tl" || hoverTarget === "both";
  const brEnergized = hoverTarget === "br" || hoverTarget === "both";
  const tlBurst = bursting && (burstTarget === "tl" || burstTarget === "both");
  const brBurst = bursting && (burstTarget === "br" || burstTarget === "both");
  const showTlWaves = burstId > 0 && (burstTarget === "tl" || burstTarget === "both");
  const showBrWaves = burstId > 0 && (burstTarget === "br" || burstTarget === "both");

  const activeSparkles = useMemo(
    () => (burstTarget === "both" ? SPARKLES : SPARKLES.filter(sp => sp.zone === burstTarget)),
    [burstTarget]
  );

  const sectionClass = [
    "contact",
    inView ? "is-inview" : "",
    bursting && burstTarget === "both" ? "is-bursting-thanks" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      ref={secRef}
      className={sectionClass}
      id="contact"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {/* Layer Latar Interaktif: Bola Atas-Kiri (LinkedIn, Shutterstock) & Bawah-Kanan (Adobe Stock, PNGtree), Klik THANKS = Keduanya */}
      <div className="contact__stage" aria-hidden="true">
        <div
          className={`contact__orb-wrap contact__orb-wrap--tl${tlEnergized ? " is-energized" : ""}${tlBurst ? " is-bursting" : ""}`}
          {...bindTarget("tl")}
        >
          <div className="contact__orb contact__orb--tl">
            <span className="contact__orb-ring">
              <span className="contact__orb-sat" />
            </span>
            <span className="contact__orb-ring contact__orb-ring--outer" />
            {showTlWaves && (
              <span key={`w-tl-${burstId}`} className="contact__orb-waves">
                <span className="contact__orb-wave" />
                <span className="contact__orb-wave contact__orb-wave--delay" />
              </span>
            )}
          </div>
        </div>

        <div
          className={`contact__orb-wrap contact__orb-wrap--br${brEnergized ? " is-energized" : ""}${brBurst ? " is-bursting" : ""}`}
          {...bindTarget("br")}
        >
          <div className="contact__orb contact__orb--br">
            <span className="contact__orb-ring">
              <span className="contact__orb-sat" />
            </span>
            <span className="contact__orb-ring contact__orb-ring--outer" />
            {showBrWaves && (
              <span key={`w-br-${burstId}`} className="contact__orb-waves">
                <span className="contact__orb-wave" />
                <span className="contact__orb-wave contact__orb-wave--delay" />
              </span>
            )}
          </div>
        </div>

        {burstId > 0 && (
          <div key={`sp-${burstId}`} className="contact__sparkles">
            {activeSparkles.map(sp => (
              <span
                key={sp.id}
                className={`contact__sparkle contact__sparkle--${sp.id} contact__sparkle--${sp.kind}`}
              >
                <SparkleShape spec={sp} />
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="container contact__inner" ref={revealRef}>
        <h2 data-reveal-item>
          <button
            type="button"
            className="contact__thanks-btn"
            {...bindTarget("both")}
            aria-label="THANKS: Klik untuk menganimasikan bingkai"
            title="Klik untuk menganimasikan bingkai!"
          >
            THANKS
          </button>
        </h2>
        <p data-reveal-item>Tertarik bekerja sama atau punya proyek desain? Mari ngobrol.</p>
        <div className="contact__links" data-reveal-item>
          {LINKS.map(l => (
            <a key={l.key} href={l.href(CONTACT[l.key])} target="_blank" rel="noopener noreferrer" {...bindTarget("tl")}>
              {l.label}
            </a>
          ))}
          <a
            href="https://linkedin.com/in/agungsaeful"
            target="_blank"
            rel="noopener noreferrer"
            {...bindTarget("tl")}
          >
            LinkedIn: Agung Saeful ↗
          </a>
        </div>
        <p className="contact__note" data-reveal-item>
          Karya microstock dengan nama pena <strong>Hani Suwaryo</strong> juga tersedia di:
        </p>
        <div className="contact__microstock" data-reveal-item>
          {MICROSTOCK_LINKS.map(m => (
            <a
              key={m.name}
              href={m.url}
              target="_blank"
              rel="noopener noreferrer"
              {...bindTarget(MICROSTOCK_TARGET[m.name] ?? "br")}
            >
              {m.name} ↗
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Contact);
