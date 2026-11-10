import type {
  CategoryKey,
  Certification,
  ContactConfig,
  FilterKey,
  NavItem,
  Project,
  TimelineItem,
  ToolItem
} from "./types.ts";

/* ========= KONFIGURASI KONTAK =========
   Isi data di bawah ini agar tombol kontak muncul di bagian "THANKS".
   Biarkan kosong ("") untuk menyembunyikan. */
export const CONTACT: ContactConfig = {
  email: "",
  whatsapp: "",
  instagram: "",
  behance: "",
  dribbble: ""
};

export const IMG = `${import.meta.env.BASE_URL}img/`;

const seq = (prefix: string, from: number, to: number): string[] =>
  Array.from({ length: to - from + 1 }, (_, i) => `${prefix}${String(from + i).padStart(2, "0")}.webp`);

export const CATEGORY_LABEL: Record<CategoryKey, string> = {
  ecommerce: "E-Commerce",
  social: "Social Media",
  print: "Packaging & Print",
  illustration: "Icon & Ilustrasi"
};

export const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "ecommerce", label: "E-Commerce" },
  { key: "social", label: "Social Media" },
  { key: "print", label: "Packaging & Print" },
  { key: "illustration", label: "Icon & Ilustrasi" }
];

export const PROJECTS: Project[] = [
  {
    id: "beso-shop",
    category: "ecommerce",
    title: "Beso Shop",
    summary: "Desain feeds katalog produk marketplace & visual highlight peralatan dapur stainless steel.",
    bullets: [
      "Mendesain layout katalog produk marketplace (Shopee, Tokopedia, Lazada) yang informatif dan menarik perhatian pembeli.",
      "Menyusun visualisasi varian ukuran (14/16/18/20 cm), keunggulan stainless steel, serta label BPA Free & Best Quality.",
      "Menyematkan trust badges (Pengiriman 24 Jam, 7 Hari Bebas Pengembalian, 100% Original) untuk memaksimalkan rasio konversi."
    ],
    tags: ["E-Commerce", "Marketplace", "Product Catalog", "Feed"],
    cover: "beso-01.webp",
    images: seq("beso-", 1, 18),
    driveUrl: "https://drive.google.com/drive/folders/1cBGb6LCzinVt7YpQimy271-3GaI8I1OV?usp=sharing"
  },
  {
    id: "nestiora",
    category: "ecommerce",
    title: "Nestiora",
    summary: "Desain banner etalase toko dan feeds katalog produk kitchenware & home living modern.",
    bullets: [
      "Merancang banner toko dan katalog feeds produk dengan identitas warna brand yang clean, segar, dan profesional.",
      "Menampilkan detail panduan ukuran, spesifikasi stainless steel, dan label 100% Food Grade secara informatif.",
      "Menciptakan konsistensi visual etalase marketplace untuk memperkuat kredibilitas dan citra brand."
    ],
    tags: ["E-Commerce", "Marketplace", "Banner Toko", "Kitchenware"],
    cover: "nestiora-01.webp",
    images: ["nestiora-banner.webp", ...seq("nestiora-", 1, 18)],
    driveUrl: "https://drive.google.com/drive/folders/19bWaCSk_bTSZoj3Jzw3pGaPt2pIw4pwa?usp=sharing"
  },
  {
    id: "klyroa-essence",
    category: "ecommerce",
    title: "Klyroa Essence",
    summary: "Visual branding dan listing feeds katalog produk perlengkapan dapur & F&B premium.",
    bullets: [
      "Mendesain visual listing produk bertekstur marmer mewah dengan integrasi logo branding Klyroa Essence yang berkelas.",
      "Menyajikan info spesifikasi material stainless steel, variasi ukuran inch, serta badge jaminan mutu Food Grade.",
      "Menghasilkan materi visual konsisten yang meningkatkan daya tarik produk di platform e-commerce."
    ],
    tags: ["E-Commerce", "Marketplace", "Branding", "Premium Kitchen"],
    cover: "klyroa-01.webp",
    images: seq("klyroa-", 1, 18),
    driveUrl: "https://drive.google.com/drive/folders/1DxQjlqY1MIlzjRy97jjRFSUSTQiK3XI_?usp=drive_link"
  },
  {
    id: "alumina",
    category: "social",
    title: "Alumina (Lumina Lighting Collection)",
    summary: "Desain kampanye media sosial feeds, promosi digital, roll-up banner offline, dan kemasan produk lampu premium.",
    bullets: [
      "Merancang feeds Instagram bernuansa luxury interior ('Crafted for Grand Living' & 'Lumina Prestige Series') untuk produk brass pendant lamp.",
      "Memproduksi visual listing e-commerce & marketplace informatif untuk produk LED Bulb 9W ramah lingkungan.",
      "Menyiapkan materi promosi toko offline berupa standing roll-up banner dan desain kemasan produk (packaging box) siap cetak."
    ],
    tags: ["Social media", "Marketing", "Instagram", "Packaging", "Branding"],
    cover: "alumina-05.webp",
    images: [
      "alumina-05.webp", "alumina-06.webp", "alumina-07.webp", "alumina-08.webp",
      "alumina-09.webp", "alumina-10.webp", "alumina-01.webp", "alumina-02.webp",
      "alumina-03.webp", "alumina-04.webp"
    ]
  },
  {
    id: "el-umroh",
    category: "social",
    title: "eL-Umroh",
    summary: "Desain feed edukasi, tips perlengkapan ibadah, dan materi promosi biro perjalanan umroh.",
    bullets: [
      "Merancang konten visual edukasi jamaah ('Umroh Starter Kit', tips manasik, dan panduan ibadah) dengan estetika islami modern yang elegan.",
      "Membuat carousel series Instagram informatif yang mudah dipahami dan engaging bagi calon jamaah.",
      "Menghadirkan materi promosi paket keberangkatan resmi berizin PPIU Kemenag yang terpercaya."
    ],
    tags: ["Social media", "Marketing", "Instagram", "Travel Umroh"],
    cover: "elumroh-01.webp",
    images: seq("elumroh-", 1, 13)
  },
  {
    id: "gudang-tenda",
    category: "social",
    title: "Gudang Tenda",
    summary: "Konten visual branding, katalog jenis tenda membran/canopy, dan carousel edukasi event & rigging.",
    bullets: [
      "Mendesain feeds dan carousel Instagram interaktif seputar pilihan jenis tenda paling populer dan aplikasinya.",
      "Mengombinasikan tipografi bold, elemen grafis geometris modern, dan skema warna kuning-abu yang dinamis.",
      "Memproduksi materi visual promosi sewa & fabrikasi tenda untuk kebutuhan acara, kafe, dan industri."
    ],
    tags: ["Social media", "Marketing", "Instagram", "Branding"],
    cover: "gudangtenda-01.webp",
    images: seq("gudangtenda-", 1, 16)
  },
  {
    id: "schoters",
    category: "social",
    title: "Schoters by Ruangguru",
    summary: "Konten Instagram untuk platform persiapan studi & beasiswa luar negeri.",
    bullets: [
      "Mendesain tampilan digital kreatif untuk media sosial.",
      "Mengembangkan grafis dan konten visual untuk kampanye media sosial.",
      "Membuat konten video untuk media sosial."
    ],
    tags: ["Social media", "Marketing", "Instagram"],
    cover: "schoters-01.webp",
    images: seq("schoters-", 1, 27)
  },
  {
    id: "disbudpar",
    category: "social",
    title: "DPRD Kabupaten Cirebon / Disbudpar",
    summary: "Poster dan konten visual promosi wisata & infografis daerah.",
    bullets: [
      "Menentukan dan mengatur posisi subjek, properti, serta pencahayaan, dan memilih sudut kamera untuk hasil akhir terbaik.",
      "Merencanakan dan menyiapkan sesi foto di lokasi maupun studio.",
      "Menyusun dan mengelola kalender konten tiap platform agar tayang tepat waktu dan relevan."
    ],
    tags: ["Social media", "Marketing", "Instagram"],
    cover: "disbudpar-01.webp",
    images: seq("disbudpar-", 1, 7)
  },
  {
    id: "yabinu",
    category: "social",
    title: "Yayasan Bina Ummah Cirebon / Amal Yabinu",
    summary: "Konten dakwah, kurban, zakat, infaq & sedekah untuk lembaga filantropi.",
    bullets: [
      "Desain feed Instagram bertema Ramadan, kurban, dan edukasi zakat.",
      "Banner, flyer, dan ucapan hari besar keagamaan.",
      "Layanan Zakat, Infaq, dan Sedekah: materi donasi & konsultasi."
    ],
    tags: ["Social media", "Banner", "Flyer"],
    cover: "yabinu-flyer.webp",
    images: ["yabinu-flyer.webp", "yabinu-29.webp", "yabinu-30.webp", ...seq("yabinu-", 1, 28)]
  },
  {
    id: "ecozest-social",
    category: "social",
    title: "Ecozest — Social Media",
    summary: "Desain konten promosi produk organik & natural untuk Instagram.",
    bullets: [
      "Membuat desain digital, brosur, banner, dan signage untuk media sosial.",
      "Membuat desain untuk kampanye penjualan dan pemasaran, cetak maupun digital.",
      "Menerapkan masukan desain untuk meningkatkan hasil proyek."
    ],
    tags: ["Social media", "Marketing", "Instagram"],
    cover: "ecozest-10.webp",
    images: seq("ecozest-", 1, 27)
  },
  {
    id: "ecozest-packaging",
    category: "print",
    title: "Ecozest — Packaging & Label",
    summary: "Desain kemasan keripik & kerupuk sehat beserta label produknya.",
    bullets: [
      "Mendesain grafis kemasan dengan sistem warna dan tipografi yang konsisten.",
      "Menyusun informasi produk: komposisi, berat, cara penyajian, dan barcode.",
      "Menyiapkan file siap cetak lengkap dengan garis potong dan dimensi."
    ],
    tags: ["Packaging", "Label", "Print"],
    cover: "ecozest-packaging.webp",
    images: ["ecozest-packaging.webp", "ecozest-label.webp"]
  },
  {
    id: "aba",
    category: "print",
    title: "ABA Tahfidz Institute",
    summary: "Poster open recruitment, agenda virtual, dan banner penyambutan.",
    bullets: [
      "Mengembangkan desain kreatif untuk materi cetak, brosur, banner, dan signage.",
      "Mendesain tampilan digital kreatif untuk iklan online bagi bisnis lokal."
    ],
    tags: ["Social media", "Marketing", "Instagram"],
    cover: "aba-poster.webp",
    images: ["aba-poster.webp", "aba-03.webp", "aba-01.webp", "aba-02.webp"]
  },
  {
    id: "microstock",
    category: "illustration",
    title: "Microstock — Icon, Flat Design & Illustration",
    summary: "Karya freelance untuk marketplace microstock: ikon, ilustrasi, dan aset vektor.",
    bullets: [
      "Membuat desain template.",
      "Mengembangkan desain kreatif untuk materi cetak, brosur, banner, dan signage.",
      "Mendesain tampilan digital kreatif untuk iklan online bagi bisnis lokal."
    ],
    tags: ["Icon", "Flat Design", "Illustration"],
    cover: "micro-mockup.webp",
    images: [
      "micro-icons-color.webp", "micro-icons-glyph.webp", "micro-icons-line.webp", "micro-mockup.webp",
      "micro-illustration.webp", "micro-ui.webp", "micro-abstract.webp"
    ]
  }
];

