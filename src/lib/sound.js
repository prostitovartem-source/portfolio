/**
 * Звуковой слой сайта. Ни одного аудиофайла: всё синтезируется Web Audio
 * API на лету - это ноль килобайт к бандлу и звуки, которые точно
 * подходят к движению (короткие, мягкие, в одной тональности - до мажор).
 *
 * Браузеры не дают играть звук до первого жеста человека, поэтому
 * AudioContext создаётся только на первом клике/нажатии клавиши. До этого
 * play() молча ничего не делает.
 *
 * Выбор (вкл/выкл) хранится в localStorage и доступен через subscribe -
 * кнопка в навбаре показывает актуальное состояние.
 */

const KEY = "copick:sound";
const listeners = new Set();

let ctx = null;
let master = null;
let fx = null; // шина с лёгким эхом для «воздушных» звуков
let noiseBuffer = null;
let enabled = readChoice();
const lastPlayed = {};

function readChoice() {
  try {
    return localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
}

function writeChoice(on) {
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    /* не критично */
  }
}

function ensureContext() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();

  // Мастер: общий уровень + компрессор, чтобы наложения не хрипели.
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.ratio.value = 4;
  master = ctx.createGain();
  master.gain.value = 0.7;
  master.connect(comp).connect(ctx.destination);

  // Короткое эхо с обратной связью - даёт звукам «пространство».
  const delay = ctx.createDelay(1);
  delay.delayTime.value = 0.13;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.28;
  const damp = ctx.createBiquadFilter();
  damp.type = "lowpass";
  damp.frequency.value = 3200;
  const wet = ctx.createGain();
  wet.gain.value = 0.22;
  delay.connect(damp).connect(feedback).connect(delay);
  damp.connect(wet).connect(master);
  fx = delay;

  // Буфер белого шума для «шорохов» и щелчков.
  noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 1, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  return ctx;
}

/** Разблокировка на первом жесте. Вызывается из SoundFx. */
export function unlockAudio() {
  const c = ensureContext();
  if (c && c.state === "suspended") c.resume();
}

// ── Примитивы ─────────────────────────────────────────────────────────

function tone({ freq, to, type = "sine", start = 0, attack = 0.004, decay = 0.2, gain = 0.1, send = 0 }) {
  const t0 = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + decay);
  env.gain.setValueAtTime(0, t0);
  env.gain.linearRampToValueAtTime(gain, t0 + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + decay);
  osc.connect(env).connect(master);
  if (send) {
    const s = ctx.createGain();
    s.gain.value = send;
    env.connect(s).connect(fx);
  }
  osc.start(t0);
  osc.stop(t0 + attack + decay + 0.05);
}

function noise({ start = 0, duration = 0.2, gain = 0.05, filter = "bandpass", from = 800, to = 800, q = 1, send = 0 }) {
  const t0 = ctx.currentTime + start;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer;
  const f = ctx.createBiquadFilter();
  f.type = filter;
  f.Q.value = q;
  f.frequency.setValueAtTime(from, t0);
  f.frequency.exponentialRampToValueAtTime(to, t0 + duration);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0, t0);
  env.gain.linearRampToValueAtTime(gain, t0 + duration * 0.35);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  src.connect(f).connect(env).connect(master);
  if (send) {
    const s = ctx.createGain();
    s.gain.value = send;
    env.connect(s).connect(fx);
  }
  src.start(t0);
  src.stop(t0 + duration + 0.05);
}

const jitter = (v, amount = 0.04) => v * (1 + (Math.random() * 2 - 1) * amount);

// ── Пресеты ──────────────────────────────────────────────────────────
// Ноты до мажора: C5 523, E5 659, G5 784, C6 1047, E6 1319.

const PRESETS = {
  // Наведение на кнопку/ссылку: едва слышный стеклянный «тик».
  hover: () => {
    tone({ freq: jitter(2093, 0.03), type: "sine", decay: 0.06, gain: 0.022 });
  },

  // Клик: мягкий «поп» с лёгкой атакой шума - как нажатие настоящей кнопки.
  click: () => {
    tone({ freq: jitter(620), to: 260, type: "triangle", decay: 0.11, gain: 0.11 });
    noise({ duration: 0.03, gain: 0.03, filter: "highpass", from: 3000, to: 3000 });
  },

  // Заголовок секции проявляется: воздушный взмах + тихий колокольчик.
  reveal: () => {
    noise({ duration: 0.55, gain: 0.028, filter: "bandpass", from: 400, to: 2600, q: 0.8, send: 0.6 });
    tone({ freq: 1319, type: "sine", start: 0.12, decay: 0.9, gain: 0.018, send: 0.8 });
    tone({ freq: 1976, type: "sine", start: 0.16, decay: 0.7, gain: 0.01, send: 0.8 });
  },

  // Звук включён: восходящее арпеджио - маленький сюрприз.
  on: () => {
    [523, 659, 784, 1047, 1319].forEach((f, i) =>
      tone({ freq: f, type: "triangle", start: i * 0.065, decay: 0.45, gain: 0.05, send: 0.5 })
    );
  },

  // Выключение: две ноты вниз, коротко.
  off: () => {
    tone({ freq: 784, type: "triangle", decay: 0.18, gain: 0.05 });
    tone({ freq: 523, type: "triangle", start: 0.08, decay: 0.25, gain: 0.05 });
  },

  // Переключатель (язык и т.п.): сухой двойной щелчок.
  toggle: () => {
    tone({ freq: 1400, type: "square", decay: 0.025, gain: 0.018 });
    tone({ freq: 1900, type: "square", start: 0.045, decay: 0.025, gain: 0.014 });
  },

  // Карточки ALTIME собрались в веер: тёплый аккорд.
  bloom: () => {
    [523, 659, 784].forEach((f, i) =>
      tone({ freq: f, type: "sine", start: i * 0.03, attack: 0.05, decay: 1.2, gain: 0.03, send: 0.7 })
    );
  },
};

// Минимальный интервал между одинаковыми звуками (мс), чтобы быстрые
// движения мыши не превращались в трещотку.
const THROTTLE = { hover: 70, click: 40, reveal: 400, toggle: 60, bloom: 1500 };

export function play(name, { force = false } = {}) {
  if ((!enabled && !force) || !ctx || ctx.state !== "running") return;
  const now = performance.now();
  if (now - (lastPlayed[name] ?? 0) < (THROTTLE[name] ?? 120)) return;
  lastPlayed[name] = now;
  try {
    PRESETS[name]?.();
  } catch {
    /* звук - украшение, ошибки не должны ломать сайт */
  }
}

export function isSoundEnabled() {
  return enabled;
}

export function setSoundEnabled(on) {
  enabled = on;
  writeChoice(on);
  unlockAudio();
  // Клик по переключателю - уже жест, контекст можно запустить сразу.
  setTimeout(() => play(on ? "on" : "off", { force: true }), 30);
  listeners.forEach((fn) => fn(on));
}

export function subscribeSound(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
