/**
 * ChargeUp Application Logic & Interactions
 * Enhanced with Apple-Style 3D Scrollytelling
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 2. Initialize 3D Scrollytelling Canvas
    let viewer = null;
    const canvasContainer = document.getElementById('scrolly-canvas-container');
    if (canvasContainer && window.ChargeUpProduct3D) {
        viewer = new ChargeUpProduct3D('scrolly-canvas-container');
        window.chargeUpViewer = viewer;
    }

    // 3. Audio SFX & Sound Toggle Button
    const soundBtn = document.getElementById('sound-toggle');
    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            const isEnabled = window.sound.toggle();
            soundBtn.innerHTML = isEnabled ?
                `<i data-lucide="volume-2" class="w-4 h-4 text-cyan-400"></i><span class="text-xs font-mono text-cyan-300">SFX: ON</span>` :
                `<i data-lucide="volume-x" class="w-4 h-4 text-slate-400"></i><span class="text-xs font-mono text-slate-400">SFX: OFF</span>`;
            if (window.lucide) window.lucide.createIcons();
            if (isEnabled) window.sound.playClick();
        });
    }

    // Global click sound on buttons
    document.querySelectorAll('button, a[href^="#"]').forEach(el => {
        el.addEventListener('click', () => {
            if (window.sound) window.sound.playClick();
        });
    });

    // 4. Campus Edition Swatch Selector (Apple Watch Style)
    const swatchBtns = document.querySelectorAll('[data-campus-swatch]');
    const activeCampusLabel = document.getElementById('active-campus-label');
    const activeCampusDesc = document.getElementById('active-campus-desc');

    const campusDescMap = {
        'UB': {
            title: 'Brawijaya Blue Edition',
            desc: 'Dibalut warna cobalt blue dengan aksen cyan elektrik, mencerminkan identitas kampus teknik dan riset Universitas Brawijaya.'
        },
        'UM': {
            title: 'Cakrawala Mint Edition',
            desc: 'Sentuhan warna emerald toska Cakrawala khas Universitas Negeri Malang dengan energi dan kelincahan mobilitas tinggi.'
        },
        'UIN': {
            title: 'Maliki Violet Edition',
            desc: 'Perpaduan deep violet dan neon lavender anggun bernuansa cyber-akademik kampus UIN Maulana Malik Ibrahim Malang.'
        },
        'STEALTH': {
            title: 'Cyber Stealth Obsidian',
            desc: 'Edisi hitam matte titanium murni dengan aksen slate minimalis, cocok untuk Anda yang menyukai tampilan stealth berkelas.'
        }
    };

    swatchBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            swatchBtns.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            const campusKey = e.currentTarget.getAttribute('data-campus-swatch');
            if (viewer) {
                viewer.setCampusTheme(campusKey);
            }
            if (activeCampusLabel && campusDescMap[campusKey]) {
                activeCampusLabel.textContent = campusDescMap[campusKey].title;
            }
            if (activeCampusDesc && campusDescMap[campusKey]) {
                activeCampusDesc.textContent = campusDescMap[campusKey].desc;
            }
        });
    });

    // 5. Ad Switcher & 3D Interactive Controls (Matching Video Prototype)
    const adButtons = document.querySelectorAll('[data-ad-btn]');
    adButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const adIndex = parseInt(e.currentTarget.getAttribute('data-ad-btn'));
            if (viewer) {
                viewer.switchAd(adIndex);
                updateAdDisplayUI();
            }
        });
    });

    const btnNextAd = document.getElementById('btn-ad-next');
    if (btnNextAd && viewer) {
        btnNextAd.addEventListener('click', () => {
            viewer.switchAd();
            updateAdDisplayUI();
        });
    }

    // Auto-Rotate Button (Toggle continuous 360 rotation like in video)
    const btnAutoRotate = document.getElementById('btn-auto-rotate');
    const autoRotateText = document.getElementById('auto-rotate-text');
    if (btnAutoRotate && viewer) {
        btnAutoRotate.addEventListener('click', () => {
            const isRotating = viewer.toggleAutoRotate();
            if (autoRotateText) {
                autoRotateText.textContent = isRotating ? 'Putar otomatis: ON' : 'Putar otomatis: OFF';
            }
            const icon = btnAutoRotate.querySelector('i');
            if (icon) {
                if (isRotating) {
                    icon.classList.add('animate-spin');
                } else {
                    icon.classList.remove('animate-spin');
                }
            }
        });
    }

    // Reset Camera View Button
    const btnResetView = document.getElementById('btn-reset-view');
    if (btnResetView && viewer) {
        btnResetView.addEventListener('click', () => {
            viewer.resetView();
        });
    }

    function updateAdDisplayUI() {
        if (!viewer) return;
        const currentIdx = viewer.currentAdIndex;
        const ad = viewer.ads[currentIdx];
        const badgeEl = document.getElementById('scrolly-ad-badge');
        const titleEl = document.getElementById('scrolly-ad-title');
        const orgEl = document.getElementById('scrolly-ad-org');
        const subEl = document.getElementById('scrolly-ad-sub');

        if (badgeEl) {
            badgeEl.textContent = ad.badge;
            badgeEl.style.backgroundColor = ad.color;
        }
        if (titleEl) titleEl.textContent = ad.title;
        if (orgEl) orgEl.textContent = ad.org;
        if (subEl) subEl.textContent = ad.sub;

        // Update active styling on ad buttons
        document.querySelectorAll('[data-ad-btn]').forEach(btn => {
            const idx = parseInt(btn.getAttribute('data-ad-btn'));
            if (idx === currentIdx) {
                btn.classList.add('border-cyan-400', 'bg-cyan-500/25', 'text-cyan-300', 'shadow-md', 'shadow-cyan-500/20');
                btn.classList.remove('border-slate-700', 'text-slate-300');
            } else {
                btn.classList.remove('border-cyan-400', 'bg-cyan-500/25', 'text-cyan-300', 'shadow-md', 'shadow-cyan-500/20');
                btn.classList.add('border-slate-700', 'text-slate-300');
            }
        });
    }
    updateAdDisplayUI();

    // 6. Interactive Rental Simulator
    setupPhoneSimulator();

    // 7. Interactive Campus Network Map
    setupCampusMap();

    // 8. Interactive Ad Space Calculator
    setupAdCalculator();

    // 9. Market Research Charts (Chart.js)
    setupResearchCharts();

    // 10. Slide Presentation Lightbox
    setupSlideLightbox();

    // 11. Photo Gallery Lightbox
    setupGalleryLightbox();

    // 12. Customer Service & Support Drawer
    setupCustomerService();
});

/* =========================================================================
   6. PHONE RENTAL SIMULATOR
   ========================================================================= */
