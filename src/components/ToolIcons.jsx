import { memo } from "react";

/**
 * Ikon vektor asli (Adobe Illustrator, CorelDRAW, Canva, Microsoft Office, CapCut, Filmora)
 * dibingkai sempurna dalam lingkaran (round).
 */
function ToolIcon({ code }) {
  switch (code) {
    case "Ai":
      return (
        <svg viewBox="0 0 64 64" width="54" height="54" aria-hidden="true">
          <defs>
            <linearGradient id="ai-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3d0500" />
              <stop offset="100%" stopColor="#260000" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="32" fill="url(#ai-bg)" />
          <circle cx="32" cy="32" r="29" fill="none" stroke="#FF9A00" strokeOpacity="0.28" strokeWidth="1.5" />
          <path
            fill="#FF9A00"
            fillRule="evenodd"
            d="M25.6 20.4H30.5L38.7 44.4H33.5L31.9 39.2H24.1L22.5 44.4H17.4L25.6 20.4ZM28 25.3L25.1 35H30.9L28 25.3Z"
          />
          <circle cx="43.5" cy="22.1" r="2.65" fill="#FF9A00" />
          <rect x="41.1" y="27.2" width="4.8" height="17.2" rx="0.9" fill="#FF9A00" />
        </svg>
      );

    case "Cd":
      return (
        <svg viewBox="0 0 64 64" width="54" height="54" aria-hidden="true">
          <defs>
            <linearGradient id="cd-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#77DB3D" />
              <stop offset="55%" stopColor="#48BA34" />
              <stop offset="100%" stopColor="#258D25" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="32" fill="url(#cd-bg)" />
          {/* Ikon balon & mata pena khas CorelDRAW */}
          <path
            fill="#FFFFFF"
            d="M32 13C41.8 13 48 20.2 48 28.8C48 35.6 41.8 40.4 38.4 45.2H25.6C22.2 40.4 16 35.6 16 28.8C16 20.2 22.2 13 32 13Z"
          />
          <path d="M27.6 13.8C23 20.4 23 34.8 28.2 44.8" stroke="#39A72F" strokeOpacity="0.26" strokeWidth="1.8" fill="none" />
          <path d="M36.4 13.8C41 20.4 41 34.8 35.8 44.8" stroke="#39A72F" strokeOpacity="0.26" strokeWidth="1.8" fill="none" />
          <path d="M32 13V26.2" stroke="#359E2D" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="32" cy="28.4" r="2.6" fill="#359E2D" />
          <rect x="26.8" y="46.4" width="10.4" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.92" />
          <rect x="27.8" y="49.3" width="8.4" height="3.8" rx="1.2" fill="#FFFFFF" />
        </svg>
      );

    case "Cv":
      return (
        <svg viewBox="0 0 64 64" width="54" height="54" aria-hidden="true">
          <defs>
            <linearGradient id="cv-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00C4CC" />
              <stop offset="52%" stopColor="#268FF2" />
              <stop offset="100%" stopColor="#7D2AE8" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="32" fill="url(#cv-bg)" />
          <text
            x="32"
            y="37.4"
            textAnchor="middle"
            fill="#FFFFFF"
            fontFamily="'Brush Script MT', 'Segoe Script', Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fontWeight="700"
            fontSize="16.2"
            letterSpacing="-0.3"
          >
            Canva
          </text>
        </svg>
      );

    case "Of":
      return (
        <svg viewBox="0 0 64 64" width="54" height="54" aria-hidden="true">
          <circle cx="32" cy="32" r="31.2" fill="#FFFFFF" stroke="#F0DFD9" strokeWidth="1.6" />
          {/* Pita lipat Microsoft Office 3 warna asli */}
          <polygon fill="#DC3E15" points="18.5,24.8 36,15.5 36,24.6 25.4,27.5 25.4,39 18.5,41.6" />
          <polygon fill="#EA4C1D" points="36,15.5 46.5,18.6 46.5,45.4 36,48.5 36,15.5" />
          <polygon fill="#B92B0C" points="18.5,41.6 36,48.5 36,42.8 25.4,39" />
        </svg>
      );

    case "Cc":
      return (
        <svg viewBox="0 0 64 64" width="54" height="54" aria-hidden="true">
          <circle cx="32" cy="32" r="32" fill="#13151A" />
          {/* Ikon CapCut dual intersecting frame brackets */}
          <path
            fill="#FFFFFF"
            d="M17.5 24.4C17.5 21.8 19.6 19.8 22.2 19.8H32.2L47 34.4C47.8 35.2 47.8 36.5 47 37.3L45.3 39C44.5 39.8 43.2 39.8 42.4 39L30.6 27.3C30 26.8 29.3 26.5 28.5 26.5H23.1C22.4 26.5 21.8 27.1 21.8 27.8V29.8H17.5V24.4Z"
          />
          <path
            fill="#FFFFFF"
            d="M17.5 39.6C17.5 42.2 19.6 44.2 22.2 44.2H32.2L47 29.6C47.8 28.8 47.8 27.5 47 26.7L45.3 25C44.5 24.2 43.2 24.2 42.4 25L30.6 36.7C30 37.2 29.3 37.5 28.5 37.5H23.1C22.4 37.5 21.8 36.9 21.8 36.2V34.2H17.5V39.6Z"
          />
        </svg>
      );

    case "Fm":
      return (
        <svg viewBox="0 0 64 64" width="54" height="54" aria-hidden="true">
          <defs>
            <linearGradient id="fm-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1B2F42" />
              <stop offset="100%" stopColor="#0E1B28" />
            </linearGradient>
            <linearGradient id="fm-top" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#72FFD4" />
              <stop offset="100%" stopColor="#26D7AE" />
            </linearGradient>
            <linearGradient id="fm-bot" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#0A9E96" />
              <stop offset="100%" stopColor="#35E5BE" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="32" fill="url(#fm-bg)" />
          {/* Ikon Wondershare Filmora play wings */}
          <rect
            x="22.5"
            y="34.8"
            width="23"
            height="10.4"
            rx="5.2"
            transform="rotate(-44 29 39)"
            fill="url(#fm-bot)"
          />
          <rect
            x="22.5"
            y="18.8"
            width="23"
            height="10.4"
            rx="5.2"
            transform="rotate(44 29 25)"
            fill="url(#fm-top)"
          />
        </svg>
      );

    default:
      return <span>{code}</span>;
  }
}

export default memo(ToolIcon);
