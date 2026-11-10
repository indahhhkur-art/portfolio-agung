import { memo, useMemo } from "react";
import { CATEGORY_LABEL, FILTERS, IMG, PROJECTS } from "../data.js";
import { useRevealCard, useRevealGroup } from "../hooks.js";
import Picture, { toWebpSrc } from "./Picture.jsx";

const ProjectCard = memo(function ProjectCard({ project, index, filter, onOpen, onPrefetch }) {
  const cardRef = useRevealCard((index % 4) * 70, filter);

  return (
    <button
      ref={cardRef}
      type="button"
      className="card"
      data-reveal-item
      onPointerEnter={onPrefetch}
      onFocus={onPrefetch}
      onClick={() => onOpen(project)}
    >
      <div className="card__media">
        <Picture
          src={`${IMG}${project.cover}`}
          webpSrc={toWebpSrc(project.cover, "thumbs/")}
          alt={`Cover proyek ${project.title}`}
          width={400}
          height={300}
          loading="lazy"
          decoding="async"
        />
        <span className="card__cat">{CATEGORY_LABEL[project.category]}</span>
        <span className="card__count">{project.images.length} karya</span>
      </div>
      <div className="card__body">
        <div className="tags">
          {project.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <div className="card__row">
          <div className="card__copy">
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
          </div>
          <span className="card__arrow" aria-hidden="true">↗</span>
        </div>
      </div>
    </button>
  );
});

function Portfolio({ filter, onFilterChange, onOpenProject, onPrefetchModal }) {
  const headRef = useRevealGroup(80);

  const counts = useMemo(() => {
    const map = { all: PROJECTS.length };
    PROJECTS.forEach(p => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return map;
  }, []);

  const visible = useMemo(
    () => PROJECTS.filter(p => filter === "all" || p.category === filter),
    [filter]
  );

  return (
    <section className="work" id="portfolio">
      <div className="container">
        <div ref={headRef}>
          <div className="section-split" data-reveal-item>
            <div>
              <p className="eyebrow">Portfolio</p>
              <h2 className="section-heading">
                Karya <span className="text-grad">Pilihan</span>
              </h2>
              <p className="section-sub">Klik proyek untuk melihat seluruh karya dan detail pekerjaannya.</p>
            </div>
            <span className="work__total">{visible.length} Proyek Ditampilkan</span>
          </div>

          <div className="filters" role="tablist" aria-label="Filter kategori" data-reveal-item>
            {FILTERS.map(f => (
              <button
                key={f.key}
                role="tab"
                aria-selected={filter === f.key}
                className={`chip${filter === f.key ? " is-active" : ""}`}
                onClick={() => onFilterChange(f.key)}
              >
                {f.label} <span className="chip__num">{counts[f.key] || 0}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="cards">
          {visible.map((p, idx) => (
            <ProjectCard
              key={p.id}
              project={p}
              index={idx}
              filter={filter}
              onOpen={onOpenProject}
              onPrefetch={onPrefetchModal}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Portfolio);
