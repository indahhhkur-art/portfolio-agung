import { memo, useEffect, useRef, useState } from "react";
import { NAV_ITEMS } from "../data.ts";
import { useScrollSpy } from "../hooks.ts";

const IDS = NAV_ITEMS.map(n => n.id);

function Navbar() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const { active, scrolled } = useScrollSpy(IDS);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (headerRef.current && e.target instanceof Node && !headerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <header ref={headerRef} className={`nav${scrolled ? " is-scrolled" : ""}`}>
      <div className="container nav__inner">
        <a
          href="#home"
          className="nav__brand"
          aria-label="Agung Saeful — Kembali ke beranda"
        >
          Agung Saeful
        </a>
        <button
          ref={toggleRef}
          className="nav__toggle"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          <span /><span />
        </button>
        <nav className={`nav__links${open ? " is-open" : ""}`} aria-label="Navigasi utama">
          {NAV_ITEMS.map(n => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={active === n.id ? "is-active" : ""}
              aria-current={active === n.id ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {n.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default memo(Navbar);
