/**
 * Процедурные текстуры Земли/облаков/Луны — рисуются на canvas
 * детерминированными функциями (без Math.random, без внешних файлов).
 * Материки/кратеры — кластеры перекрывающихся кругов, размещённых по
 * хеш-подобной тригонометрической формуле (стабильно, но выглядит органично).
 */

// Дешёвый детерминированный "хэш" в [0, 1) — как в шейдерах, без Math.random.
function hash(n) {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

function drawBlobCluster(ctx, width, height, cx, cy, baseR, count, seed) {
  for (let i = 0; i < count; i++) {
    const a = hash(seed + i * 1.37) * Math.PI * 2;
    const dist = baseR * (0.15 + 0.85 * hash(seed + i * 2.71));
    const x = cx + Math.cos(a) * dist;
    const y = cy + Math.sin(a) * dist * 0.62;
    const r = baseR * (0.28 + 0.4 * hash(seed + i * 4.13));
    ctx.beginPath();
    ctx.arc(x * width, y * height, Math.max(r * width, 1.5), 0, Math.PI * 2);
    ctx.fill();
  }
}

const CONTINENTS = [
  { cx: 0.16, cy: 0.34, r: 0.075, seed: 1.1 },
  { cx: 0.21, cy: 0.56, r: 0.06, seed: 2.4 },
  { cx: 0.29, cy: 0.64, r: 0.045, seed: 3.7 },
  { cx: 0.47, cy: 0.27, r: 0.09, seed: 5.2 },
  { cx: 0.51, cy: 0.54, r: 0.075, seed: 6.6 },
  { cx: 0.56, cy: 0.7, r: 0.045, seed: 8.1 },
  { cx: 0.71, cy: 0.29, r: 0.1, seed: 9.5 },
  { cx: 0.82, cy: 0.34, r: 0.055, seed: 11.2 },
  { cx: 0.79, cy: 0.55, r: 0.05, seed: 12.8 },
  { cx: 0.9, cy: 0.66, r: 0.045, seed: 14.3 },
  { cx: 0.04, cy: 0.72, r: 0.05, seed: 15.9 },
];

export function createEarthCanvas() {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const ocean = ctx.createLinearGradient(0, 0, 0, height);
  ocean.addColorStop(0, "#2a5f8a");
  ocean.addColorStop(0.5, "#154a75");
  ocean.addColorStop(1, "#0d2f52");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, width, height);

  // Материки — тёмный подслой + светлый акцентный слой сверху для объёма.
  ctx.fillStyle = "#3d6b45";
  for (const c of CONTINENTS) {
    drawBlobCluster(ctx, width, height, c.cx, c.cy, c.r, 26, c.seed);
  }
  ctx.fillStyle = "#5a8f52";
  for (const c of CONTINENTS) {
    drawBlobCluster(ctx, width, height, c.cx, c.cy, c.r * 0.6, 14, c.seed + 20);
  }
  ctx.fillStyle = "#8a7a4a";
  for (const c of CONTINENTS) {
    drawBlobCluster(ctx, width, height, c.cx, c.cy, c.r * 0.3, 6, c.seed + 40);
  }

  // Полярные шапки.
  const northCap = ctx.createLinearGradient(0, 0, 0, height * 0.14);
  northCap.addColorStop(0, "rgba(255,255,255,0.95)");
  northCap.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = northCap;
  ctx.fillRect(0, 0, width, height * 0.14);

  const southCap = ctx.createLinearGradient(0, height, 0, height * 0.86);
  southCap.addColorStop(0, "rgba(255,255,255,0.95)");
  southCap.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = southCap;
  ctx.fillRect(0, height * 0.86, width, height * 0.14);

  return canvas;
}

const CLOUD_CLUSTERS = [
  { cx: 0.1, cy: 0.22, r: 0.08, seed: 51 },
  { cx: 0.35, cy: 0.4, r: 0.1, seed: 62 },
  { cx: 0.6, cy: 0.2, r: 0.09, seed: 73 },
  { cx: 0.68, cy: 0.62, r: 0.11, seed: 84 },
  { cx: 0.87, cy: 0.42, r: 0.08, seed: 95 },
  { cx: 0.2, cy: 0.75, r: 0.07, seed: 106 },
  { cx: 0.48, cy: 0.82, r: 0.06, seed: 117 },
];

export function createCloudCanvas() {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "rgba(255,255,255,0.85)";
  for (const c of CLOUD_CLUSTERS) {
    drawBlobCluster(ctx, width, height, c.cx, c.cy, c.r, 20, c.seed);
  }

  return canvas;
}

const CRATERS = [
  { cx: 0.22, cy: 0.3, r: 0.09, seed: 201 },
  { cx: 0.55, cy: 0.22, r: 0.06, seed: 205 },
  { cx: 0.72, cy: 0.45, r: 0.11, seed: 209 },
  { cx: 0.35, cy: 0.58, r: 0.07, seed: 213 },
  { cx: 0.85, cy: 0.68, r: 0.05, seed: 217 },
  { cx: 0.12, cy: 0.72, r: 0.06, seed: 221 },
  { cx: 0.6, cy: 0.75, r: 0.045, seed: 225 },
];

export function createMoonCanvas() {
  const width = 512;
  const height = 256;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const base = ctx.createLinearGradient(0, 0, 0, height);
  base.addColorStop(0, "#c7c9cc");
  base.addColorStop(1, "#9a9ea3");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, width, height);

  for (const cr of CRATERS) {
    const gx = cr.cx * width;
    const gy = cr.cy * height;
    const gr = cr.r * width;
    const shade = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
    shade.addColorStop(0, "rgba(90,92,96,0.55)");
    shade.addColorStop(0.75, "rgba(120,122,126,0.35)");
    shade.addColorStop(1, "rgba(120,122,126,0)");
    ctx.fillStyle = shade;
    ctx.beginPath();
    ctx.arc(gx, gy, gr, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(120,122,126,0.4)";
  for (let i = 0; i < 40; i++) {
    const x = hash(i * 3.1) * width;
    const y = hash(i * 5.7 + 1) * height;
    const r = 1 + hash(i * 7.9 + 2) * 3;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}
