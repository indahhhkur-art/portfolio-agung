import { memo, useEffect, useRef, useState } from "react";
import { NAV_ITEMS } from "../data.js";
import { useScrollSpy } from "../hooks.js";

const IDS = NAV_ITEMS.map(n => n.id);

function Navbar() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const { active, scrolled } = useScrollSpy(IDS);

  useEffect(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`nav${scrolled ? " is-scrolled" : ""}`}>
      <div className="container nav__inner">
        <a
          href="https://linkedin.com/in/agungsaeful"
          target="_blank"
          rel="noopener noreferrer"
          className="nav__brand"
          title="Kunjungi profil LinkedIn Agung Saeful"
        >
          Agung saeful
        </a>
        <button
          ref={toggleRef}
          className="nav__toggle"
          aria-label="Buka menu"
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          <span /><span />
        </button>
        <nav className={`nav__links${open ? " is-open" : ""}`}>
          {NAV_ITEMS.map(n => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={active === n.id ? "is-active" : ""}
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
