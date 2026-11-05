/**
 * Generative deep-space ambience built with the Web Audio API.
 * No audio files: slow Am9 → Fmaj9 → Cmaj9 → Dm9 pads, a breathing sub drone,
 * random "star" bells and a brown-noise solar wind that reacts to scrolling.
 *
 * Browsers only allow audio after a user gesture, so call `toggle()` from a click.
 */

const CHORDS = [
  [45, 52, 55, 59, 60],
  [41, 48, 52, 55, 57],
  [48, 55, 59, 62, 64],
  [38, 45, 48, 52, 53],
];
const STAR_NOTES = [69, 72, 74, 76, 79, 81, 84, 86, 88, 91];
const midiToHz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);
const volumeCurve = (v: number) => Math.pow(v, 1.6) * 0.9;

export class SpaceAmbience {
  private ctx?: AudioContext;
  private master?: GainNode;
  private analyser?: AnalyserNode;
  private padBus?: GainNode;
  private bellBus?: GainNode;
  private windGain?: GainNode;
  private windFilter?: BiquadFilterNode;
  private lfoGain?: GainNode;
  private schedulerId?: number;
  private starTimer?: number;
  private nextChordAt = 0;
  private chordIndex = 0;
  private started = false;
  private levels?: Uint8Array<ArrayBuffer>;

  on = false;
  volume = 0.55;

  /** Turns sound on/off. Returns the new state. */
  toggle(force?: boolean): boolean {
    if (!this.ctx) {
      try {
        this.build();
      } catch {
        return false;
      }
    }
    const ctx = this.ctx!;
    this.on = force ?? !this.on;
    this.master!.gain.cancelScheduledValues(ctx.currentTime);
    if (this.on) {
      void ctx.resume().catch(() => undefined);
      this.master!.gain.setTargetAtTime(volumeCurve(this.volume), ctx.currentTime, 0.8);
      if (!this.started) {
        this.started = true;
        this.nextChordAt = ctx.currentTime + 0.05;
        this.scheduleStars();
        this.bell(81, 0.05);
      }
    } else {
      this.master!.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
      window.setTimeout(() => !this.on && void ctx.suspend().catch(() => undefined), 1500);
    }
    return this.on;
  }

  setVolume(v: number) {
    this.volume = v;
    if (this.ctx && this.on) this.master!.gain.setTargetAtTime(volumeCurve(v), this.ctx.currentTime, 0.08);
  }

  /** Temporarily silence (e.g. when the tab is hidden) without changing `on`. */
  duck(silent: boolean) {
    if (this.ctx && this.on) this.master!.gain.setTargetAtTime(silent ? 0 : volumeCurve(this.volume), this.ctx.currentTime, 0.4);
  }

  /** Scroll velocity → solar-wind intensity. */
  scroll(velocity: number) {
    if (!this.ctx || !this.on) return;
    const a = Math.min(Math.abs(velocity), 80);
    this.windGain!.gain.setTargetAtTime(0.03 + a * 0.0016, this.ctx.currentTime, 0.3);
    this.windFilter!.frequency.setTargetAtTime(380 + a * 28, this.ctx.currentTime, 0.35);
  }

  /** Soft UI chime (hover on buttons/cards). */
  blip() {
    if (this.ctx && this.on) this.bell(STAR_NOTES[5 + Math.floor(Math.random() * 5)], 0.02);
  }

  /** Frequency data for visualisers (null when not built). */
  getLevels(): Uint8Array | null {
    if (!this.analyser || !this.levels) return null;
    this.analyser.getByteFrequencyData(this.levels);
    return this.levels;
  }

  dispose() {
    window.clearInterval(this.schedulerId);
    window.clearTimeout(this.starTimer);
    void this.ctx?.close().catch(() => undefined);
    this.ctx = undefined;
  }

  /* ── internals ─────────────────────────────────────────────────── */

