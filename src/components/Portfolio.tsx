import { memo, useMemo, useRef } from "react";
import { CATEGORY_LABEL, FILTERS, IMG, PROJECTS } from "../data.ts";
import { useRevealCard, useRevealGroup } from "../hooks.ts";
import type { FilterKey, Project } from "../types.ts";
import Picture, { toWebpSrc } from "./Picture.tsx";

interface ProjectCardProps {
  project: Project;
  index: number;
  filter: FilterKey;
  onOpen: (project: Project) => void;
  onPrefetch: () => void;
}

const ProjectCard = memo(function ProjectCard({
  project,
  index,
  filter,
  onOpen,
  onPrefetch
}: ProjectCardProps) {
  const cardRef = useRevealCard<HTMLButtonElement>((index % 4) * 40, filter);

  return (
    <button
      ref={cardRef}
      type="button"
      className="card"
      data-reveal-item
      onPointerEnter={onPrefetch}
      onTouchStart={onPrefetch}
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

interface PortfolioProps {
  filter: FilterKey;
  onFilterChange: (next: FilterKey) => void;
  onOpenProject: (project: Project) => void;
  onPrefetchModal: () => void;
}

function Portfolio({ filter, onFilterChange, onOpenProject, onPrefetchModal }: PortfolioProps) {
  const headRef = useRevealGroup<HTMLDivElement>(45);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: PROJECTS.length };
    for (const p of PROJECTS) {
      map[p.category] = (map[p.category] || 0) + 1;
    }
    return map;
  }, []);

  const visible = useMemo(
    () => PROJECTS.filter(p => filter === "all" || p.category === filter),
    [filter]
  );

  const onTabKeyDown = (idx: number, e: React.KeyboardEvent<HTMLButtonElement>) => {
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (idx + 1) % FILTERS.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + FILTERS.length) % FILTERS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = FILTERS.length - 1;
    if (next !== null) {
      e.preventDefault();
      onFilterChange(FILTERS[next].key);
      tabRefs.current[next]?.focus();
    }
  };

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
            <span className="work__total" aria-live="polite">{visible.length} Proyek Ditampilkan</span>
          </div>

          <div className="filters" role="tablist" aria-label="Filter kategori" data-reveal-item>
            {FILTERS.map((f, idx) => (
              <button
                key={f.key}
                ref={el => { tabRefs.current[idx] = el; }}
                role="tab"
                aria-selected={filter === f.key}
                tabIndex={filter === f.key ? 0 : -1}
                className={`chip${filter === f.key ? " is-active" : ""}`}
                onClick={() => onFilterChange(f.key)}
                onKeyDown={e => onTabKeyDown(idx, e)}
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
