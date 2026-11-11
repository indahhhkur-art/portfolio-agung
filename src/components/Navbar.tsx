import { memo, useEffect, useRef, useState } from "react";
import { NAV_ITEMS } from "../data.ts";
import { useScrollSpy, useTheme } from "../hooks.ts";

const IDS = NAV_ITEMS.map(n => n.id);

function Navbar() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const { active, scrolled } = useScrollSpy(IDS);
  const { theme, toggleTheme } = useTheme();

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
          aria-label="Agung Saeful, kembali ke beranda"
        >
          Agung Saeful
        </a>
        <div className="nav__right">
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
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode malam"}
            title={theme === "dark" ? "Ganti ke Mode Terang" : "Ganti ke Mode Malam"}
            aria-pressed={theme === "dark"}
          >
            <svg className="theme-toggle__moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            <svg className="theme-toggle__sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          </button>
          <button
            ref={toggleRef}
            className="nav__toggle"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            onClick={() => setOpen(o => !o)}
          >
            <span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}

export default memo(Navbar);
