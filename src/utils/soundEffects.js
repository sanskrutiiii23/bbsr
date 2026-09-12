// Web Audio API procedural sound engine & synthesizer for Life RPG
// Features Studio Dynamics Compressor, Procedural Multi-Theme BGM, and Tactical SFX
// Zero external sound asset dependencies, ultra-fast, zero lag, zero bandwidth.

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.compressor = null;
    this.bgmGain = null;
    this.sfxGain = null;

    this.muted = localStorage.getItem('life_rpg_muted') === 'true';
    this.bgmVolume = parseFloat(localStorage.getItem('life_rpg_bgm_vol') || '0.7');
    this.isPlayingBgm = false;
    this.currentBgmTheme = null;

    this.activeBgNodes = [];
    this.bgmInterval = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // Studio Mastering Dynamics Compressor
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-12, this.ctx.currentTime); // dB
        this.compressor.knee.setValueAtTime(20, this.ctx.currentTime); // dB
        this.compressor.ratio.setValueAtTime(3.5, this.ctx.currentTime);
        this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
        this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

        // Master Gain Stage (Up to 2.0x volume boost)
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.muted ? 0 : 1.0, this.ctx.currentTime);

        // BGM Gain Stage
        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);

        // SFX Gain Stage
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(1.0, this.ctx.currentTime);

        // Routing graph:
        // Sources -> [bgmGain / sfxGain] -> compressor -> masterGain -> destination
        this.bgmGain.connect(this.compressor);
        this.sfxGain.connect(this.compressor);
        this.compressor.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('life_rpg_muted', this.muted);
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.muted ? 0 : 1.0, this.ctx.currentTime, 0.05);
    }
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  setBgmVolume(val) {
    // val between 0.0 and 2.0
    this.bgmVolume = Math.max(0, Math.min(2.0, val));
    localStorage.setItem('life_rpg_bgm_vol', this.bgmVolume.toString());
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setTargetAtTime(this.bgmVolume, this.ctx.currentTime, 0.05);
    }
  }

  getBgmVolume() {
    return this.bgmVolume;
  }

  isBgmPlaying() {
    return this.isPlayingBgm;
  }

  // ==========================================
  // PROCEDURAL BACKGROUND MUSIC (BGM)
  // ==========================================
  toggleBGM(theme = 'forest') {
    this.init();
    if (this.isPlayingBgm) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM(theme);
      return true;
    }
  }

  stopBGM() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }

    if (this.activeBgNodes.length > 0) {
      const now = this.ctx ? this.ctx.currentTime : 0;
      this.activeBgNodes.forEach((node) => {
        try {
          if (node.gain) {
            node.gain.gain.setTargetAtTime(0, now, 0.2);
            setTimeout(() => {
              try { node.stop(); node.disconnect(); } catch (e) {}
            }, 300);
          } else {
            node.stop();
            node.disconnect();
          }
        } catch (e) {}
      });
      this.activeBgNodes = [];
    }

    this.isPlayingBgm = false;
    this.currentBgmTheme = null;
  }

  startBGM(theme = 'forest') {
    this.init();
    if (!this.ctx) return;

    if (this.isPlayingBgm) {
      this.stopBGM();
    }

    this.isPlayingBgm = true;
    this.currentBgmTheme = theme;

    if (theme === 'samurai') {
      this._startSamuraiBGM();
    } else if (theme === 'city') {
      this._startCityBGM();
    } else {
      this._startForestBGM();
    }
  }

  // THEME D: Enchanted Forest (Crystalline Glass Pad, Breath LFO, Celtic Harp)
  _startForestBGM() {
    const chord = [146.83, 220.00, 293.66, 369.99, 440.00]; // D, A, D, F#, A
    const padGain = this.ctx.createGain();
    padGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    padGain.connect(this.bgmGain);

    // Filter with 0.15Hz Breathing LFO
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, this.ctx.currentTime);
    filter.connect(padGain);

    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(500, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    this.activeBgNodes.push(lfo);

    chord.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 1.5, this.ctx.currentTime);
      osc.connect(filter);
      osc.start();
      this.activeBgNodes.push(osc);
    });

    // Bardic Harp / Flute Arpeggiator (380ms cadence)
    const arpNotes = [293.66, 440.00, 587.33, 739.99, 880.00, 587.33, 440.00];
    let step = 0;
    this.bgmInterval = setInterval(() => {
      if (!this.isPlayingBgm || this.muted || !this.ctx) return;
      const freq = arpNotes[step % arpNotes.length];
      step++;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(this.bgmGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.45);
    }, 380);
  }

  // THEME E: Last Samurai Standing (Taiko Deep Gong Drone, Hirajōshi Scale, Shakuhachi Wind)
  _startSamuraiBGM() {
    // Deep Taiko / Gong drone: 55Hz (A1) & 110Hz (A2)
    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    droneGain.connect(this.bgmGain);

    [55, 110, 164.81].forEach((freq) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.connect(droneGain);
      osc.start();
      this.activeBgNodes.push(osc);
    });

    // Japanese Hirajōshi pentatonic scale sequence: A3, Bb3, D4, E4, F4, A4
    const hirajoshi = [220.00, 233.08, 293.66, 329.63, 349.23, 440.00, 587.33];
    let step = 0;
    this.bgmInterval = setInterval(() => {
      if (!this.isPlayingBgm || this.muted || !this.ctx) return;
      const freq = hirajoshi[step % hirajoshi.length];
      step++;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.55);

      osc.connect(gain);
      gain.connect(this.bgmGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.55);
    }, 420);
  }

  // THEME F: Build Your City (Cyberpunk Poly-Synth Pad, Resonant LFO, Sub-Bass & 16th Arpeggiator)
  _startCityBGM() {
    // 5-voice detuned poly-synth pad in D minor 9: D3, F3, A3, C4, E4
    const chord = [146.83, 174.61, 220.00, 261.63, 329.63];
    const padGain = this.ctx.createGain();
    padGain.gain.setValueAtTime(0.07, this.ctx.currentTime);
    padGain.connect(this.bgmGain);

    // Resonant lowpass filter swept by 0.25Hz LFO (±700Hz sweep)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, this.ctx.currentTime);
    filter.Q.setValueAtTime(3.5, this.ctx.currentTime);
    filter.connect(padGain);

    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.25, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(700, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    this.activeBgNodes.push(lfo);

    chord.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq + (idx - 2) * 0.8, this.ctx.currentTime);
      osc.connect(filter);
      osc.start();
      this.activeBgNodes.push(osc);
    });

    // Sub-bass pulse at 73.42 Hz (D2)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(73.42, this.ctx.currentTime);
    subGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    subOsc.connect(subGain);
    subGain.connect(this.bgmGain);
    subOsc.start();
    this.activeBgNodes.push(subOsc);

    // Driving Arpeggiator (240ms interval cycling [D4, F4, A4, C5, E5, C5, A4, F4])
    const arpNotes = [293.66, 349.23, 440.00, 523.25, 659.25, 523.25, 440.00, 349.23];
    let step = 0;
    this.bgmInterval = setInterval(() => {
      if (!this.isPlayingBgm || this.muted || !this.ctx) return;
      const freq = arpNotes[step % arpNotes.length];
      step++;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.bgmGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    }, 240);
  }

  // ==========================================
  // SOUND EFFECTS (SFX)
  // ==========================================

  // UI Button Click: 50ms tactile micro pitch-drop blip (880 Hz down to 440 Hz)
  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Theme-Reactive Quest Completion Chimes
  playQuestComplete(theme = 'forest') {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    let notes;
    let wave = 'triangle';

    if (theme === 'samurai') {
      // Royal koto ceremonial strike: A4 -> D5 -> E5 -> A5
      notes = [440.00, 587.33, 659.25, 880.00];
      wave = 'sine';
    } else if (theme === 'city') {
      // Retro-futuristic ascending synth chime: C5 -> G5 -> C6 -> E6
      notes = [523.25, 783.99, 1046.50, 1318.51];
      wave = 'sawtooth';
    } else {
      // Forest: Mystic Celtic harp triad: D4 -> A4 -> D5 -> F#5
      notes = [293.66, 440.00, 587.33, 739.99];
      wave = 'triangle';
    }

    notes.forEach((freq, index) => {
      const startTime = this.ctx.currentTime + index * 0.09;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = wave;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }

  // 6-note grand major pentatonic arpeggio cascade (C4 -> E4 -> G4 -> C5 -> E5 -> G5)
  playLevelUp() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
    notes.forEach((freq, index) => {
      const startTime = this.ctx.currentTime + index * 0.12;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.65);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(startTime);
      osc.stop(startTime + 0.65);
    });
  }

  // World Boss Strike: Low-frequency kinetic impact thud (160 Hz -> 25 Hz)
  playBossStrike() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(25, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  playBossHit() {
    this.playBossStrike();
  }

  // Theme Attack Sound Actions
  playAttack(theme = 'forest') {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    if (theme === 'samurai') {
      // Katana slash: High sharp white noise swoosh + metallic blade ring
      const bufferSize = this.ctx.sampleRate * 0.18;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.18);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      noise.start();

      // Metallic ping
      const ring = this.ctx.createOscillator();
      const ringGain = this.ctx.createGain();
      ring.type = 'sine';
      ring.frequency.setValueAtTime(1400, this.ctx.currentTime + 0.05);
      ring.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.25);
      ringGain.gain.setValueAtTime(0.2, this.ctx.currentTime + 0.05);
      ringGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      ring.connect(ringGain);
      ringGain.connect(this.sfxGain);
      ring.start(this.ctx.currentTime + 0.05);
      ring.stop(this.ctx.currentTime + 0.25);

    } else if (theme === 'city') {
      // Construction laser / hydraulic strike
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(650, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);

    } else {
      // Enchanted Forest: mystical flute chime
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(784, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1174.66, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    }
  }

  // Meditate / Focus Charge hum
  playMeditate() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 1.2);

    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.2);
  }

  // Damage / Recoil grunt
  playHit() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }
}

export const audioEngine = new AudioEngine();
export const sound = audioEngine; // Aliased for seamless compatibility