export const CERTS: Certification[] = [
  {
    src: "cert-01.webp",
    w: 702,
    h: 1006,
    label: "Sertifikat Kompetensi — Desainer Grafis Muda (BNSP)",
    shortTitle: "Junior Graphic Designer",
    issuer: "BNSP · LSP Informatika",
    year: "2023",
    badge: "BNSP"
  },
  {
    src: "cert-02.webp",
    w: 711,
    h: 1005,
    label: "Sertifikat Kompetensi — Data Management Staff (BNSP)",
    shortTitle: "Data Management Staff",
    issuer: "BNSP · LSP Teknologi Digital",
    year: "2022",
    badge: "BNSP"
  },
  {
    src: "cert-03.webp",
    w: 636,
    h: 491,
    label: "Google Digital Marketing & E-commerce (Coursera)",
    shortTitle: "Digital Marketing & E-commerce",
    issuer: "Google · Coursera",
    year: "2023",
    badge: "Google"
  },
  {
    src: "cert-04.webp",
    w: 636,
    h: 491,
    label: "Graphic Design Specialization — CalArts (Coursera)",
    shortTitle: "Graphic Design Specialization",
    issuer: "CalArts · Coursera",
    year: "2023",
    badge: "CalArts"
  }
];

export const TOOLS: ToolItem[] = [
  { code: "Ai", name: "Adobe Illustrator", role: "Vector & Brand Design" },
  { code: "Cd", name: "CorelDRAW", role: "Print & Layout Assets" },
  { code: "Cv", name: "Canva", role: "Social Media & Promo" },
  { code: "Of", name: "Microsoft Office", role: "Administrasi & Data" },
  { code: "Cc", name: "CapCut Desktop", role: "Short-Form Video" },
  { code: "Fm", name: "Filmora", role: "Video Editing" }
];