function setupPhoneSimulator() {
    let currentStep = 1;
    let timerInterval = null;
    let secondsElapsed = 0;
    let batteryLevel = 9;

    const screens = {
        1: document.getElementById('sim-screen-1'),
        2: document.getElementById('sim-screen-2'),
        3: document.getElementById('sim-screen-3'),
        4: document.getElementById('sim-screen-4')
    };

    function showScreen(step) {
        currentStep = step;
        Object.keys(screens).forEach(k => {
            if (screens[k]) {
                if (parseInt(k) === step) {
                    screens[k].classList.remove('hidden');
                    screens[k].classList.add('flex');
                } else {
                    screens[k].classList.add('hidden');
                    screens[k].classList.remove('flex');
                }
            }
        });

        document.querySelectorAll('[data-sim-step]').forEach(ind => {
            const s = parseInt(ind.getAttribute('data-sim-step'));
            if (s <= step) {
                ind.classList.remove('bg-slate-800', 'text-slate-400');
                ind.classList.add('bg-cyan-500', 'text-slate-950', 'font-bold');
            } else {
                ind.classList.add('bg-slate-800', 'text-slate-400');
                ind.classList.remove('bg-cyan-500', 'text-slate-950', 'font-bold');
            }
        });
    }

    const btnSimScan = document.getElementById('btn-sim-scan');
    if (btnSimScan) {
        btnSimScan.addEventListener('click', () => {
            if (window.sound) window.sound.playScan();
            btnSimScan.innerHTML = `<span class="animate-spin inline-block mr-2">⟳</span> Memindai QR Code...`;
            setTimeout(() => {
                showScreen(2);
                btnSimScan.innerHTML = `<i data-lucide="scan" class="w-4 h-4 mr-2"></i> Pindai QR di Station`;
                if (window.lucide) window.lucide.createIcons();
            }, 800);
        });
    }

    const btnSimConfirm = document.getElementById('btn-sim-confirm');
    if (btnSimConfirm) {
        btnSimConfirm.addEventListener('click', () => {
            if (window.sound) window.sound.playEject();
            showScreen(3);
            startChargingSimulation();
        });
    }

    function startChargingSimulation() {
        secondsElapsed = 0;
        batteryLevel = 14;
        clearInterval(timerInterval);

        const timerEl = document.getElementById('sim-timer');
        const costEl = document.getElementById('sim-cost');
        const batteryText = document.getElementById('sim-battery-text');
        const batteryBar = document.getElementById('sim-battery-bar');

        timerInterval = setInterval(() => {
            secondsElapsed++;
            const mins = Math.floor(secondsElapsed / 60);
            const secs = secondsElapsed % 60;
            if (timerEl) timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

            if (batteryLevel < 98) {
                batteryLevel += 2;
                if (batteryText) batteryText.textContent = `${batteryLevel}%`;
                if (batteryBar) batteryBar.style.width = `${batteryLevel}%`;
            }

            if (costEl) costEl.textContent = 'Rp5.000';
        }, 1000);
    }

    const btnSimReturn = document.getElementById('btn-sim-return');
    if (btnSimReturn) {
        btnSimReturn.addEventListener('click', () => {
            clearInterval(timerInterval);
            if (window.sound) window.sound.playDock();

            setTimeout(() => {
                if (window.sound) window.sound.playSuccess();
                if (window.confetti) {
                    window.confetti({ particleCount: 85, spread: 75, origin: { y: 0.6 } });
                }
                showScreen(4);
            }, 400);
        });
    }

    const btnSimReset = document.getElementById('btn-sim-reset');
    if (btnSimReset) {
        btnSimReset.addEventListener('click', () => {
            clearInterval(timerInterval);
            showScreen(1);
        });
    }
}

