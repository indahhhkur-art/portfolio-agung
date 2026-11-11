import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar.tsx";
import Hero from "./components/Hero.tsx";
import About from "./components/About.tsx";
import Portfolio from "./components/Portfolio.tsx";
import SpecialtyRibbon from "./components/SpecialtyRibbon.tsx";
import Contact from "./components/Contact.tsx";
import ScrollUI from "./components/ScrollUI.tsx";
import { PROJECTS } from "./data.ts";
import { useAnimatedPresence, useBodyLock, useSmoothScroll } from "./hooks.ts";
import type { FilterKey, LightboxItem, Project } from "./types.ts";

const loadModal = () => import("./components/ProjectModal.tsx");
const loadLightbox = () => import("./components/Lightbox.tsx");

const ProjectModal = lazy(loadModal);
const Lightbox = lazy(loadLightbox);

export default function App() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [project, setProject] = useState<Project | null>(null);
  const [lightbox, setLightbox] = useState<{ items: LightboxItem[]; index: number } | null>(null);

  const modalPres = useAnimatedPresence(project, 160);
  const lbPres = useAnimatedPresence(lightbox, 150);
  const overlayOpen = Boolean(modalPres.rendered || lbPres.rendered);

  useBodyLock(overlayOpen);
  useSmoothScroll(overlayOpen);

  const visibleProjects = useMemo(
    () => PROJECTS.filter(p => filter === "all" || p.category === filter),
    [filter]
  );
  const activeProjectIdx = project ? visibleProjects.findIndex(p => p.id === project.id) : -1;

  const openImage = useCallback((items: LightboxItem[], index: number) => setLightbox({ items, index }), []);
  const closeImage = useCallback(() => setLightbox(null), []);
  const closeProject = useCallback(() => setProject(null), []);
  const stepProject = useCallback(
    (dir: number) => {
      if (!visibleProjects.length) return;
      setProject(curr => {
        const idx = curr ? visibleProjects.findIndex(p => p.id === curr.id) : 0;
        const safeIdx = idx === -1 ? 0 : idx;
        return visibleProjects[(safeIdx + dir + visibleProjects.length) % visibleProjects.length];
      });
    },
    [visibleProjects]
  );
  const stepImage = useCallback(
    (d: number) =>
      setLightbox(lb => (lb ? { ...lb, index: (lb.index + d + lb.items.length) % lb.items.length } : null)),
    []
  );

  // Pre-warm chunk modal & lightbox setelah load + idle panjang agar beban initial render 0 byte ekstra
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    let timer = 0;
    const warm = () => {
      loadModal();
      loadLightbox();
    };
    const schedule = () => {
      timer = globalThis.setTimeout(() => {
        if (typeof window.requestIdleCallback === "function") {
          window.requestIdleCallback(warm, { timeout: 2500 });
        } else {
          warm();
        }
      }, 2800);
    };
    if (document.readyState === "complete") {
      schedule();
    } else {
      window.addEventListener("load", schedule, { once: true });
    }
    return () => {
      if (timer) globalThis.clearTimeout(timer);
      window.removeEventListener("load", schedule);
    };
  }, []);

  // Esc menutup modal proyek (lightbox menangani Esc-nya sendiri)
  useEffect(() => {
    if (!project || lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProject(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, lightbox]);

  return (
    <>
      <a href="#main" className="skip-link">Lewati ke konten utama</a>
      <ScrollUI hidden={overlayOpen} />
      <Navbar />
      <main id="main">
        <Hero />
        <SpecialtyRibbon />
        <About onOpenImage={openImage} onPrefetchLightbox={loadLightbox} />
        <Portfolio
          filter={filter}
          onFilterChange={setFilter}
          onOpenProject={setProject}
          onPrefetchModal={loadModal}
        />
        <Contact />
      </main>

      <footer className="footer">
        <div className="container">
          <span>
            © {new Date().getFullYear()}{" "}
            <a
              href="https://linkedin.com/in/agungsaeful"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__author"
              title="Kunjungi profil LinkedIn Agung Saeful"
            >
              Agung Saeful
            </a>
            . All rights reserved.
          </span>
          <a href="#home">Kembali ke atas ↑</a>
        </div>
      </footer>

      <Suspense fallback={null}>
        {modalPres.rendered && (
          <ProjectModal
            project={modalPres.rendered}
            projectIndex={activeProjectIdx >= 0 ? activeProjectIdx : 0}
            projectTotal={visibleProjects.length}
            closing={modalPres.closing}
            onClose={closeProject}
            onStepProject={stepProject}
            onOpenImage={openImage}
          />
        )}
        {lbPres.rendered && (
          <Lightbox
            items={lbPres.rendered.items}
            index={lbPres.rendered.index}
            closing={lbPres.closing}
            onClose={closeImage}
            onStep={stepImage}
          />
        )}
      </Suspense>
    </>
  );
}
