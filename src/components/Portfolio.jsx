import { useState } from "react";
import { FILTERS, IMG, PROJECTS } from "../data.js";
import { useReveal } from "../hooks.js";

export default function Portfolio({ onOpenProject }) {
  const [filter, setFilter] = useState("all");
  const headRef = useReveal();
  const filterRef = useReveal();

  const visible = PROJECTS.filter(p => filter === "all" || p.category === filter);

  return (
    <section className="work" id="portfolio">
      <div className="container">
        <div className="section-head reveal" ref={headRef}>
          <p className="eyebrow">Portfolio</p>
          <h2>Karya Pilihan</h2>
          <p>Klik proyek untuk melihat seluruh karya dan detail pekerjaannya.</p>
        </div>

        <div className="filters reveal" ref={filterRef} role="tablist" aria-label="Filter kategori">
          {FILTERS.map(f => (
            <button
              key={f.key}
              role="tab"
              aria-selected={filter === f.key}
              className={`chip${filter === f.key ? " is-active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="cards" key={filter}>
          {visible.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              className="card card--enter"
              style={{ "--stagger": `${Math.min(idx, 8) * 35}ms` }}
              onClick={() => onOpenProject(p)}
            >
              <div className="card__media">
                <img
                  src={`${IMG}${p.cover}`}
                  alt={`Cover proyek ${p.title}`}
                  loading="lazy"
                  decoding="async"
                />
                <span className="card__count">{p.images.length} karya</span>
              </div>
              <div className="card__body">
                <h3>{p.title}</h3>
                <p>{p.summary}</p>
                <div className="tags">
                  {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