/* =========================================================================
   7. CAMPUS MAP & STATION FINDER
   ========================================================================= */
const campusStations = [
    { id: 'ub-1', campus: 'UB', name: 'Perpustakaan Pusat UB', loc: 'Lantai 1 Dekat Pintu Masuk', ready: 4, total: 4, open: '07:30 - 21:00', popular: 'Sangat Ramai' },
    { id: 'ub-2', campus: 'UB', name: 'Kantin Creative Land (CL)', loc: 'Area Meja Tengah', ready: 3, total: 4, open: '08:00 - 18:00', popular: 'Favorit Mahasiswa' },
    { id: 'ub-3', campus: 'UB', name: 'Gedung FILKOM UB', loc: 'Lobby Gedung F Lantai 1', ready: 4, total: 4, open: '07:00 - 20:00', popular: 'Titik Coding' },
    { id: 'ub-4', campus: 'UB', name: 'Gazebo & Kantin FK UB', loc: 'Pusat Santai Mahasiswa', ready: 2, total: 4, open: '08:00 - 17:00', popular: 'Biasa' },

    { id: 'um-1', campus: 'UM', name: 'Perpustakaan Pusat UM', loc: 'Lobi Depan Ruang Baca', ready: 4, total: 4, open: '07:30 - 20:30', popular: 'Sangat Ramai' },
    { id: 'um-2', campus: 'UM', name: 'Kantin Sasana Budaya UM', loc: 'Pujasera Mahasiswa', ready: 3, total: 4, open: '08:00 - 17:30', popular: 'Makan & Charge' },
    { id: 'um-3', campus: 'UM', name: 'Graha Cakrawala UM', loc: 'Selasar Pintu Timur', ready: 4, total: 4, open: '08:00 - 22:00', popular: 'Event & Konser' },
    { id: 'um-4', campus: 'UM', name: 'Gedung FMIPA UM', loc: 'Gazebo Belajar Mahasiswa', ready: 3, total: 4, open: '07:00 - 18:00', popular: 'Belajar Bersama' },

    { id: 'uin-1', campus: 'UIN', name: 'Gedung Rektorat UIN', loc: 'Lobby Pelayanan Terpadu', ready: 4, total: 4, open: '07:30 - 16:30', popular: 'Administrasi' },
    { id: 'uin-2', campus: 'UIN', name: 'Kantin Utama Kampus 1 UIN', loc: 'Area Foodcourt Tengah', ready: 3, total: 4, open: '08:00 - 18:00', popular: 'Nongkrong' },
    { id: 'uin-3', campus: 'UIN', name: 'Masjid Tarbiyah UIN', loc: 'Selasar Bawah Tangga Utama', ready: 4, total: 4, open: '04:00 - 21:00', popular: 'Istirahat & Ibadah' },
    { id: 'uin-4', campus: 'UIN', name: 'Fakultas Saintek UIN', loc: 'Ruang Bersama Mahasiswa', ready: 2, total: 4, open: '07:30 - 18:00', popular: 'Lab & Praktikum' }
];

