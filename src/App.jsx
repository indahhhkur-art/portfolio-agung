import { useCallback, useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Portfolio from "./components/Portfolio.jsx";
import Contact from "./components/Contact.jsx";
import ProjectModal from "./components/ProjectModal.jsx";
import Lightbox from "./components/Lightbox.jsx";
import { useAnimatedPresence, useBodyLock } from "./hooks.js";

export default function App() {
  const [project, setProject] = useState(null);
  const [lightbox, setLightbox] = useState(null); // { items, index }

  const modalPres = useAnimatedPresence(project, 220);
  const lbPres = useAnimatedPresence(lightbox, 200);

  useBodyLock(Boolean(modalPres.rendered || lbPres.rendered));

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

      {modalPres.rendered && (
        <ProjectModal
          project={modalPres.rendered}
          closing={modalPres.closing}
          onClose={() => setProject(null)}
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
    </>
  );
}
