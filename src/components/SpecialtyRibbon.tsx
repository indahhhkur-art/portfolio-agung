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
          <svg className="ribbon__star" viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
            <path fill="currentColor" d="M8 0L9.9 6.1L16 8L9.9 9.9L8 16L6.1 9.9L0 8L6.1 6.1Z" />
          </svg>
          {item}
        </span>
      ))}
    </div>
  );
}

/** Pita marquee keahlian desain dengan loop GPU tanpa jeda di bawah section Portfolio. */
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
