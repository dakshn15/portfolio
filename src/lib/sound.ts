/**
 * Tiny UI sounds, synthesised with Web Audio so nothing extra is downloaded.
 * Sounds only ever play in response to something the visitor did, and the
 * preference is remembered.
 */
const STORAGE_KEY = "dn-sound";
const EVENT = "soundchange";

let context: AudioContext | null = null;

export function isSoundOn(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setSoundOn(on: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    // Storage can be unavailable (private mode); the toggle still works for this visit.
  }
  window.dispatchEvent(new Event(EVENT));
  if (on) playTick();
}

export function subscribeSound(callback: () => void) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

function create(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  context ??= new Ctor();
  return context;
}

function audio(): AudioContext | null {
  const ctx = create();
  if (ctx?.state === "suspended") void ctx.resume();
  return ctx;
}

/**
 * Creating an AudioContext can block the page for a few hundred milliseconds
 * the first time, which would land in the middle of the theme switch. It is
 * created early, while idle; it starts suspended and the first click resumes it.
 */
export function warmAudio() {
  if (context || !isSoundOn()) return;
  try {
    create();
  } catch {
    // Ignore.
  }
}

/** One short mechanical transient: a filtered noise snap plus a small pitched body. */
function transient(ctx: AudioContext, at: number, pitch: number, level: number) {
  const length = Math.floor(ctx.sampleRate * 0.025);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 4;

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = pitch * 6;
  band.Q.value = 1.1;
  const snap = ctx.createGain();
  snap.gain.setValueAtTime(level, at);
  snap.gain.exponentialRampToValueAtTime(0.0001, at + 0.045);
  noise.connect(band).connect(snap).connect(ctx.destination);
  noise.start(at);

  const body = ctx.createOscillator();
  body.type = "triangle";
  body.frequency.setValueAtTime(pitch, at);
  body.frequency.exponentialRampToValueAtTime(pitch * 0.35, at + 0.07);
  const thump = ctx.createGain();
  thump.gain.setValueAtTime(level * 0.35, at);
  thump.gain.exponentialRampToValueAtTime(0.0001, at + 0.08);
  body.connect(thump).connect(ctx.destination);
  body.start(at);
  body.stop(at + 0.09);
}

/** The pull-cord switch: a click on the pull and a lighter clack on release. */
export function playSwitch(toDark: boolean) {
  if (!isSoundOn()) return;
  try {
    const ctx = audio();
    if (!ctx) return;
    const now = ctx.currentTime;
    transient(ctx, now, toDark ? 340 : 420, 0.32);
    transient(ctx, now + 0.085, toDark ? 260 : 520, 0.2);
  } catch {
    // Audio is a nicety; never let it break the interaction.
  }
}

/** A soft single tick for small confirmations. */
export function playTick() {
  if (!isSoundOn()) return;
  try {
    const ctx = audio();
    if (!ctx) return;
    transient(ctx, ctx.currentTime, 480, 0.16);
  } catch {
    // Ignore.
  }
}

/** Call from a click or key handler so later hover sounds are allowed to play. */
export function primeAudio() {
  if (!isSoundOn()) return;
  try {
    audio();
  } catch {
    // Ignore.
  }
}

let bus: GainNode | null = null;

/** A shared output with a compressor, so many bells at once never clip. */
function bellBus(ctx: AudioContext): GainNode {
  if (bus && bus.context === ctx) return bus;
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -18;
  compressor.ratio.value = 4;
  bus = ctx.createGain();
  bus.gain.value = 0.9;
  bus.connect(compressor).connect(ctx.destination);
  return bus;
}

// Partials of a tubular bell: frequency ratio, relative level, relative decay.
const BELL_PARTIALS: [number, number, number][] = [
  [1, 1, 1],
  [2.76, 0.42, 0.55],
  [5.4, 0.18, 0.32],
  [8.93, 0.08, 0.2],
];

/** A struck metal tube. Used by the wind chimes and the stacking game. */
export function playBell(frequency: number, level = 0.22, decay = 2.4) {
  if (!isSoundOn()) return;
  try {
    const ctx = audio();
    if (!ctx || ctx.state !== "running") return;
    const out = bellBus(ctx);
    const now = ctx.currentTime;
    for (const [ratio, amount, life] of BELL_PARTIALS) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = frequency * ratio;
      const gain = ctx.createGain();
      const peak = level * amount;
      const end = now + decay * life;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(peak, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, end);
      osc.connect(gain).connect(out);
      osc.start(now);
      osc.stop(end + 0.05);
    }
  } catch {
    // Ignore.
  }
}

/** A very quiet key tap for the typing game; lower when the key was wrong. */
export function playKey(wrong = false) {
  if (!isSoundOn()) return;
  try {
    const ctx = audio();
    if (!ctx) return;
    transient(ctx, ctx.currentTime, wrong ? 170 : 620 + Math.random() * 80, wrong ? 0.12 : 0.05);
  } catch {
    // Ignore.
  }
}

/** A dull drop, for a game ending. */
export function playThud() {
  if (!isSoundOn()) return;
  try {
    const ctx = audio();
    if (!ctx) return;
    transient(ctx, ctx.currentTime, 120, 0.3);
  } catch {
    // Ignore.
  }
}

/** Notes of a major pentatonic scale from D4 up, so any sequence sounds pleasant. */
export function pentatonic(step: number): number {
  const semitones = [0, 2, 4, 7, 9];
  const octave = Math.floor(step / semitones.length);
  const note = semitones[((step % semitones.length) + semitones.length) % semitones.length];
  return 293.66 * 2 ** (octave + note / 12);
}