export const EDUCATION_LIST: TimelineItem[] = [
  {
    period: "Lulus 2025 · IPK 3.82 / 4.00",
    title: "S1 Teknik Informatika — STMIK IKMI Cirebon",
    detail: "Analisis Data, Ilmu Data, Data Management, dan Sistem Basis Data."
  },
  {
    period: "Online Certificate · Complete / Pass",
    title: "California Institute of the Arts",
    detail: "Graphic Design, Branding Marketing, Social Marketing, dan Digital Branding."
  }
];

export const KEY_SKILLS: string[] = [
  "Graphic Design",
  "Video Editing",
  "Social Media Management",
  "Branding & Digital Marketing",
  "Cloud Management",
  "Data Management",
  "Sales & Client Follow-up"
];

export const EXPERIENCE_LIST: TimelineItem[] = [
  {
    period: "Internship · Sales Representative Junior",
    title: "Bank Syariah Indonesia (BSI)",
    detail: "Aktivasi & promosi QRIS serta digital banking (30–100 aktivasi/hari) dan follow-up harian 30 nasabah via WhatsApp."
  },
  {
    period: "August 2023 – December 2023",
    title: "Schoters by Ruangguru — Graphic Design Intern",
    detail: "Menyelesaikan desain selaras brand guidelines dalam tenggat 3 hari (3–8 variasi/proyek) untuk mendukung pemasaran digital."
  },
  {
    period: "May 2023 – June 2023",
    title: "DPRD Kabupaten Cirebon — Administrasi Staff",
    detail: "Mengelola dokumen & data, administrasi kegiatan/event, serta dokumentasi foto dan video publikasi lembaga."
  },
  {
    period: "December 2020 – December 2022",
    title: "Ecozest — Graphic Design & Marketing Staff",
    detail: "Merancang puluhan aset konten digital bulanan dengan CorelDRAW, Illustrator, dan Canva (3–12 aset/proyek dalam 2 hari kerja)."
  }
];

export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "portfolio", label: "Portfolio" },
  { id: "contact", label: "Contact" }
];
