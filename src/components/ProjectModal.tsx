import { memo, useEffect, useRef, useState } from "react";
import { CATEGORY_LABEL, IMG } from "../data.ts";
import { useFocusTrap } from "../hooks.ts";
import type { LightboxItem, Project } from "../types.ts";

interface ProjectModalProps {
  project: Project;
  projectIndex?: number;
  projectTotal?: number;
  closing: boolean;
  onClose: () => void;
  onStepProject?: (dir: number) => void;
  onOpenImage: (items: LightboxItem[], index: number) => void;
}

function ProjectModal({
  project,
  projectIndex = 0,
  projectTotal = 1,
  closing,
  onClose,
  onStepProject,
  onOpenImage
}: ProjectModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [failedSrcs, setFailedSrcs] = useState<Record<string, boolean>>({});
  const [retryMap, setRetryMap] = useState<Record<string, number>>({});

  useFocusTrap(modalRef, !closing);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => prev?.focus?.();
  }, []);

  useEffect(() => {
    setFailedSrcs({});
    setRetryMap({});
    if (panelRef.current) panelRef.current.scrollTop = 0;
  }, [project.id]);

  const items: LightboxItem[] = project.images.map((src, i) => ({
    src,
    label: `${project.title} — ${i + 1}`
  }));

  return (
    <div
      ref={modalRef}
      className={`modal ${closing ? "is-closing" : "is-open"}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__panel" ref={panelRef}>
        <button className="icon-btn modal__close" ref={closeRef} onClick={onClose} aria-label="Tutup">✕</button>
        <div className="modal__head">
          <div className="modal__meta-top">
            <p className="eyebrow">{CATEGORY_LABEL[project.category]}</p>
            <span className="modal__badge">{items.length} Karya Desain</span>
          </div>
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
          {items.map((it, i) => {
            const hasError = Boolean(failedSrcs[it.src]);
            const attempt = retryMap[it.src] || 0;
            const srcUrl = attempt ? `${IMG}${it.src}?retry=${attempt}` : `${IMG}${it.src}`;
            if (hasError) {
              return (
                <div key={it.src} className="gallery__fallback" role="group" aria-label={`Gagal memuat ${it.label}`}>
                  <span>Gagal memuat gambar</span>
                  <button
                    type="button"
                    className="gallery__retry"
                    onClick={() => {
                      setFailedSrcs(prev => ({ ...prev, [it.src]: false }));
                      setRetryMap(prev => ({ ...prev, [it.src]: attempt + 1 }));
                    }}
                  >
                    ↻ Muat Ulang
                  </button>
                </div>
              );
            }
            return (
              <button
                key={it.src}
                type="button"
                aria-label={`Perbesar ${it.label}`}
                onClick={() => onOpenImage(items, i)}
              >
                <img
                  ref={el => {
                    if (el?.complete && el.naturalWidth > 0) {
                      el.classList.add("is-loaded");
                      el.parentElement?.classList.add("is-img-ready");
                    }
                  }}
                  src={srcUrl}
                  alt={it.label}
                  loading="eager"
                  decoding="async"
                  onLoad={e => {
                    e.currentTarget.classList.add("is-loaded");
                    e.currentTarget.parentElement?.classList.add("is-img-ready");
                  }}
                  onError={e => {
                    e.currentTarget.parentElement?.classList.add("is-img-ready");
                    setFailedSrcs(prev => ({ ...prev, [it.src]: true }));
                  }}
                />
              </button>
            );
          })}
        </div>
        {projectTotal > 1 && onStepProject && (
          <div className="modal__pager">
            <button type="button" className="modal__pager-btn" onClick={() => onStepProject(-1)}>
              ← Proyek Sebelumnya
            </button>
            <span className="modal__pager-pos">{projectIndex + 1} / {projectTotal}</span>
            <button type="button" className="modal__pager-btn" onClick={() => onStepProject(1)}>
              Proyek Berikutnya →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(ProjectModal);
