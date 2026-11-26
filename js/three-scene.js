/**
 * ChargeUp 3D Apple-Style Scrollytelling Visualizer
 * Model: 20.800 mAh Tabletop Smart Advertising Player & Power Bank
 * Enhanced with Dynamic Ads (6 Presets), Built-in Cables (Lightning & USB-C),
 * Curved Charging Dock Base, Top Dual USB Ports, and 360° Interactive Controls.
 */

class ChargeUpProduct3D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;

        this.mainGroup = new THREE.Group();
        this.powerBankGroup = new THREE.Group();
        this.dockBaseGroup = new THREE.Group();
        this.unitGroup = new THREE.Group();

        // Texture Loader
        this.textureLoader = new THREE.TextureLoader();

        // Preload watch ad image if available
        this.watchImg = new Image();
        this.watchImg.src = 'assets/product/ad_watch_screen.jpg';
        this.watchImg.onload = () => {
            if (this.currentAdIndex === 4) {
                this.drawScreenCanvas();
            }
        };

        // Screen texture canvas for High-Res 7-inch Vertical Display (512 x 768)
        this.screenCanvas = document.createElement('canvas');
        this.screenCanvas.width = 512;
        this.screenCanvas.height = 768;
        this.screenCtx = this.screenCanvas.getContext('2d');
        this.screenTexture = new THREE.CanvasTexture(this.screenCanvas);

        // Auto-rotation state
        this.isAutoRotating = true;
        this.isUserInteracting = false;
        this.autoRotateSpeed = 0.007;

        // Ads Data (6 Presets matching the prototype video and uploaded photos)
        this.currentAdIndex = 0;
        this.ads = [
            {
                id: 1,
                name: "Iklan 1",
                badge: "OFFICIAL NETWORK",
                org: "CHARGEUP MALANG",
                title: "STAY CHARGED",
                sub: "Sewa Power Bank Pintar • Rp5.000/Jam",
                qrText: "SCAN SEWA QRIS",
                color: "#00f2fe",
                bgGradient: ["#020b1e", "#002a4d", "#001428"]
            },
            {
                id: 2,
                name: "Iklan 2",
                badge: "MITRA UMKM",
                org: "KOPI SENJA",
                title: "DISKON 20%",
                sub: "Khusus Mahasiswa UB, UM & UIN",
                qrText: "KLAIM VOUCHER NGOPI",
                color: "#f59e0b",
                bgGradient: ["#1e1005", "#3d1e08", "#120802"]
            },
            {
                id: 3,
                name: "Iklan 3",
                badge: "ORGANISASI",
                org: "HIMA TEKNIK",
                title: "OPEN RECRUITMENT",
                sub: "Kabinet Sinergi 2026 • Join The Future",
                qrText: "DAFTAR SEKARANG",
                color: "#38bdf8",
                bgGradient: ["#031738", "#08336d", "#020f26"]
            },
            {
                id: 4,
                name: "Iklan 4",
                badge: "EVENT AKADEMIK",
                org: "SEMINAR NASIONAL",
                title: "TEKNOLOGI & KARIER",
                sub: "Membangun Startup di Era AI Modern",
                qrText: "AMANKAN TIKET",
                color: "#10b981",
                bgGradient: ["#022616", "#044d2e", "#01170d"]
            },
            {
                id: 5,
                name: "Iklan 5",
                badge: "BRAND SPONSOR",
                org: "PRESTIGE WATCH",
                title: "EXCLUSIVE CHRONO",
                sub: "Special 30% Student Privilege",
                qrText: "LIHAT KATALOG",
                color: "#e2e8f0",
                bgGradient: ["#080808", "#1c1c1c", "#050505"],
                usePhoto: true
            },
            {
                id: 6,
                name: "Iklan 6",
                badge: "EVENT BEM",
                org: "BEM KAMPUS 2026",
                title: "EXPO KARIR & BISNIS",
                sub: "50+ Perusahaan Mitra & Workshop",
                qrText: "DAFTAR EXPO BEM",
                color: "#a855f7",
                bgGradient: ["#1c0438", "#3f0a7d", "#120224"]
            }
        ];

        // Campus Color Themes
        this.campusThemes = {
            'UB': {
                name: 'Brawijaya Blue (UB)',
                bodyColor: 0x0a1324,
                accentColor: 0x0284c7,
                ringColor: 0x38bdf8,
                ledColor: 0x00f2fe,
                glowHex: '#38bdf8'
            },
            'UM': {
                name: 'Cakrawala Mint (UM)',
                bodyColor: 0x04241c,
                accentColor: 0x059669,
                ringColor: 0x34d399,
                ledColor: 0x10b981,
                glowHex: '#10b981'
            },
            'UIN': {
                name: 'Maliki Violet (UIN)',
                bodyColor: 0x1a0b36,
                accentColor: 0x7c3aed,
                ringColor: 0xc084fc,
                ledColor: 0xa855f7,
                glowHex: '#a855f7'
            },
            'STEALTH': {
                name: 'Cyber Stealth Obsidian',
                bodyColor: 0x090d16,
                accentColor: 0x334155,
                ringColor: 0x64748b,
                ledColor: 0x38bdf8,
                glowHex: '#94a3b8'
            }
        };
        this.currentTheme = 'UB';

        this.init();
        this.setupLights();
        this.buildPowerBankModel();
        this.buildChargingDockBase();
        this.buildNeonAuraRing();
        this.buildParticles();
        this.drawScreenCanvas();
        this.setupScrollAnimation();
        this.setupEvents();
        this.animate();
    }

    init() {
        const w = this.container.clientWidth || window.innerWidth;
        const h = this.container.clientHeight || window.innerHeight;

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
        this.camera.position.set(0, 0.3, 5.2);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(w, h);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.35;
        this.container.appendChild(this.renderer.domElement);

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = false;
        this.controls.maxPolarAngle = Math.PI / 1.7;
        this.controls.minPolarAngle = Math.PI / 3.2;
        this.controls.target.set(0, 0, 0);

        this.controls.addEventListener('start', () => {
            this.isUserInteracting = true;
        });

        this.controls.addEventListener('end', () => {
            // Resume auto-rotation smoothly after 2.5s if enabled
            setTimeout(() => {
                this.isUserInteracting = false;
            }, 2500);
        });

        this.scene.add(this.mainGroup);
        this.mainGroup.add(this.powerBankGroup);
        this.powerBankGroup.add(this.unitGroup);
        this.powerBankGroup.add(this.dockBaseGroup);
    }

    setupLights() {
        const ambient = new THREE.AmbientLight(0x0f172a, 2.5);
        this.scene.add(ambient);

        this.keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
        this.keyLight.position.set(4, 5, 5);
        this.keyLight.castShadow = true;
        this.scene.add(this.keyLight);

        this.rimLight = new THREE.DirectionalLight(0x38bdf8, 3.8);
        this.rimLight.position.set(-5, 4, -4);
        this.scene.add(this.rimLight);

        this.fillLight = new THREE.PointLight(0x00f2fe, 2.0, 10);
        this.fillLight.position.set(0, -1.8, 3.2);
        this.scene.add(this.fillLight);

        this.dockLight = new THREE.PointLight(0x38bdf8, 1.5, 5);
        this.dockLight.position.set(0, -1.5, 0.5);
        this.scene.add(this.dockLight);
    }

    buildPowerBankModel() {
        // Table Advertising Player Unit Dimensions
        const width = 1.48;
        const height = 2.65;
        const depth = 0.42;
        const radius = 0.14;

        // --- 1. CHASSIS BODY (Extruded Rounded Rectangle with Bevel) ---
        const shape = new THREE.Shape();
        const x = -width / 2;
        const y = -height / 2;
        const w = width;
        const h = height;
        const r = radius;

        shape.moveTo(x + r, y);
        shape.lineTo(x + w - r, y);
        shape.quadraticCurveTo(x + w, y, x + w, y + r);
        shape.lineTo(x + w, y + h - r);
        shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        shape.lineTo(x + r, y + h);
        shape.quadraticCurveTo(x, y + h, x, y + h - r);
        shape.lineTo(x, y + r);
        shape.quadraticCurveTo(x, y, x + r, y);

        const extrudeSettings = {
            depth: depth,
            bevelEnabled: true,
            bevelSegments: 6,
            steps: 2,
            bevelSize: 0.035,
            bevelThickness: 0.035
        };

        const bodyGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        bodyGeo.center();

        this.bodyMaterial = new THREE.MeshStandardMaterial({
            color: this.campusThemes[this.currentTheme].bodyColor,
            metalness: 0.86,
            roughness: 0.22,
            envMapIntensity: 1.5
        });

        this.bodyMesh = new THREE.Mesh(bodyGeo, this.bodyMaterial);
        this.bodyMesh.castShadow = true;
        this.bodyMesh.receiveShadow = true;
        this.unitGroup.add(this.bodyMesh);

        // --- 2. FRONT FACE: SCREEN BEZEL & 7-INCH VERTICAL DIGITAL DISPLAY ---
        const screenBezelGeo = new THREE.PlaneGeometry(width * 0.92, height * 0.72);
        const screenBezelMat = new THREE.MeshStandardMaterial({
            color: 0x05070d,
            roughness: 0.2,
            metalness: 0.5
        });
        const screenBezel = new THREE.Mesh(screenBezelGeo, screenBezelMat);
        screenBezel.position.set(0, 0.26, depth / 2 + 0.038);
        this.unitGroup.add(screenBezel);

        // Active Canvas Display Plane
        const screenPlaneGeo = new THREE.PlaneGeometry(width * 0.86, height * 0.67);
        this.screenMaterial = new THREE.MeshBasicMaterial({
            map: this.screenTexture,
            toneMapped: false
        });
        this.screenMesh = new THREE.Mesh(screenPlaneGeo, this.screenMaterial);
        this.screenMesh.position.set(0, 0.26, depth / 2 + 0.041);
        this.unitGroup.add(this.screenMesh);

        // Glossy Glass Reflection Layer over screen
        const glassGeo = new THREE.PlaneGeometry(width * 0.88, height * 0.69);
        const glassMat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.18,
            roughness: 0.05,
            metalness: 0.1,
            reflectivity: 0.9
        });
        const glassMesh = new THREE.Mesh(glassGeo, glassMat);
        glassMesh.position.set(0, 0.26, depth / 2 + 0.043);
        this.unitGroup.add(glassMesh);

        // --- 3. LOWER FRONT BRANDING: CHARGEUP LOGO & STATUS BAR ---
        const logoPlateGeo = new THREE.PlaneGeometry(width * 0.86, 0.44);
        const logoPlateMat = new THREE.MeshStandardMaterial({
            color: 0x0b0f19,
            roughness: 0.3,
            metalness: 0.7
        });
        const logoPlate = new THREE.Mesh(logoPlateGeo, logoPlateMat);
        logoPlate.position.set(0, -0.88, depth / 2 + 0.039);
        this.unitGroup.add(logoPlate);

        // Glowing LED Indicator Strip on bottom of front plate
        const ledStripGeo = new THREE.BoxGeometry(width * 0.75, 0.02, 0.015);
        this.ledStripMat = new THREE.MeshBasicMaterial({
            color: this.campusThemes[this.currentTheme].ledColor
        });
        this.ledStripMesh = new THREE.Mesh(ledStripGeo, this.ledStripMat);
        this.ledStripMesh.position.set(0, -1.06, depth / 2 + 0.045);
        this.unitGroup.add(this.ledStripMesh);

        // --- 4. BACKPLATE: BRUSHED SILVER METALLIC FINISH (As seen in Video & Duo Photo) ---
        const backPlateGeo = new THREE.PlaneGeometry(width * 0.94, height * 0.94);
        this.backPlateMat = new THREE.MeshStandardMaterial({
            color: 0xd4d4d8,
            metalness: 0.92,
            roughness: 0.22,
            envMapIntensity: 1.8,
            side: THREE.DoubleSide
        });
        const backPlate = new THREE.Mesh(backPlateGeo, this.backPlateMat);
        backPlate.position.set(0, 0, -depth / 2 - 0.038);
        this.unitGroup.add(backPlate);

        // Back Dual Magnetic Qi Wireless Inductive Ring (Fast 15W Charging)
        const ringOuterGeo = new THREE.RingGeometry(0.38, 0.44, 48);
        this.ringOuterMat = new THREE.MeshBasicMaterial({
            color: this.campusThemes[this.currentTheme].ringColor,
            side: THREE.DoubleSide
        });
        const ringOuter = new THREE.Mesh(ringOuterGeo, this.ringOuterMat);
        ringOuter.position.set(0, 0.2, -depth / 2 - 0.041);
        this.unitGroup.add(ringOuter);

        const ringInnerGeo = new THREE.RingGeometry(0.12, 0.16, 32);
        const ringInnerMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide
        });
        const ringInner = new THREE.Mesh(ringInnerGeo, ringInnerMat);
        ringInner.position.set(0, 0.2, -depth / 2 - 0.042);
        this.unitGroup.add(ringInner);

        // --- 5. TOP SURFACE: DUAL USB-A OUTPUT PORTS (As seen in Video) ---
        const topPortGeo = new THREE.BoxGeometry(0.24, 0.01, 0.11);
        const portInteriorMat = new THREE.MeshBasicMaterial({ color: 0x05070a });
        const portPinMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8, roughness: 0.2 });

        // Port 1 (Left Top)
        const port1 = new THREE.Mesh(topPortGeo, portInteriorMat);
        port1.position.set(-0.25, height / 2 + 0.035, 0);
        this.unitGroup.add(port1);

        const pin1 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.006, 0.04), portPinMat);
        pin1.position.set(-0.25, height / 2 + 0.036, 0.02);
        this.unitGroup.add(pin1);

        // Port 2 (Right Top)
        const port2 = new THREE.Mesh(topPortGeo, portInteriorMat);
        port2.position.set(0.25, height / 2 + 0.035, 0);
        this.unitGroup.add(port2);

        const pin2 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.006, 0.04), portPinMat);
        pin2.position.set(0.25, height / 2 + 0.036, 0.02);
        this.unitGroup.add(pin2);

        // --- 6. SIDE RECESSED GROOVES & DUAL BUILT-IN CABLES (As seen in Video & Photo) ---
        // Side Grooves
        const grooveGeo = new THREE.BoxGeometry(0.04, height * 0.72, depth * 0.45);
        const grooveMat = new THREE.MeshStandardMaterial({ color: 0x070b14, roughness: 0.5 });

        const leftGroove = new THREE.Mesh(grooveGeo, grooveMat);
        leftGroove.position.set(-width / 2 - 0.02, 0.1, 0);
        this.unitGroup.add(leftGroove);

        const rightGroove = new THREE.Mesh(grooveGeo, grooveMat);
        rightGroove.position.set(width / 2 + 0.02, 0.1, 0);
        this.unitGroup.add(rightGroove);

        // LEFT CABLE: WHITE LIGHTNING CABLE (Curves down naturally like in Video)
        const leftPoints = [
            new THREE.Vector3(-width / 2 - 0.02, 0.7, 0),
            new THREE.Vector3(-width / 2 - 0.06, -0.2, 0.05),
            new THREE.Vector3(-width / 2 - 0.12, -0.9, 0.12),
            new THREE.Vector3(-width / 2 - 0.08, -1.35, 0.18),
            new THREE.Vector3(-width / 2 + 0.05, -1.45, 0.22),
            new THREE.Vector3(-width / 2 + 0.14, -1.3, 0.25)
        ];
        const leftCurve = new THREE.CatmullRomCurve3(leftPoints);
        const leftCableGeo = new THREE.TubeGeometry(leftCurve, 40, 0.026, 8, false);
        this.cableLeftMat = new THREE.MeshStandardMaterial({
            color: 0xf1f5f9, // Clean Apple White
            roughness: 0.25,
            metalness: 0.1
        });
        const leftCableMesh = new THREE.Mesh(leftCableGeo, this.cableLeftMat);
        leftCableMesh.castShadow = true;
        this.unitGroup.add(leftCableMesh);

        // Left Lightning Connector Housing
        const lightningHeadGeo = new THREE.BoxGeometry(0.065, 0.14, 0.04);
        const lightningHeadMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
        const lightningHead = new THREE.Mesh(lightningHeadGeo, lightningHeadMat);
        lightningHead.position.set(-width / 2 + 0.15, -1.22, 0.26);
        lightningHead.rotation.z = -0.4;
        this.unitGroup.add(lightningHead);

        // Metal Lightning tip
        const lightningPinGeo = new THREE.BoxGeometry(0.035, 0.07, 0.015);
        const metalPinMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.95, roughness: 0.1 });
        const lightningPin = new THREE.Mesh(lightningPinGeo, metalPinMat);
        lightningPin.position.set(-width / 2 + 0.18, -1.13, 0.27);
        lightningPin.rotation.z = -0.4;
        this.unitGroup.add(lightningPin);

        // RIGHT CABLE: BLACK USB-C CABLE WITH CYAN PIN (As seen in Video & Photo)
        const rightPoints = [
            new THREE.Vector3(width / 2 + 0.02, 0.7, 0),
            new THREE.Vector3(width / 2 + 0.06, -0.2, 0.05),
            new THREE.Vector3(width / 2 + 0.12, -0.9, 0.12),
            new THREE.Vector3(width / 2 + 0.08, -1.35, 0.18),
            new THREE.Vector3(width / 2 - 0.05, -1.45, 0.22),
            new THREE.Vector3(width / 2 - 0.14, -1.3, 0.25)
        ];
        const rightCurve = new THREE.CatmullRomCurve3(rightPoints);
        const rightCableGeo = new THREE.TubeGeometry(rightCurve, 40, 0.026, 8, false);
        this.cableRightMat = new THREE.MeshStandardMaterial({
            color: 0x1e293b, // Stealth Cyber Black
            roughness: 0.35,
            metalness: 0.3
        });
        const rightCableMesh = new THREE.Mesh(rightCableGeo, this.cableRightMat);
        rightCableMesh.castShadow = true;
        this.unitGroup.add(rightCableMesh);

        // Right USB-C Connector Housing
        const usbcHeadGeo = new THREE.BoxGeometry(0.07, 0.15, 0.045);
        const usbcHeadMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.25, metalness: 0.6 });
        const usbcHead = new THREE.Mesh(usbcHeadGeo, usbcHeadMat);
        usbcHead.position.set(width / 2 - 0.15, -1.22, 0.26);
        usbcHead.rotation.z = 0.4;
        this.unitGroup.add(usbcHead);

        // USB-C Metallic Tip with Blue Accent Ring
        const usbcPinGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.06, 16);
        usbcPinGeo.scale(1.4, 1.0, 0.6);
        const usbcPin = new THREE.Mesh(usbcPinGeo, metalPinMat);
        usbcPin.position.set(width / 2 - 0.18, -1.13, 0.27);
        usbcPin.rotation.z = 0.4;
        this.unitGroup.add(usbcPin);

        // --- 7. SIDE INTERFACE: USB PORT, POWER BUTTON, 4 BATTERY LEDS (As seen in Photo) ---
        // Side USB Output Port on Right Lower Edge
        const sidePortGeo = new THREE.BoxGeometry(0.02, 0.16, 0.08);
        const sidePortMesh = new THREE.Mesh(sidePortGeo, portInteriorMat);
        sidePortMesh.position.set(width / 2 + 0.038, -0.7, 0);
        this.unitGroup.add(sidePortMesh);

        // Side Power Button
        const pwrBtnGeo = new THREE.BoxGeometry(0.015, 0.09, 0.04);
        const pwrBtnMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
        const pwrBtn = new THREE.Mesh(pwrBtnGeo, pwrBtnMat);
        pwrBtn.position.set(width / 2 + 0.038, -0.9, 0);
        this.unitGroup.add(pwrBtn);

        // 4 Micro LED Indicators
        this.microLeds = [];
        for (let i = 0; i < 4; i++) {
            const ledGeo = new THREE.SphereGeometry(0.012, 12, 12);
            const ledMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
            const ledMesh = new THREE.Mesh(ledGeo, ledMat);
            ledMesh.position.set(width / 2 + 0.038, -1.02 - (i * 0.035), 0);
            this.unitGroup.add(ledMesh);
            this.microLeds.push(ledMesh);
        }

        // Lift unit slightly above origin so dock base fits cleanly underneath
        this.unitGroup.position.y = 0.35;
        this.unitGroup.rotation.set(0.08, -0.22, 0.02);
    }

    buildChargingDockBase() {
        // Charging Dock Base matching the uploaded authentic photo
        // Curved aerodynamic flared base that supports the standing table player
        const baseWidthTop = 1.7;
        const baseWidthBottom = 2.15;
        const baseDepthTop = 0.75;
        const baseDepthBottom = 1.25;
        const baseHeight = 0.38;

        const dockGeo = new THREE.CylinderGeometry(baseWidthTop / 2, baseWidthBottom / 2, baseHeight, 32);
        dockGeo.scale(1.0, 1.0, baseDepthBottom / baseWidthBottom);

        this.dockBaseMat = new THREE.MeshStandardMaterial({
            color: 0x090d16,
            metalness: 0.88,
            roughness: 0.25,
            envMapIntensity: 1.6
        });

        this.dockBaseMesh = new THREE.Mesh(dockGeo, this.dockBaseMat);
        this.dockBaseMesh.position.set(0, -1.18, 0);
        this.dockBaseMesh.castShadow = true;
        this.dockBaseMesh.receiveShadow = true;
        this.dockBaseGroup.add(this.dockBaseMesh);

        // Front Bevel Lip of Dock Base
        const lipGeo = new THREE.BoxGeometry(1.6, 0.06, 0.35);
        const lipMat = new THREE.MeshStandardMaterial({
            color: 0x0f172a,
            roughness: 0.3,
            metalness: 0.7
        });
        const lipMesh = new THREE.Mesh(lipGeo, lipMat);
        lipMesh.position.set(0, -1.05, 0.4);
        lipMesh.rotation.x = 0.25;
        this.dockBaseGroup.add(lipMesh);

        // Dock Front Air Grille Slots (Matching authentic product photo)
        const grilleMat = new THREE.MeshBasicMaterial({ color: 0x020617 });
        for (let i = 0; i < 4; i++) {
            const grilleSlot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.015, 0.02), grilleMat);
            grilleSlot.position.set(-0.35 + (i * 0.23), -1.12, 0.52);
            this.dockBaseGroup.add(grilleSlot);
        }

        // Circular Side Speaker / Ventilation Mesh on Dock Base
        const ventMat = new THREE.MeshBasicMaterial({ color: 0x020617 });
        const leftVent = new THREE.Mesh(new THREE.CircleGeometry(0.1, 16), ventMat);
        leftVent.position.set(-0.85, -1.22, 0.15);
        leftVent.rotation.y = -Math.PI / 2;
        this.dockBaseGroup.add(leftVent);

        const rightVent = new THREE.Mesh(new THREE.CircleGeometry(0.1, 16), ventMat);
        rightVent.position.set(0.85, -1.22, 0.15);
        rightVent.rotation.y = Math.PI / 2;
        this.dockBaseGroup.add(rightVent);

        // Dock Base Ambient Underglow Strip
        const underglowGeo = new THREE.RingGeometry(0.85, 0.98, 32);
        this.underglowMat = new THREE.MeshBasicMaterial({
            color: this.campusThemes[this.currentTheme].accentColor,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.45
        });
        const underglow = new THREE.Mesh(underglowGeo, this.underglowMat);
        underglow.rotation.x = Math.PI / 2;
        underglow.position.set(0, -1.36, 0);
        this.dockBaseGroup.add(underglow);

        // Charging Contact Pogo Pins in the dock slot
        const pinMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.1 });
        for (let i = 0; i < 4; i++) {
            const pogoPin = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.04, 12), pinMat);
            pogoPin.position.set(-0.15 + (i * 0.1), -0.98, 0);
            this.dockBaseGroup.add(pogoPin);
        }
    }

    buildNeonAuraRing() {
        // Glowing Neon Ring in the background
        const ringGeo = new THREE.RingGeometry(1.9, 1.98, 64);
        this.auraMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.35
        });
        this.auraRing = new THREE.Mesh(ringGeo, this.auraMat);
        this.auraRing.position.set(0, 0, -1.2);
        this.mainGroup.add(this.auraRing);
    }

    buildParticles() {
        const count = 120;
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 9;
            positions[i + 1] = (Math.random() - 0.5) * 9;
            positions[i + 2] = (Math.random() - 0.5) * 6;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const mat = new THREE.PointsMaterial({
            color: 0x38bdf8,
            size: 0.038,
            transparent: true,
            opacity: 0.65,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geo, mat);
        this.scene.add(this.particles);
    }

    drawScreenCanvas() {
        const ctx = this.screenCtx;
        const w = this.screenCanvas.width;
        const h = this.screenCanvas.height;
        const ad = this.ads[this.currentAdIndex];
        const theme = this.campusThemes[this.currentTheme];

        // Background Gradient
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, ad.bgGradient[0]);
        grad.addColorStop(0.5, ad.bgGradient[1]);
        grad.addColorStop(1, ad.bgGradient[2]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Subtle Cyber Grid Pattern
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 32) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += 32) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // --- TOP STATUS BAR ---
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, w, 52);

        // OS Logo & Station ID
        ctx.fillStyle = ad.color;
        ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('⚡ ChargeUp OS', 24, 34);

        // Time
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 20px monospace';
        ctx.fillText(timeStr, w / 2 - 26, 34);

        // Battery
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 20px monospace';
        ctx.fillText('100% 🔋', w - 120, 34);

        // --- AD CARD CONTAINER ---
        const cardX = 22;
        const cardY = 72;
        const cardW = w - 44;
        const cardH = h - 94;

        ctx.fillStyle = 'rgba(10, 16, 30, 0.85)';
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, 24);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Top Accent Color Bar
        ctx.fillStyle = ad.color;
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, 8, [24, 24, 0, 0]);
        ctx.fill();

        // Badge Pill
        ctx.fillStyle = ad.color;
        ctx.beginPath();
        ctx.roundRect(44, 98, 140, 34, 8);
        ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.font = '900 14px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(ad.badge, 54, 121);

        // Organization Name
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(ad.org, 202, 121);

        // Check if this ad uses the cropped watch photo
        if (ad.usePhoto && this.watchImg && this.watchImg.complete && this.watchImg.naturalWidth > 0) {
            // Draw Watch Image
            const imgW = 320;
            const imgH = 340;
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(w / 2 - imgW / 2, 150, imgW, imgH, 16);
            ctx.clip();
            ctx.drawImage(this.watchImg, w / 2 - imgW / 2, 150, imgW, imgH);
            ctx.restore();

            // Watch Title & Subtitle below
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 32px "Plus Jakarta Sans", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(ad.title, w / 2, 530);

            ctx.fillStyle = ad.color;
            ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(ad.sub, w / 2, 565);
            ctx.textAlign = 'left';
        } else {
            // Standard Editorial Ad Layout
            // Headline Title
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 38px "Plus Jakarta Sans", sans-serif';
            const lines = ad.title.split(' & ');
            if (lines.length > 1) {
                ctx.fillText(lines[0] + ' &', 44, 185);
                ctx.fillText(lines[1], 44, 230);
            } else {
                ctx.fillText(ad.title, 44, 195);
            }

            // Subtitle
            ctx.fillStyle = ad.color;
            ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(ad.sub, 44, 275);

            // Campus Area Tag
            ctx.fillStyle = '#94a3b8';
            ctx.font = '500 16px monospace';
            ctx.fillText('📍 ' + (ad.tag || 'UB • UM • UIN MALANG INTEGRATED'), 44, 315);

            // Visual Graphic / Mock QR Display
            this.drawRealisticQRCode(ctx, w / 2 - 110, 360, 220, ad.color);

            // QR Callout Badge
            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.beginPath();
            ctx.roundRect(w / 2 - 130, 605, 260, 42, 12);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('📱 ' + ad.qrText, w / 2, 632);
            ctx.textAlign = 'left';
        }

        // Bottom Footer
        ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
        ctx.font = '13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CHARGEUP SMART SCREEN ADVERTISING • 20.800 mAh', w / 2, h - 36);
        ctx.textAlign = 'left';

        this.screenTexture.needsUpdate = true;
    }

    drawRealisticQRCode(ctx, x, y, size, accentColor) {
        // High-contrast clean QR block with cyber framing
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(x, y, size, size, 16);
        ctx.fill();

        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 4;
        ctx.stroke();

        // Draw Stylized QR Data Grid
        const pad = 18;
        const innerSize = size - pad * 2;
        const cells = 15;
        const cellSize = innerSize / cells;

        ctx.fillStyle = '#05070f';

        // Finder patterns (Corner Squares)
        this.drawFinderSquare(ctx, x + pad, y + pad, cellSize * 4.5);
        this.drawFinderSquare(ctx, x + size - pad - cellSize * 4.5, y + pad, cellSize * 4.5);
        this.drawFinderSquare(ctx, x + pad, y + size - pad - cellSize * 4.5, cellSize * 4.5);

        // Pseudorandom internal data points based on ad index
        const seed = (this.currentAdIndex + 1) * 137;
        for (let r = 0; r < cells; r++) {
            for (let c = 0; c < cells; c++) {
                // Avoid corners with finder squares
                if ((r < 5 && c < 5) || (r < 5 && c > 9) || (r > 9 && c < 5)) continue;
                const val = Math.sin(seed + r * 17 + c * 31);
                if (val > -0.15) {
                    ctx.fillRect(
                        x + pad + c * cellSize + 1,
                        y + pad + r * cellSize + 1,
                        cellSize - 2,
                        cellSize - 2
                    );
                }
            }
        }

        // Center mini icon badge
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.font = '900 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚡', x + size / 2, y + size / 2 + 5);
        ctx.textAlign = 'left';
    }

    drawFinderSquare(ctx, x, y, size) {
        ctx.fillStyle = '#05070f';
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + size * 0.22, y + size * 0.22, size * 0.56, size * 0.56);
        ctx.fillStyle = '#05070f';
        ctx.fillRect(x + size * 0.38, y + size * 0.38, size * 0.24, size * 0.24);
    }

    switchAd(index) {
        if (index !== undefined) {
            this.currentAdIndex = index % this.ads.length;
        } else {
            this.currentAdIndex = (this.currentAdIndex + 1) % this.ads.length;
        }
        this.drawScreenCanvas();
        if (window.sound) window.sound.playClick();
    }

    toggleAutoRotate() {
        this.isAutoRotating = !this.isAutoRotating;
        if (window.sound) window.sound.playClick();
        return this.isAutoRotating;
    }

    resetView() {
        if (window.gsap) {
            gsap.to(this.unitGroup.rotation, { x: 0.08, y: -0.22, z: 0.02, duration: 1.0, ease: "power2.out" });
            gsap.to(this.powerBankGroup.rotation, { x: 0, y: 0, z: 0, duration: 1.0, ease: "power2.out" });
            gsap.to(this.camera.position, { x: 0, y: 0.3, z: 5.2, duration: 1.0, ease: "power2.out" });
        } else {
            this.unitGroup.rotation.set(0.08, -0.22, 0.02);
            this.powerBankGroup.rotation.set(0, 0, 0);
            this.camera.position.set(0, 0.3, 5.2);
        }
        if (window.sound) window.sound.playClick();
    }

    setCampusTheme(campusKey) {
        if (!this.campusThemes[campusKey]) return;
        this.currentTheme = campusKey;
        const theme = this.campusThemes[campusKey];

        if (window.gsap) {
            gsap.to(this.bodyMaterial.color, {
                r: ((theme.bodyColor >> 16) & 255) / 255,
                g: ((theme.bodyColor >> 8) & 255) / 255,
                b: (theme.bodyColor & 255) / 255,
                duration: 0.6
            });
            gsap.to(this.ledStripMat.color, {
                r: ((theme.ledColor >> 16) & 255) / 255,
                g: ((theme.ledColor >> 8) & 255) / 255,
                b: (theme.ledColor & 255) / 255,
                duration: 0.6
            });
            gsap.to(this.ringOuterMat.color, {
                r: ((theme.ringColor >> 16) & 255) / 255,
                g: ((theme.ringColor >> 8) & 255) / 255,
                b: (theme.ringColor & 255) / 255,
                duration: 0.6
            });
            gsap.to(this.underglowMat.color, {
                r: ((theme.accentColor >> 16) & 255) / 255,
                g: ((theme.accentColor >> 8) & 255) / 255,
                b: (theme.accentColor & 255) / 255,
                duration: 0.6
            });
            gsap.to(this.auraMat.color, {
                r: ((theme.ringColor >> 16) & 255) / 255,
                g: ((theme.ringColor >> 8) & 255) / 255,
                b: (theme.ringColor & 255) / 255,
                duration: 0.6
            });
            gsap.to(this.rimLight.color, {
                r: ((theme.ringColor >> 16) & 255) / 255,
                g: ((theme.ringColor >> 8) & 255) / 255,
                b: (theme.ringColor & 255) / 255,
                duration: 0.6
            });
        } else {
            this.bodyMaterial.color.setHex(theme.bodyColor);
            this.ledStripMat.color.setHex(theme.ledColor);
            this.ringOuterMat.color.setHex(theme.ringColor);
            this.underglowMat.color.setHex(theme.accentColor);
            this.auraMat.color.setHex(theme.ringColor);
            this.rimLight.color.setHex(theme.ringColor);
        }

        this.drawScreenCanvas();
        if (window.sound) window.sound.playClick();
    }

    setupScrollAnimation() {
        if (!window.gsap || !window.ScrollTrigger) return;

        gsap.registerPlugin(ScrollTrigger);

        const pb = this.powerBankGroup;
        const unit = this.unitGroup;
        const cam = this.camera;

        // SCENE 1: SIDE VIEW (Dual Built-in Cables: Lightning Putih & USB-C Hitam + 20.800 mAh Capacity)
        ScrollTrigger.create({
            trigger: '#scroll-step-1',
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1.2,
            onEnter: () => {
                gsap.to(unit.rotation, { x: 0, y: Math.PI / 2 - 0.28, z: 0.05, duration: 1.2, ease: "power2.out" });
                gsap.to(pb.position, { x: -1.2, y: -0.1, z: 0.8, duration: 1.2, ease: "power2.out" });
                gsap.to(cam.position, { x: 0, y: 0.2, z: 4.6, duration: 1.2 });
            },
            onEnterBack: () => {
                gsap.to(unit.rotation, { x: 0, y: Math.PI / 2 - 0.28, z: 0.05, duration: 1.2, ease: "power2.out" });
                gsap.to(pb.position, { x: -1.2, y: -0.1, z: 0.8, duration: 1.2, ease: "power2.out" });
            }
        });

        // SCENE 2: DISPLAY ZOOM (7-Inch Vertical Smart Advertising Screen & 6 Dynamic Ads)
        ScrollTrigger.create({
            trigger: '#scroll-step-2',
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1.2,
            onEnter: () => {
                gsap.to(unit.rotation, { x: 0.06, y: -0.05, z: 0, duration: 1.2, ease: "power2.out" });
                gsap.to(pb.position, { x: 0.95, y: -0.2, z: 1.7, duration: 1.2, ease: "power2.out" });
                gsap.to(cam.position, { x: 0, y: 0.2, z: 3.9, duration: 1.2 });
            },
            onEnterBack: () => {
                gsap.to(unit.rotation, { x: 0.06, y: -0.05, z: 0, duration: 1.2, ease: "power2.out" });
                gsap.to(pb.position, { x: 0.95, y: -0.2, z: 1.7, duration: 1.2, ease: "power2.out" });
            }
        });

        // SCENE 3: BACK & QI WIRELESS (Silver Brushed Backplate + Dual USB Top Ports)
        ScrollTrigger.create({
            trigger: '#scroll-step-3',
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1.2,
            onEnter: () => {
                gsap.to(unit.rotation, { x: 0.14, y: Math.PI + 0.22, z: -0.06, duration: 1.2, ease: "power2.out" });
                gsap.to(pb.position, { x: -1.05, y: -0.05, z: 1.1, duration: 1.2, ease: "power2.out" });
                gsap.to(cam.position, { x: 0, y: 0.2, z: 4.5, duration: 1.2 });
            },
            onEnterBack: () => {
                gsap.to(unit.rotation, { x: 0.14, y: Math.PI + 0.22, z: -0.06, duration: 1.2, ease: "power2.out" });
                gsap.to(pb.position, { x: -1.05, y: -0.05, z: 1.1, duration: 1.2, ease: "power2.out" });
            }
        });

        // SCENE 4: CAMPUS SWATCH CUSTOMIZER
        ScrollTrigger.create({
            trigger: '#scroll-step-4',
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1.2,
            onEnter: () => {
                gsap.to(unit.rotation, { x: 0.22, y: -0.38, z: 0.08, duration: 1.2, ease: "power2.out" });
                gsap.to(pb.position, { x: 1.1, y: -0.1, z: 0.7, duration: 1.2, ease: "power2.out" });
                gsap.to(cam.position, { x: 0, y: 0.3, z: 4.8, duration: 1.2 });
            },
            onEnterBack: () => {
                gsap.to(unit.rotation, { x: 0.22, y: -0.38, z: 0.08, duration: 1.2, ease: "power2.out" });
                gsap.to(pb.position, { x: 1.1, y: -0.1, z: 0.7, duration: 1.2, ease: "power2.out" });
            }
        });

        // SCENE 5: RENTAL PRICING & ENDURANCE (Rp5.000 / Jam)
        ScrollTrigger.create({
            trigger: '#scroll-step-5',
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1.2,
            onEnter: () => {
                gsap.to(unit.rotation, { x: 0.12, y: -0.15, z: 0, duration: 1.2, ease: "power2.out" });
                gsap.to(pb.position, { x: 0, y: -0.15, z: 0.4, duration: 1.2, ease: "power2.out" });
                gsap.to(cam.position, { x: 0, y: 0.3, z: 5.1, duration: 1.2 });
            },
            onEnterBack: () => {
                gsap.to(unit.rotation, { x: 0.12, y: -0.15, z: 0, duration: 1.2, ease: "power2.out" });
                gsap.to(pb.position, { x: 0, y: -0.15, z: 0.4, duration: 1.2, ease: "power2.out" });
            }
        });
    }

    setupEvents() {
        window.addEventListener('resize', () => {
            if (!this.container) return;
            const w = this.container.clientWidth;
            const h = this.container.clientHeight;
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(w, h);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = performance.now() * 0.001;

        // Auto-rotation when not dragging
        if (this.isAutoRotating && !this.isUserInteracting && this.unitGroup) {
            this.unitGroup.rotation.y += this.autoRotateSpeed;
        }

        // Floating hover effect
        if (this.powerBankGroup) {
            this.powerBankGroup.position.y += Math.sin(time * 1.8) * 0.0008;
        }

        if (this.auraRing) {
            this.auraRing.rotation.z = time * 0.1;
        }

        if (this.particles) {
            this.particles.rotation.y = time * 0.02;
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

window.ChargeUpProduct3D = ChargeUpProduct3D;