  private build() {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = (this.ctx = new Ctx());

    this.master = ctx.createGain();
    this.master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -20;
    comp.ratio.value = 3;
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 64;
    this.analyser.smoothingTimeConstant = 0.82;
    this.levels = new Uint8Array(new ArrayBuffer(this.analyser.frequencyBinCount));
    this.master.connect(comp).connect(this.analyser).connect(ctx.destination);

    const reverb = ctx.createConvolver();
    reverb.buffer = this.impulse(7, 2.4);
    const reverbGain = ctx.createGain();
    reverbGain.gain.value = 0.85;
    reverb.connect(reverbGain).connect(this.master);

    const delay = ctx.createDelay(2);
    delay.delayTime.value = 0.46;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.45;
    const delayFilter = ctx.createBiquadFilter();
    delayFilter.type = "lowpass";
    delayFilter.frequency.value = 2400;
    delay.connect(delayFilter);
    delayFilter.connect(feedback).connect(delay);
    delayFilter.connect(reverb);
    delayFilter.connect(this.master);

    this.padBus = ctx.createGain();
    this.padBus.gain.value = 0.5;
    this.padBus.connect(this.master);
    this.padBus.connect(reverb);

    this.bellBus = ctx.createGain();
    this.bellBus.gain.value = 0.55;
    this.bellBus.connect(this.master);
    this.bellBus.connect(delay);
    this.bellBus.connect(reverb);

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.045;
    this.lfoGain = ctx.createGain();
    this.lfoGain.gain.value = 380;
    lfo.connect(this.lfoGain);
    lfo.start();

    // Sub drone with slow breathing.
    const sub = ctx.createOscillator();
    sub.frequency.value = midiToHz(33);
    const subGain = ctx.createGain();
    subGain.gain.value = 0.07;
    const breath = ctx.createOscillator();
    breath.frequency.value = 0.07;
    const breathGain = ctx.createGain();
    breathGain.gain.value = 0.03;
    breath.connect(breathGain).connect(subGain.gain);
    breath.start();
    sub.connect(subGain).connect(this.master);
    sub.start();

    // Solar wind (brown noise).
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      data[i] = last * 3.5;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    this.windFilter = ctx.createBiquadFilter();
    this.windFilter.type = "bandpass";
    this.windFilter.frequency.value = 420;
    this.windFilter.Q.value = 0.7;
    this.windGain = ctx.createGain();
    this.windGain.gain.value = 0.035;
    noise.connect(this.windFilter).connect(this.windGain);
    this.windGain.connect(this.master);
    this.windGain.connect(reverb);
    noise.start();

    this.schedulerId = window.setInterval(() => {
      if (this.on && this.nextChordAt < ctx.currentTime + 1.5) {
        this.nextChordAt = this.chord(Math.max(this.nextChordAt, ctx.currentTime + 0.05));
      }
    }, 500);
  }

  private impulse(seconds: number, decay: number) {
    const ctx = this.ctx!;
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }

  private chord(t: number) {
    const ctx = this.ctx!;
    const notes = CHORDS[this.chordIndex++ % CHORDS.length];
    const dur = 12;
    notes.forEach((m, i) => {
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 650 + i * 110;
      filter.Q.value = 0.6;
      this.lfoGain!.connect(filter.frequency);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.042, t + 4.5);
      gain.gain.setValueAtTime(0.042, t + dur - 2);
      gain.gain.linearRampToValueAtTime(0, t + dur + 5);
      const pan = ctx.createStereoPanner();
      pan.pan.value = (i / (notes.length - 1) - 0.5) * 0.9;
      [-9, 9].forEach((detune) => {
        const osc = ctx.createOscillator();
        osc.type = i === 0 ? "triangle" : "sawtooth";
        osc.frequency.value = midiToHz(m);
        osc.detune.value = detune;
        osc.connect(filter);
        osc.start(t);
        osc.stop(t + dur + 6);
      });
      filter.connect(gain).connect(pan).connect(this.padBus!);
      window.setTimeout(() => {
        try {
          this.lfoGain!.disconnect(filter.frequency);
        } catch {
          /* already disconnected */
        }
      }, (t - ctx.currentTime + dur + 7) * 1000);
    });
    return t + dur;
  }

  private bell(midi: number, velocity: number, when?: number) {
    const ctx = this.ctx!;
    const t = when ?? ctx.currentTime;
    const o1 = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    const g = ctx.createGain();
    const g2 = ctx.createGain();
    const pan = ctx.createStereoPanner();
    o1.frequency.value = midiToHz(midi);
    o2.frequency.value = midiToHz(midi) * 2.005;
    g2.gain.value = 0.22;
    pan.pan.value = Math.random() * 1.6 - 0.8;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(velocity, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 3.8);
    o1.connect(g);
    o2.connect(g2).connect(g);
    g.connect(pan).connect(this.bellBus!);
    o1.start(t);
    o2.start(t);
    o1.stop(t + 4);
    o2.stop(t + 4);
  }

  private scheduleStars() {
    if (this.on && this.ctx) {
      const count = Math.random() < 0.3 ? 3 : 1;
      for (let i = 0; i < count; i++) {
        this.bell(STAR_NOTES[Math.floor(Math.random() * STAR_NOTES.length)], 0.025 + Math.random() * 0.035, this.ctx.currentTime + i * 0.16);
      }
    }
    this.starTimer = window.setTimeout(() => this.scheduleStars(), 1100 + Math.random() * 2600);
  }
}

/** Shared singleton so the header control and the scene talk to one engine. */
let instance: SpaceAmbience | null = null;
export const getAmbience = () => (instance ??= new SpaceAmbience());
