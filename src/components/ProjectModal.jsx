import { useEffect, useRef } from "react";
import { CATEGORY_LABEL, IMG } from "../data.js";

export default function ProjectModal({ project, onClose, onOpenImage }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const prev = document.activeElement;
    closeRef.current?.focus();
    if (panelRef.current) panelRef.current.scrollTop = 0;
    return () => prev?.focus?.();
  }, [project.id]);

  const items = project.images.map((src, i) => ({ src, label: `${project.title} — ${i + 1}` }));

  return (
    <div className="modal is-open" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__panel" ref={panelRef}>
        <button className="icon-btn modal__close" ref={closeRef} onClick={onClose} aria-label="Tutup">✕</button>
        <div className="modal__head">
          <p className="eyebrow">{CATEGORY_LABEL[project.category]}</p>
          <h3 id="modalTitle">{project.title}</h3>
          <ul className="modal__bullets">
            {project.bullets.map(b => <li key={b}>{b}</li>)}
          </ul>
          <div className="tags">
            {project.tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
          {project.driveUrl && (
            <div className="modal__drive">
              <a
                href={project.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--drive"
              >
                <span aria-hidden="true">📁</span> Buka Folder di Google Drive ↗
              </a>
            </div>
          )}
        </div>
        <div className="gallery">
          {items.map((it, i) => (
            <button
              key={it.src}
              type="button"
              aria-label={`Perbesar ${it.label}`}
              onClick={() => onOpenImage(items, i)}
            >
              <img src={`${IMG}${it.src}`} alt={it.label} loading="lazy" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
