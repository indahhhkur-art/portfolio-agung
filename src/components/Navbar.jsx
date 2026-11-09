import { useState } from "react";
import { NAV_ITEMS } from "../data.js";
import { useScrollSpy } from "../hooks.js";

const IDS = NAV_ITEMS.map(n => n.id);

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(IDS);

  return (
    <header className="nav">
      <div className="container nav__inner">
        <a href="#home" className="nav__brand">Agung saeful</a>
        <button
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
