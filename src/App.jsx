import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Portfolio from "./components/Portfolio.jsx";
import Contact from "./components/Contact.jsx";
import ScrollUI from "./components/ScrollUI.jsx";
import { PROJECTS } from "./data.js";
import { useAnimatedPresence, useBodyLock, useSmoothScroll } from "./hooks.js";

const loadModal = () => import("./components/ProjectModal.jsx");
const loadLightbox = () => import("./components/Lightbox.jsx");

const ProjectModal = lazy(loadModal);
const Lightbox = lazy(loadLightbox);

export default function App() {
  const [filter, setFilter] = useState("all");
  const [project, setProject] = useState(null);
  const [lightbox, setLightbox] = useState(null); // { items, index }

  const modalPres = useAnimatedPresence(project, 220);
  const lbPres = useAnimatedPresence(lightbox, 200);
  const overlayOpen = Boolean(modalPres.rendered || lbPres.rendered);

  useBodyLock(overlayOpen);
  useSmoothScroll(overlayOpen);

  const visibleProjects = useMemo(
    () => PROJECTS.filter(p => filter === "all" || p.category === filter),
    [filter]
  );
  const activeProjectIdx = project ? visibleProjects.findIndex(p => p.id === project.id) : -1;

  const openImage = useCallback((items, index) => setLightbox({ items, index }), []);
  const closeImage = useCallback(() => setLightbox(null), []);
  const closeProject = useCallback(() => setProject(null), []);
  const stepProject = useCallback(
    dir => {
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
    d => setLightbox(lb => lb && { ...lb, index: (lb.index + d + lb.items.length) % lb.items.length }),
    []
  );

  // Idle pre-warm chunk modal & lightbox pada koneksi normal agar klik pertama instan
  useEffect(() => {
    if (navigator.connection?.saveData) return;
    const warm = () => {
      loadModal();
      loadLightbox();
    };
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(warm, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = window.setTimeout(warm, 2200);
    return () => window.clearTimeout(timer);
  }, []);

  // Esc menutup modal proyek (lightbox menangani Esc-nya sendiri)
  useEffect(() => {
    if (!project || lightbox) return;
    const onKey = e => e.key === "Escape" && setProject(null);
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
