# ChargeUp ⚡ — Smart IoT Power Bank Rental Station

> **Apple-Grade 3D Interactive Website & Digital Twin Kiosk for Campus Hustle**  
> *Universitas Brawijaya (UB) • Universitas Negeri Malang (UM) • UIN Maulana Malik Ibrahim Malang*

---

## 🌟 Tentang Proyek
**ChargeUp** adalah solusi jaringan rental power bank pintar berbasis IoT untuk mahasiswa di Kota Malang. Menggabungkan pengisian daya portabel *ultra-fast charging* (20.800 mAh) dengan dual kabel bawaan (*Lightning* putih & *USB-C* hitam), stasiun meja dengan layar digital iklan interaktif 7 inci, serta lemari stasiun induk 20 slot modular.

Proyek ini dikembangkan sebagai prototipe komersialisasi mata kuliah **Kewirausahaan II — Kelompok 3 (2026)**.

---

## ✨ Fitur Unggulan Website

1. **3D Scrollytelling Apple-Grade (`js/three-scene.js`)**:
   - Model 3D powerbank interaktif dengan rotasi dinamis mengikuti scroll halaman.
   - Pembedahan komponen: port USB ganda, alur kabel ergonomis, display digital, dan material *matte polycarbonate*.
2. **Kiosk Station 20 Slot 3D Digital Twin (`station-3d.html`)**:
   - Simulasi fisik 3D stasiun pengisian daya lemari (600 × 250 × 700 mm).
   - Slider interaktif bukaan pintu akrilik 0° – 110°.
   - Saklar lampu penerangan LED 12V interior & simulasi 20 slot baterai.
   - 8 Preset sudut kamera & ekspor file 3D format `.GLB` dan `.STL`.
   - Dual tema: **OLED Cyber Dark Mode** & **Studio Light Mode**.
3. **Pusat Layanan Pelanggan CS WhatsApp Terpadu**:
   - Floating speed-dial FAB & interactive modal drawer.
   - Hubungi langsung tim support via WhatsApp:
     - 📞 **Rafi** (+62895326030211)
     - 📞 **Farih** (+6287766013236)
     - 📞 **Fahmy** (+6285882181560)
4. **Simulator Tarif & Biaya Rental Transparan**:
   - Hitung durasi sewa (Rp5.000/jam) dengan simulasi QRIS instan.
5. **Peta 12 Titik Stasiun Kampus**:
   - Persebaran stasiun rental strategis di fakultas & titik kumpul UB, UM, dan UIN Malang.
6. **Web Audio SFX Engine (`js/sound.js`)**:
   - Efek suara interaktif berbasis Web Audio API tanpa dependensi file audio eksternal.

---

## 📁 Struktur File Utama

```text
├── index.html            # Landing page utama (Three.js Scrollytelling + Section 3D Kiosk)
├── station-3d.html       # Fullscreen 3D Interactive Kiosk Station Model Viewer
├── css/
│   └── style.css         # UI/UX Pro Max tokens, glassmorphism, & animations
├── js/
│   ├── main.js           # Simulator, WhatsApp CS drawer, logic UI, & smooth scroll
│   ├── three-scene.js    # Three.js 3D Powerbank Scrollytelling scene
│   └── sound.js          # Web Audio API sound synthesis effects
├── assets/
│   ├── branding/         # Logo & ikon resmi ChargeUp
│   ├── product/          # Foto dokumentasi fisik produk & armada
│   └── slides/           # Dokumentasi slide presentasi
├── design-system/        # Design tokens UI/UX Pro Max (OLED Dark Mode)
├── .gitignore            # Filter file arsip besar / zip
└── README.md             # Dokumentasi proyek
```

---

## 🚀 Cara Menjalankan & Deploy ke GitHub Pages

### Opsi 1: Menjalankan Lokal di Komputer
Cukup buka file `index.html` langsung di browser modern (Chrome, Edge, Firefox, Safari) atau gunakan live server:
```bash
# Menggunakan Python
python -m http.server 8000

# Atau menggunakan Node.js
npx serve
```
Buka `http://localhost:8000` di browsermu.

### Opsi 2: Deploy Otomatis ke GitHub Pages
1. Push repository ini ke GitHub.
2. Masuk ke tab **Settings** repositori GitHub.
3. Klik menu **Pages** di bilah sisi kiri.
4. Pada bagian **Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` / `master` (pilih `/ (root)`)
5. Klik **Save**. Tunggu 1–2 menit, website ChargeUp akan langsung aktif online!

---

## 👥 Tim Pengembang (Kelompok 3)
- **Universitas Brawijaya (UB)** — Kewirausahaan II (2026)
- **Customer Service Hotline**:
  - Rafi: [+62 895-3260-30211](https://wa.me/62895326030211)
  - Farih: [+62 877-6601-3236](https://wa.me/6287766013236)
  - Fahmy: [+62 858-8218-1560](https://wa.me/6285882181560)
