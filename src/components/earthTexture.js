// Приблизительные координаты Москвы.
const MOSCOW = { lat: 55.75, lon: 37.62 };

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Впечатывает красную точку в позицию Москвы на равнопромежуточной
 * (equirectangular) текстуре Земли — та же UV-развёртка, что использует
 * стандартная THREE.SphereGeometry: u = 0.5 + lon/360, v = 0.5 - lat/180.
 */
export function bakeMoscowMarker(earthImage) {
  const width = earthImage.naturalWidth || earthImage.width;
  const height = earthImage.naturalHeight || earthImage.height;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(earthImage, 0, 0, width, height);

  const u = 0.5 + MOSCOW.lon / 360;
  const v = 0.5 - MOSCOW.lat / 180;
  const x = u * width;
  const y = v * height;
  const r = Math.max(width / 220, 5);

  ctx.beginPath();
  ctx.arc(x, y, r * 1.8, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = "#ff2d2d";
  ctx.fill();

  return canvas;
}