function setupCampusMap() {
    const listContainer = document.getElementById('station-list-container');
    const filterBtns = document.querySelectorAll('[data-campus-filter]');

    function renderStations(filter) {
        if (!listContainer) return;
        listContainer.innerHTML = '';

        const filtered = filter === 'ALL' ?
            campusStations :
            campusStations.filter(s => s.campus === filter);

        filtered.forEach(stn => {
            const card = document.createElement('div');
            card.className = 'glass-card p-4 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between';

            const badgeColor = stn.campus === 'UB' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                              (stn.campus === 'UM' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-purple-500/20 text-purple-400 border-purple-500/30');

            card.innerHTML = `
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeColor}">
                            ${stn.campus} Malang
                        </span>
                        <span class="text-xs font-mono text-emerald-400 flex items-center">
                            <span class="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                            ${stn.ready}/${stn.total} Tersedia
                        </span>
                    </div>
                    <h4 class="font-bold text-slate-100 text-sm mb-1">${stn.name}</h4>
                    <p class="text-xs text-slate-400 flex items-center mb-2">
                        <i data-lucide="map-pin" class="w-3.5 h-3.5 mr-1 text-cyan-400 inline"></i> ${stn.loc}
                    </p>
                </div>
                <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>🕒 ${stn.open}</span>
                    <button class="text-cyan-400 font-semibold hover:text-cyan-300 flex items-center" onclick="alert('Navigasi menuju ${stn.name} (${stn.campus}) sedang dibuka di Google Maps.')">
                        Rute <i data-lucide="external-link" class="w-3 h-3 ml-1"></i>
                    </button>
                </div>
            `;
            listContainer.appendChild(card);
        });

        if (window.lucide) window.lucide.createIcons();
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active', 'bg-cyan-500', 'text-slate-950'));
            e.currentTarget.classList.add('active', 'bg-cyan-500', 'text-slate-950');
            renderStations(e.currentTarget.getAttribute('data-campus-filter'));
        });
    });

    renderStations('ALL');
}

/* =========================================================================
   8. AD CALCULATOR
   ========================================================================= */
function setupAdCalculator() {
    const durationSelect = document.getElementById('ad-duration');
    const campusCheckboxes = document.querySelectorAll('.ad-campus-cb');
    const orgDiscount = document.getElementById('ad-org-discount');
    const totalEstViews = document.getElementById('ad-total-views');
    const totalPrice = document.getElementById('ad-total-price');

    if (!durationSelect || !totalPrice) return;

    function calculate() {
        const weeks = parseInt(durationSelect.value) || 1;
        let selectedCampusCount = 0;
        campusCheckboxes.forEach(cb => { if (cb.checked) selectedCampusCount++; });
        if (selectedCampusCount === 0) selectedCampusCount = 1;

        let baseCost = 50000 * weeks * selectedCampusCount;
        if (selectedCampusCount >= 3) baseCost *= 0.85;
        if (orgDiscount && orgDiscount.checked) baseCost *= 0.80;

        const views = 7500 * weeks * selectedCampusCount;
        if (totalEstViews) totalEstViews.textContent = `~${views.toLocaleString('id-ID')} Kali Tayang`;
        if (totalPrice) totalPrice.textContent = `Rp${Math.round(baseCost).toLocaleString('id-ID')}`;
    }

    durationSelect.addEventListener('change', calculate);
    campusCheckboxes.forEach(cb => cb.addEventListener('change', calculate));
    if (orgDiscount) orgDiscount.addEventListener('change', calculate);

    calculate();
}

