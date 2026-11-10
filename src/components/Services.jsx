import { SERVICES } from "../data.js";
import { useReveal } from "../hooks.js";

export default function Services({ onSelectCategory }) {
  const headRef = useReveal();
  const gridRef = useReveal();

  const handlePick = category => {
    onSelectCategory(category);
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="services" id="services">
      <div className="container">
        <div className="section-split reveal" ref={headRef}>
          <div>
            <p className="eyebrow">Services</p>
            <h2 className="section-heading">
              Layanan <span className="text-grad">Utama Saya</span>
            </h2>
          </div>
          <button
            type="button"
            className="btn btn--compound btn--sm"
            onClick={() => handlePick("all")}
          >
            <span>Semua Karya</span>
            <span className="btn__circle" aria-hidden="true">↓</span>
          </button>
        </div>

        <div className="services__grid reveal" ref={gridRef}>
          {SERVICES.map(s => (
            <div className="service-card" key={s.category}>
              <div className="service-card__icon" aria-hidden="true">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <button
                type="button"
                className="service-card__link"
                onClick={() => handlePick(s.category)}
              >
                Lihat Karya <span aria-hidden="true">→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
