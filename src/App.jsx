import { useCallback, useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Portfolio from "./components/Portfolio.jsx";
import Contact from "./components/Contact.jsx";
import ProjectModal from "./components/ProjectModal.jsx";
import Lightbox from "./components/Lightbox.jsx";
import { useBodyLock } from "./hooks.js";

export default function App() {
  const [project, setProject] = useState(null);
  const [lightbox, setLightbox] = useState(null); // { items, index }

  useBodyLock(Boolean(project || lightbox));

  const openImage = useCallback((items, index) => setLightbox({ items, index }), []);
  const closeImage = useCallback(() => setLightbox(null), []);
  const stepImage = useCallback(
    d => setLightbox(lb => lb && { ...lb, index: (lb.index + d + lb.items.length) % lb.items.length }),
    []
  );

  // Esc menutup modal proyek (lightbox menangani Esc-nya sendiri)
  useEffect(() => {
    if (!project || lightbox) return;
    const onKey = e => e.key === "Escape" && setProject(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, lightbox]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About onOpenImage={openImage} />
        <Portfolio onOpenProject={setProject} />
        <Contact />
      </main>

      <footer className="footer">
        <div className="container">
          <span>© {new Date().getFullYear()} Agung Saeful. All rights reserved.</span>
          <a href="#home">Kembali ke atas ↑</a>
        </div>
      </footer>

      {project && (
        <ProjectModal project={project} onClose={() => setProject(null)} onOpenImage={openImage} />
      )}
      {lightbox && (
        <Lightbox items={lightbox.items} index={lightbox.index} onClose={closeImage} onStep={stepImage} />
      )}
    </>
  );
}
