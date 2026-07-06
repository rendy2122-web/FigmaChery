import { CarModel, Review } from "../types";

export const CHERY_MODELS: CarModel[] = [
  {
    id: "omoda-e5",
    name: "Chery OMODA E5",
    tagline: "The Future is Now - Crossover Listrik Futuristik",
    type: "EV",
    typeName: "Pure Electric SUV (EV)",
    basePrice: "Rp 496.000.000",
    formattedPrice: "Mulai dari Rp 496.000.000 (OTR Jakarta)",
    accentColor: "emerald",
    description: "Chery OMODA E5 mendefinisikan ulang mobilitas masa depan dengan menggabungkan desain crossover futuristik 'Art in Motion' dengan teknologi baterai mutakhir. SUV listrik murni ini menawarkan jarak tempuh luar biasa hingga 430 km (WLTP) dalam satu kali pengisian daya, performa instan dengan torsi 340 Nm, serta fitur keselamatan ADAS 2.5 generasi terbaru yang siap melindungi Anda di setiap perjalanan.",
    heroImage: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
    interiorImage: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
    techImage: "https://images.unsplash.com/photo-1558441719-ff34b0524a24?auto=format&fit=crop&w=1200&q=80",
    colors: [
      { name: "Stellar Silver", hex: "#b4b8b5", bgClass: "bg-slate-300" },
      { name: "Space Green", hex: "#2e4a3f", bgClass: "bg-emerald-950" },
      { name: "Phantom Black", hex: "#111111", bgClass: "bg-black" },
      { name: "Starlight Mint", hex: "#a1cca5", bgClass: "bg-teal-200" }
    ],
    highlights: [
      {
        title: "Performa Motor Listrik 150 kW",
        description: "Akselerasi instan 0-100 km/jam hanya dalam 7.2 detik tanpa kebisingan mesin, memberikan kesenangan berkendara luar biasa.",
        iconName: "Zap"
      },
      {
        title: "Baterai LFP Ultra Aman",
        description: "Kapasitas 61 kWh bersertifikat IP68 (tahan air & debu) dengan pengisian cepat DC dari 30% ke 80% hanya dalam waktu 28 menit.",
        iconName: "ShieldCheck"
      },
      {
        title: "Dual 24.6-inch Curved Screen",
        description: "Layar lengkung super besar didukung chip Qualcomm Snapdragon 8155, menghadirkan visual sistem multimedia paling jernih dan responsif.",
        iconName: "Tv"
      },
      {
        title: "ADAS 2.5 dengan 18 Fitur",
        description: "Sistem asisten pengemudi tercanggih termasuk Adaptive Cruise Control, Lane Keeping Assist, Blind Spot Detection, dan Autonomous Emergency Braking.",
        iconName: "Compass"
      }
    ],
    specs: [
      {
        categoryName: "Dapur Pacu & Baterai",
        items: [
          { name: "Tipe Motor", value: "Permanent Magnet Synchronous Motor" },
          { name: "Kapasitas Baterai", value: "61 kWh (Lithium Iron Phosphate - LFP)" },
          { name: "Tenaga Maksimal", value: "150 kW (201 HP)" },
          { name: "Torsi Maksimal", value: "340 Nm" },
          { name: "Jarak Tempuh Maks.", value: "430 km (WLTP) / 505 km (NEDC)" },
          { name: "Kecepatan Pengisian DC", value: "30-80% dalam 28 Menit (Max 80 kW)" }
        ]
      },
      {
        categoryName: "Dimensi & Sasis",
        items: [
          { name: "Panjang x Lebar x Tinggi", value: "4.424 mm x 1.830 mm x 1.588 mm" },
          { name: "Jarak Sumbu Roda", value: "2.630 mm" },
          { name: "Ground Clearance", value: "190 mm" },
          { name: "Suspensi Depan", value: "MacPherson Strut Independent" },
          { name: "Suspensi Belakang", value: "Multi-Link Independent" },
          { name: "Ukuran Ban", value: "215/55 R18 Alloy Wheels" }
        ]
      },
      {
        categoryName: "Fitur Keselamatan",
        items: [
          { name: "Airbags", value: "6 Airbags (Dual Front, Side, Curtain)" },
          { name: "Sistem ADAS", value: "Aktif (18 Fitur Keselamatan Pintar)" },
          { name: "Kamera Parkir", value: "360-Degree HD Panoramic Camera" },
          { name: "Stabilitas", value: "ESP + ABS + EBD + TCS + Hill Assist" },
          { name: "Struktur Bodi", value: "High Strength Steel Frame > 78%" }
        ]
      }
    ]
  },
  {
    id: "tiggo-8-pro-max",
    name: "Chery TIGGO 8 Pro Max",
    tagline: "Conquer Your Journeys - Luxury 7-Seater SUV Flagship",
    type: "ICE",
    typeName: "Turbo Petrol SUV with AWD",
    basePrice: "Rp 568.500.000",
    formattedPrice: "Mulai dari Rp 568.500.000 (OTR Jakarta)",
    accentColor: "amber",
    description: "Chery TIGGO 8 Pro Max mengombinasikan kemewahan kelas VIP dengan ketangguhan mesin 2.0L Turbocharged bertenaga 250 HP. Sebagai SUV 7-seater flagship, mobil ini menawarkan kabin super lapang berlapis kulit premium, sistem suara premium Sony dengan 10 speaker, serta sistem Intelligent All-Wheel Drive (AWD) yang memastikan kestabilan dan kendali optimal di segala medan jalan.",
    heroImage: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
    interiorImage: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
    techImage: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80",
    colors: [
      { name: "Imperial Dark Blue", hex: "#1e2e3d", bgClass: "bg-blue-900" },
      { name: "Luxury Gray", hex: "#525457", bgClass: "bg-gray-600" },
      { name: "Opal White", hex: "#f3f4f6", bgClass: "bg-slate-100" },
      { name: "Deep Obsidian Black", hex: "#111111", bgClass: "bg-black" }
    ],
    highlights: [
      {
        title: "Mesin 2.0 TGDI Engine bertenaga",
        description: "Mesin peraih penghargaan dengan tenaga puncak 250 HP dan torsi melimpah 390 Nm, dipadukan transmisi kopling ganda 7-DCT.",
        iconName: "Flame"
      },
      {
        title: "Kabin Mewah VIP 7-Seater",
        description: "Kursi berlapis kulit Nappa dengan fungsi ventilasi dan pemanas, ditambah kontrol AC tiga zona dan Panoramic Sunroof super besar.",
        iconName: "Layers"
      },
      {
        title: "Sistem Sony Premium Audio",
        description: "Kualitas audio sinematik di dalam kabin melalui 10 speaker premium yang dikustomisasi khusus oleh para ahli audio Sony.",
        iconName: "Volume2"
      },
      {
        title: "Intelligent AWD System",
        description: "Sistem AWD cerdas yang berpindah otomatis dalam 0.1 detik untuk memberikan traksi maksimal di jalan basah, berlumpur, atau berpasir.",
        iconName: "Compass"
      }
    ],
    specs: [
      {
        categoryName: "Dapur Pacu & Transmisi",
        items: [
          { name: "Tipe Mesin", value: "2.0L TGDI 4-Silinder Turbocharged" },
          { name: "Kapasitas Mesin", value: "1.998 cc" },
          { name: "Tenaga Maksimal", value: "250 HP @ 5.500 RPM" },
          { name: "Torsi Maksimal", value: "390 Nm @ 1.750 - 4.000 RPM" },
          { name: "Sistem Penggerak", value: "Intelligent All-Wheel Drive (AWD)" },
          { name: "Transmisi", value: "7-Speed Dual Clutch Transmission (DCT)" }
        ]
      },
      {
        categoryName: "Dimensi & Sasis",
        items: [
          { name: "Panjang x Lebar x Tinggi", value: "4.722 mm x 1.860 mm x 1.705 mm" },
          { name: "Jarak Sumbu Roda", value: "2.710 mm" },
          { name: "Kapasitas Bagasi", value: "193 - 1.930 Liter" },
          { name: "Suspensi Depan", value: "MacPherson Strut" },
          { name: "Suspensi Belakang", value: "Multi-Link Independent" },
          { name: "Ukuran Ban", value: "235/50 R19 Alloy Wheels" }
        ]
      },
      {
        categoryName: "Fitur Keselamatan",
        items: [
          { name: "Airbags", value: "9 Airbags (Termasuk Driver Knee Airbag)" },
          { name: "Sistem ADAS", value: "Aktif (Lengkap dengan Traffic Jam Assist)" },
          { name: "Kamera Parkir", value: "540-Degree Panoramic View (HD)" },
          { name: "Pengereman", value: "ABS + EBD + BAS + Brake Override System" },
          { name: "Sasis Bodi", value: "High Strength Bent Steel Frame" }
        ]
      }
    ]
  },
  {
    id: "omoda-5",
    name: "Chery OMODA 5 GT",
    tagline: "Cross F Future - Crossover Turbo Paling Agresif",
    type: "ICE",
    typeName: "Turbo Petrol SUV (FWD/AWD)",
    basePrice: "Rp 404.800.000",
    formattedPrice: "Mulai dari Rp 404.800.000 (OTR Jakarta)",
    accentColor: "blue",
    description: "Chery OMODA 5 GT menghadirkan desain crossover futuristik 'Art in Motion' yang agresif dengan mesin 1.6L Turbocharged bertenaga 197 HP. Diciptakan bagi individu dinamis yang menginginkan gaya yang mencolok tanpa mengorbankan kecepatan, kestabilan suspensi Multi-Link, serta kepintaran asisten berkendara digital yang intuitif.",
    heroImage: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80",
    interiorImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
    techImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    colors: [
      { name: "Aurora Green Accented Gray", hex: "#4a5d5c", bgClass: "bg-teal-800" },
      { name: "Phantom Grey", hex: "#3a3d40", bgClass: "bg-gray-700" },
      { name: "Khaki White", hex: "#eaeaea", bgClass: "bg-slate-200" },
      { name: "Sporty Black with Red Accent", hex: "#1c1c1c", bgClass: "bg-neutral-900" }
    ],
    highlights: [
      {
        title: "Mesin 1.6 TGDI Kencang",
        description: "Menghasilkan 197 HP dan torsi 290 Nm yang menyalurkan tenaga maksimal secara instan, dirancang untuk penggemar kecepatan.",
        iconName: "Zap"
      },
      {
        title: "Art in Motion Design",
        description: "Desain gril sarang lebah tanpa batas (borderless grille) yang ikonis dan lampu LED dinamis futuristik yang memikat semua mata.",
        iconName: "Sparkles"
      },
      {
        title: "Dual Screen Lebar 20.5-inch",
        description: "Visual dasbor modern dengan layar instrumen dan hiburan ganda beresolusi tinggi, mendukung Apple CarPlay dan Android Auto nirkabel.",
        iconName: "Tv"
      },
      {
        title: "Sistem Suara Sony Premium",
        description: "8 speaker premium Sony menghadirkan getaran suara bass yang dalam dan treble vokal yang jernih sempurna.",
        iconName: "Volume"
      }
    ],
    specs: [
      {
        categoryName: "Dapur Pacu & Transmisi",
        items: [
          { name: "Tipe Mesin", value: "1.6L TGDI 4-Silinder Turbocharged" },
          { name: "Kapasitas Mesin", value: "1.598 cc" },
          { name: "Tenaga Maksimal", value: "197 HP @ 5.500 RPM" },
          { name: "Torsi Maksimal", value: "290 Nm @ 2.000 - 4.000 RPM" },
          { name: "Sistem Penggerak", value: "Front-Wheel Drive (FWD) / AWD" },
          { name: "Transmisi", value: "7-Speed Dual Clutch Transmission (DCT)" }
        ]
      },
      {
        categoryName: "Dimensi & Sasis",
        items: [
          { name: "Panjang x Lebar x Tinggi", value: "4.400 mm x 1.830 mm x 1.588 mm" },
          { name: "Jarak Sumbu Roda", value: "2.630 mm" },
          { name: "Ground Clearance", value: "180 mm" },
          { name: "Suspensi Depan", value: "MacPherson Strut" },
          { name: "Suspensi Belakang", value: "Multi-Link Independent" },
          { name: "Ukuran Ban", value: "215/55 R18 Sporty Alloy Wheels" }
        ]
      },
      {
        categoryName: "Fitur Keselamatan",
        items: [
          { name: "Airbags", value: "6 Airbags" },
          { name: "Sistem ADAS", value: "Aktif (Termasuk Lane Departure Warning)" },
          { name: "Kamera Parkir", value: "360-Degree Panoramic HD Camera" },
          { name: "Stabilitas", value: "ESC + ABS + EBD + HAC" },
          { name: "Pengereman", value: "Rem Cakram Semua Roda dengan Kaliper Merah" }
        ]
      }
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    name: "Andi Wijaya",
    rating: 5,
    date: "14 Mei 2026",
    comment: "Sudah pakai Chery OMODA E5 selama 3 bulan. Jarak tempuh aslinya mendekati klaim WLTP, saya dapet sekitar 410 km dalam kondisi berkendara harian dengan AC menyala terus di Jakarta. Akselerasinya gila sekali, instan dan sangat senyap. Fitur ADAS 2.5 sangat membantu pas macet di tol dalam kota. Layar lengkung ganda Qualcomm Snapdragon di dasbornya sangat responsif dan kerasa premium banget. Sangat worth the money untuk mobil listrik seharga ini!",
    carModel: "omoda-e5",
    verified: true,
    likes: 42
  },
  {
    id: "rev-2",
    name: "Siti Rahmawati",
    rating: 5,
    date: "28 April 2026",
    comment: "TIGGO 8 Pro Max adalah SUV 7-seater terbaik di kelasnya. Kabinnya super lega, anak-anak sangat suka duduk di baris kedua dan ketiga karena joknya empuk berlapis kulit premium. AC triple zone membuat kabin dingin merata dengan cepat. Mesin 2.0 Turbonya sangat bertenaga, kalau mau menyalip di jalan tol tinggal gas dikit langsung ngacir. Sistem audio Sony nya luar biasa jernih, serasa nonton bioskop berjalan.",
    carModel: "tiggo-8-pro-max",
    verified: true,
    likes: 28
  },
  {
    id: "rev-3",
    name: "Budi Santoso",
    rating: 4,
    date: "2 Juni 2026",
    comment: "Awalnya ragu beli brand Chery, tapi setelah coba Test Drive OMODA 5 GT FWD langsung jatuh cinta. Desain eksteriornya sangat futuristik, sering dilirik orang pas di lampu merah. Performa mesin 1.6 Turbonya galak sekali, respons gasnya cekatan. Suspensi belakang yang sudah Multi-Link kerasa jauh lebih stabil dibanding tipe Omoda 5 standard. Kekurangannya cuma bagasi agak sempit karena bodi belakangnya bergaya coupe, tapi overall sangat memuaskan.",
    carModel: "omoda-5",
    verified: true,
    likes: 19
  },
  {
    id: "rev-4",
    name: "Rian Hidayat",
    rating: 5,
    date: "21 Juni 2026",
    comment: "Fitur V2L (Vehicle-to-Load) di OMODA E5 sangat berguna pas saya pergi camping bersama keluarga. Bisa colok rice cooker, projector, dan charger laptop langsung ke mobil. Baterai LFP-nya juga memberi rasa aman karena lebih tahan panas ekstrem. Proses pengisian daya baterai di SPKLU Ultra Fast Charging cuma butuh 25 menitan dari 30% ke 80%. Sangat praktis!",
    carModel: "omoda-e5",
    verified: true,
    likes: 31
  },
  {
    id: "rev-5",
    name: "Dewi Lestari",
    rating: 4,
    date: "10 Juni 2026",
    comment: "Kualitas material interior Chery TIGGO 8 Pro Max luar biasa. Lembut di mana-mana (soft touch), tidak ada plastik murah murahan. Kursi pijat dan ventilasi jok depan sangat membantu saat kemacetan parah di Jakarta agar punggung tetap dingin. Konsumsi bahan bakar mesin 2.0L Turbo tentu tidak seirit mobil LCGC, tapi sebanding dengan kenyamanan bodi bongsor dan traksi AWD nya.",
    carModel: "tiggo-8-pro-max",
    verified: true,
    likes: 15
  }
];