/* =========================================================================
   9. MARKET RESEARCH CHARTS (Chart.js)
   ========================================================================= */
function setupResearchCharts() {
    if (!window.Chart) return;

    const priceCtx = document.getElementById('pricePerceptionChart');
    if (priceCtx) {
        new Chart(priceCtx, {
            type: 'bar',
            data: {
                labels: ['UM Malang', 'UIN Malang', 'UB Malang', 'Tarif ChargeUp'],
                datasets: [{
                    label: 'Persepsi Harga Wajar / Jam (Rp)',
                    data: [5000, 6000, 8500, 5000],
                    backgroundColor: [
                        'rgba(56, 189, 248, 0.4)',
                        'rgba(168, 85, 247, 0.4)',
                        'rgba(99, 102, 241, 0.4)',
                        'rgba(0, 242, 254, 0.85)'
                    ],
                    borderColor: ['#38bdf8', '#a855f7', '#6366f1', '#00f2fe'],
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: { label: (ctx) => `Rp${ctx.raw.toLocaleString('id-ID')} / Jam` }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.06)' },
                        ticks: { color: '#94a3b8', callback: (v) => 'Rp' + (v / 1000) + 'k' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#cbd5e1', font: { weight: 'bold' } }
                    }
                }
            }
        });
    }

    const spotCtx = document.getElementById('locationPreferenceChart');
    if (spotCtx) {
        new Chart(spotCtx, {
            type: 'doughnut',
            data: {
                labels: ['Kantin & Foodcourt', 'Perpustakaan Pusat', 'Gedung Fakultas & Gazebo', 'Masjid & Parkir'],
                datasets: [{
                    data: [35, 30, 20, 15],
                    backgroundColor: ['#00f2fe', '#38bdf8', '#818cf8', '#a855f7'],
                    borderWidth: 0,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#cbd5e1', font: { size: 11 }, padding: 12 }
                    }
                },
                cutout: '70%'
            }
        });
    }
}

/* =========================================================================
   10. PRESENTATION SLIDES LIGHTBOX
   ========================================================================= */
function setupSlideLightbox() {
    const lightbox = document.getElementById('slide-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    let currentSlide = 1;
    const totalSlides = 9;

    const slideDescriptions = {
        1: "Cover: Sewa Power Bank Berbasis Station untuk Mahasiswa UB, UM, UIN Malang",
        2: "Deskripsi Masalah & Solusi 5% Baterai Lemah vs Mobilitas Kuliah",
        3: "Arsitektur & Bentuk Fisik: 4-Slot Smart Station & Layar Mini Power Bank",
        4: "Brand Strategy: Arti Nama ChargeUp, Visi, Misi & 3 Core Values",
        5: "Business Model Canvas (Key Partners, Key Activities, Value Propositions)",
        6: "Competitor Mapping: Keunggulan ChargeUp vs ReCharge, ChargeSPOT, dsb",
        7: "Pengujian Konsep & Rencana Pengujian Prototipe di 3 Kampus",
        8: "Hasil Survei & Riset Wawancara 7 Mahasiswa Malang",
        9: "Hasil Konsep Produk Final & Langkah Uji Coba Lanjutan"
    };

    function openSlide(index) {
        currentSlide = index;
        if (lightboxImg) lightboxImg.src = `assets/slides/slide_${currentSlide}.png`;
        if (lightboxTitle) lightboxTitle.textContent = `Slide ${currentSlide} / ${totalSlides}: ${slideDescriptions[currentSlide] || ''}`;
        if (lightbox) {
            lightbox.classList.remove('hidden', 'opacity-0');
            lightbox.classList.add('flex', 'opacity-100');
        }
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.add('hidden', 'opacity-0');
            lightbox.classList.remove('flex', 'opacity-100');
        }
    }

    document.querySelectorAll('[data-slide-index]').forEach(el => {
        el.addEventListener('click', () => {
            const idx = parseInt(el.getAttribute('data-slide-index'));
            openSlide(idx);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', () => {
        currentSlide = currentSlide > 1 ? currentSlide - 1 : totalSlides;
        openSlide(currentSlide);
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
        currentSlide = currentSlide < totalSlides ? currentSlide + 1 : 1;
        openSlide(currentSlide);
    });

    window.addEventListener('keydown', (e) => {
        if (lightbox && !lightbox.classList.contains('hidden')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevBtn && prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn && nextBtn.click();
        }
    });
}

/* =========================================================================
   11. ORIGINAL PRODUCT PHOTO LIGHTBOX
   ========================================================================= */
function setupGalleryLightbox() {
    const galleryItems = document.querySelectorAll('[data-product-img]');
    const lightbox = document.getElementById('slide-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const src = item.getAttribute('data-product-img');
            const title = item.getAttribute('data-product-desc') || 'Foto Prototype Fisik ChargeUp';
            if (lightboxImg) lightboxImg.src = src;
            if (lightboxTitle) lightboxTitle.textContent = title;
            if (lightbox) {
                lightbox.classList.remove('hidden', 'opacity-0');
                lightbox.classList.add('flex', 'opacity-100');
            }
        });
    });
}

