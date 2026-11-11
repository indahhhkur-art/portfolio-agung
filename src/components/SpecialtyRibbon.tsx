import { memo } from "react";

const RIBBON_ITEMS = [
  "E-Commerce Design",
  "Social Media Campaign",
  "Packaging & Print",
  "Corporate Branding",
  "Icon & Ilustrasi Vektor",
  "Digital Marketing Assets"
] as const;

const HALF_GROUP = [...RIBBON_ITEMS, ...RIBBON_ITEMS];

function RibbonGroup({ suffix }: { suffix: string }) {
  return (
    <div className="ribbon__group">
      {HALF_GROUP.map((item, i) => (
        <span className="ribbon__item" key={`${suffix}-${item}-${i}`}>
          <span className="ribbon__sep" aria-hidden="true" />
          {item}
        </span>
      ))}
    </div>
  );
}

/** Pita marquee keahlian desain dengan loop GPU tanpa jeda tepat di bawah Hero. */
function SpecialtyRibbon() {
  return (
    <div className="ribbon-band" aria-hidden="true">
      <div className="ribbon">
        <div className="ribbon__track">
          <RibbonGroup suffix="a" />
          <RibbonGroup suffix="b" />
        </div>
      </div>
    </div>
  );
}

export default memo(SpecialtyRibbon);
