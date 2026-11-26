/**
 * ChargeUp Audio Synthesizer Engine (Web Audio API)
 * Generates futuristic sci-fi sound effects without external audio files.
 */
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.init();
    }

    init() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        } catch (e) {
            console.warn('Web Audio API not supported', e);
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    playClick() {
        if (!this.enabled || !this.ctx) return;
        this.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    playEject() {
        if (!this.enabled || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;

        // Mechanical latch unclick
        const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.04, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noiseBuffer.length; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1200;
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.2, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        whiteNoise.start(now);

        // Rising futuristic servo hum
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, now + 0.02);
        osc.frequency.exponentialRampToValueAtTime(680, now + 0.25);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
    }

    playDock() {
        if (!this.enabled || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;

        // Thud latch
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.12);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);

        // Chime confirmation
        setTimeout(() => {
            const chime = this.ctx.createOscillator();
            const chimeGain = this.ctx.createGain();
            chime.type = 'sine';
            chime.frequency.setValueAtTime(880, this.ctx.currentTime);
            chimeGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            chimeGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
            chime.connect(chimeGain);
            chimeGain.connect(this.ctx.destination);
            chime.start();
            chime.stop(this.ctx.currentTime + 0.35);
        }, 120);
    }

    playSuccess() {
        if (!this.enabled || !this.ctx) return;
        this.resume();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const now = this.ctx.currentTime + idx * 0.09;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.45);
        });
    }

    playScan() {
        if (!this.enabled || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1100, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.08);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
    }
}

window.sound = new SoundEngine();