/* =========================================================================
   12. CUSTOMER SERVICE (CS) & WHATSAPP SUPPORT DRAWER
   ========================================================================= */
function setupCustomerService() {
    // Outside click to close popup drawer
    document.addEventListener('click', (e) => {
        const container = document.getElementById('cs-floating-container');
        const drawer = document.getElementById('cs-popup-drawer');
        if (drawer && !drawer.classList.contains('hidden') && container) {
            if (!container.contains(e.target) && !e.target.closest('[onclick*="toggleCsModal"]')) {
                drawer.classList.add('hidden');
            }
        }
    });

    // ESC to close drawer
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const drawer = document.getElementById('cs-popup-drawer');
            if (drawer && !drawer.classList.contains('hidden')) {
                drawer.classList.add('hidden');
            }
        }
    });
}

function toggleCsModal(forceOpen) {
    const drawer = document.getElementById('cs-popup-drawer');
    if (!drawer) return;
    const isCurrentlyHidden = drawer.classList.contains('hidden');
    const shouldOpen = forceOpen !== undefined ? forceOpen : isCurrentlyHidden;

    if (shouldOpen) {
        drawer.classList.remove('hidden');
        if (window.sound) window.sound.playClick();
        if (window.lucide) window.lucide.createIcons();
    } else {
        drawer.classList.add('hidden');
    }
}
window.toggleCsModal = toggleCsModal;

function copyContactNumber(phoneNumber, name, btnElement) {
    if (window.sound) window.sound.playClick();

    const doCopySuccess = () => {
        showCsToast(`Nomor WhatsApp ${name} (${phoneNumber}) berhasil disalin!`);
        if (btnElement) {
            const label = btnElement.querySelector('.btn-copy-label');
            if (label) {
                const originalText = label.textContent;
                label.textContent = 'Tersalin! ✓';
                btnElement.classList.add('border-emerald-500/60', 'text-emerald-300');
                setTimeout(() => {
                    label.textContent = originalText;
                    btnElement.classList.remove('border-emerald-500/60', 'text-emerald-300');
                }, 2200);
            }
        }
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(phoneNumber).then(() => {
            doCopySuccess();
        }).catch(() => {
            fallbackCopyText(phoneNumber, doCopySuccess);
        });
    } else {
        fallbackCopyText(phoneNumber, doCopySuccess);
    }
}
window.copyContactNumber = copyContactNumber;

function fallbackCopyText(text, callback) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        if (callback) callback();
    } catch (err) {
        showCsToast(`Nomor WhatsApp: ${text}`);
    }
    document.body.removeChild(textArea);
}

function showCsToast(message) {
    const toast = document.getElementById('cs-toast');
    const toastMsg = document.getElementById('cs-toast-msg');
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-8');
    toast.classList.add('opacity-100', 'translate-y-0');

    if (window.csToastTimeout) clearTimeout(window.csToastTimeout);
    window.csToastTimeout = setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-8');
    }, 2800);
}
window.showCsToast = showCsToast;
