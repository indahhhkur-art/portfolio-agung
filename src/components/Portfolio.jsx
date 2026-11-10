import { memo, useMemo } from "react";
import { CATEGORY_LABEL, FILTERS, IMG, PROJECTS } from "../data.js";
import { useReveal } from "../hooks.js";
import Picture, { toWebpSrc } from "./Picture.jsx";

function Portfolio({ filter, onFilterChange, onOpenProject }) {
  const headRef = useReveal();
  const filterRef = useReveal();

  const visible = useMemo(
    () => PROJECTS.filter(p => filter === "all" || p.category === filter),
    [filter]
  );

  return (
    <section className="work" id="portfolio">
      <div className="container">
        <div className="section-split reveal" ref={headRef}>
          <div>
            <p className="eyebrow">Portfolio</p>
            <h2 className="section-heading">
              Karya <span className="text-grad">Pilihan</span>
            </h2>
            <p className="section-sub">Klik proyek untuk melihat seluruh karya dan detail pekerjaannya.</p>
          </div>
          <span className="work__total">{visible.length} Proyek Ditampilkan</span>
        </div>

        <div className="filters reveal" ref={filterRef} role="tablist" aria-label="Filter kategori">
          {FILTERS.map(f => (
            <button
              key={f.key}
              role="tab"
              aria-selected={filter === f.key}
              className={`chip${filter === f.key ? " is-active" : ""}`}
              onClick={() => onFilterChange(f.key)}
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
                <Picture
                  src={`${IMG}${p.cover}`}
                  webpSrc={toWebpSrc(p.cover, "thumbs/")}
                  alt={`Cover proyek ${p.title}`}
                  width={400}
                  height={300}
                  loading="lazy"
                  decoding="async"
                />
                <span className="card__cat">{CATEGORY_LABEL[p.category]}</span>
                <span className="card__count">{p.images.length} karya</span>
              </div>
              <div className="card__body">
                <div className="tags">
                  {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
                <div className="card__row">
                  <div className="card__copy">
                    <h3>{p.title}</h3>
                    <p>{p.summary}</p>
                  </div>
                  <span className="card__arrow" aria-hidden="true">↗</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Portfolio);
