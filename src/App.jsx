import { useCallback, useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Services from "./components/Services.jsx";
import About from "./components/About.jsx";
import Portfolio from "./components/Portfolio.jsx";
import Contact from "./components/Contact.jsx";
import ProjectModal from "./components/ProjectModal.jsx";
import Lightbox from "./components/Lightbox.jsx";
import { NAV_ITEMS } from "./data.js";
import { useAnimatedPresence, useBodyLock } from "./hooks.js";

export default function App() {
  const [filter, setFilter] = useState("all");
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
        <Services onSelectCategory={setFilter} />
        <About onOpenImage={openImage} />
        <Portfolio filter={filter} onFilterChange={setFilter} onOpenProject={setProject} />
        <Contact />
      </main>

      <footer className="footer">
        <div className="container footer__top">
          <div className="footer__brand">
            <a
              href="https://linkedin.com/in/agungsaeful"
              target="_blank"
              rel="noopener noreferrer"
              className="nav__brand"
              title="Kunjungi profil LinkedIn Agung Saeful"
            >
              <span className="nav__avatar" aria-hidden="true">A</span>
              <span>Agung saeful</span>
            </a>
            <p>
              Graphic Designer & IT Graduate dengan fokus pada desain digital, branding e-commerce, serta dukungan operasional & pemasaran perbankan.
            </p>
          </div>

          <div className="footer__col">
            <h4>Navigasi</h4>
            <ul>
              {NAV_ITEMS.map(n => (
                <li key={n.id}><a href={`#${n.id}`}>{n.label}</a></li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4>Bidang Karya</h4>
            <ul>
              <li><a href="#portfolio" onClick={() => setFilter("ecommerce")}>E-Commerce Design</a></li>
              <li><a href="#portfolio" onClick={() => setFilter("social")}>Social Media</a></li>
              <li><a href="#portfolio" onClick={() => setFilter("print")}>Packaging & Print</a></li>
              <li><a href="#portfolio" onClick={() => setFilter("illustration")}>Icon & Ilustrasi</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__bar">
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
