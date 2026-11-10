/* ========= KONFIGURASI KONTAK =========
   Isi data di bawah ini agar tombol kontak muncul di bagian "THANKS".
   Biarkan kosong ("") untuk menyembunyikan. */
export const CONTACT = {
  email: "",      // contoh: "agung@email.com"
  whatsapp: "",   // contoh: "6281234567890" (tanpa +)
  instagram: "",  // contoh: "username"
  behance: "",    // contoh: "https://www.behance.net/username"
  dribbble: ""    // contoh: "https://dribbble.com/username"
};

export const IMG = `${import.meta.env.BASE_URL}img/`;

const seq = (prefix, from, to) =>
  Array.from({ length: to - from + 1 }, (_, i) => `${prefix}${String(from + i).padStart(2, "0")}.jpg`);

export const CATEGORY_LABEL = {
  ecommerce: "E-Commerce",
  social: "Social Media",
  print: "Packaging & Print",
  illustration: "Icon & Ilustrasi"
};

export const FILTERS = [
  { key: "all", label: "Semua" },
  { key: "ecommerce", label: "E-Commerce" },
  { key: "social", label: "Social Media" },
  { key: "print", label: "Packaging & Print" },
  { key: "illustration", label: "Icon & Ilustrasi" }
];

export const PROJECTS = [
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
    cover: "beso-01.jpg",
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
    cover: "nestiora-01.jpg",
    images: ["nestiora-banner.jpg", ...seq("nestiora-", 1, 18)],
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
    cover: "klyroa-01.jpg",
    images: seq("klyroa-", 1, 18),
    driveUrl: "https://drive.google.com/drive/folders/1DxQjlqY1MIlzjRy97jjRFSUSTQiK3XI_?usp=drive_link"
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
    cover: "elumroh-01.jpg",
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
    cover: "gudangtenda-01.jpg",
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
    cover: "schoters-01.jpg",
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
    cover: "disbudpar-01.jpg",
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
    cover: "yabinu-flyer.jpg",
    images: ["yabinu-flyer.jpg", "yabinu-29.jpg", "yabinu-30.jpg", ...seq("yabinu-", 1, 28)]
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
    cover: "ecozest-10.jpg",
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
    cover: "ecozest-packaging.jpg",
    images: ["ecozest-packaging.jpg", "ecozest-label.jpg"]
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
    cover: "aba-poster.jpg",
    images: ["aba-poster.jpg", "aba-03.jpg", "aba-01.jpg", "aba-02.jpg"]
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
    cover: "micro-mockup.jpg",
    images: ["micro-icons-color.jpg", "micro-icons-glyph.jpg", "micro-icons-line.jpg", "micro-mockup.jpg",
             "micro-illustration.jpg", "micro-ui.jpg", "micro-abstract.jpg"]
  }
];

export const CERTS = [
  { src: "cert-01.jpg", label: "Sertifikat Kompetensi — Operator Aplikasi Perkantoran (BNSP)" },
  { src: "cert-02.jpg", label: "Sertifikat Kompetensi — Data Management Staff (BNSP)" },
  { src: "cert-03.jpg", label: "Google Digital Marketing & E-commerce (Coursera)" },
  { src: "cert-04.jpg", label: "Graphic Design — California Institute of the Arts (Coursera)" }
];

export const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "portfolio", label: "Portfolio" },
  { id: "contact", label: "Contact" }
];
