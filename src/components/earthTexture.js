/**
 * Процедурная текстура Земли — рисуется на canvas детерминированной
 * "шумовой" функцией (сумма синусоид), без Math.random и без внешних
 * файлов/хотлинков.
 */
export function createEarthCanvas() {
  const width = 512;
  const height = 256;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const ocean = ctx.createLinearGradient(0, 0, 0, height);
  ocean.addColorStop(0, "#173a5c");
  ocean.addColorStop(1, "#0a1c2e");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#4a7a55";
  const step = 3;
  for (let x = 0; x < width; x += step) {
    for (let y = 0; y < height; y += step) {
      const nx = x / width;
      const ny = y / height;
      const noise =
        Math.sin(nx * 18 + ny * 7) +
        Math.sin(nx * 9 - ny * 13) +
        Math.sin((nx + ny) * 22) +
        Math.sin(nx * 31 - ny * 4);
      if (noise > 1.6) {
        ctx.fillRect(x, y, step, step);
      }
    }
  }

  ctx.fillStyle = "rgba(255,255,255,0.75)";
  for (let x = 0; x < width; x += step) {
    const ny1 = 0.06 + 0.02 * Math.sin(x * 0.2);
    const ny2 = 0.94 - 0.02 * Math.sin(x * 0.17);
    ctx.fillRect(x, ny1 * height, step, step * 2);
    ctx.fillRect(x, ny2 * height, step, step * 2);
  }

  return canvas;
}
