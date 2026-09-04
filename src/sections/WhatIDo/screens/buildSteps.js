/**
 * Шаги стройки экрана каждого сервиса — 0..1 координаты ВНУТРИ окна
 * "reveal" одного сервиса (WhatIDoSection сам переводит их в абсолютное
 * время master-timeline через buildLocalStart/buildLocalEnd).
 * Общий ритм окон (одинаковый для всех 5, per бриф §8):
 *   A 0.00–0.20  — бренд/навигация (появляется сразу с прибытием телефона)
 *   B 0.21–0.41  — герой/заголовок
 *   C 0.43–0.63  — CTA / второстепенный контент
 *   D 0.64–0.85  — карточки/фичи (обычно 2 элемента внахлёст)
 *   E 0.86–1.00  — финальный слой деталей
 */

export const restaurantSteps = [
  { selector: ".wid-r-nav", from: { opacity: 0, y: -8 }, to: { opacity: 1, y: 0 }, position: 0, length: 0.18 },
  { selector: ".wid-r-hero", from: { opacity: 0, scaleY: 0.2, transformOrigin: "top" }, to: { opacity: 1, scaleY: 1 }, position: 0.08, length: 0.22 },
  { selector: ".wid-r-headline", from: { opacity: 0, y: 12 }, to: { opacity: 1, y: 0 }, position: 0.26, length: 0.16 },
  { selector: ".wid-r-sub", from: { opacity: 0, y: 8 }, to: { opacity: 1, y: 0 }, position: 0.37, length: 0.12 },
  { selector: ".wid-r-cta", from: { opacity: 0, scale: 0.88 }, to: { opacity: 1, scale: 1 }, position: 0.46, length: 0.14 },
  { selector: ".wid-r-dishes .wid-r-dish:nth-child(1)", from: { opacity: 0, y: 14 }, to: { opacity: 1, y: 0 }, position: 0.62, length: 0.15 },
  { selector: ".wid-r-dishes .wid-r-dish:nth-child(2)", from: { opacity: 0, y: 14 }, to: { opacity: 1, y: 0 }, position: 0.7, length: 0.15 },
  { selector: ".wid-r-info", from: { opacity: 0 }, to: { opacity: 1 }, position: 0.87, length: 0.1 },
  { selector: ".wid-r-reserve", from: { opacity: 0, y: 8 }, to: { opacity: 1, y: 0 }, position: 0.91, length: 0.09 },
];

export const webAppSteps = [
  { selector: ".wid-da-topbar", from: { opacity: 0, y: -8 }, to: { opacity: 1, y: 0 }, position: 0, length: 0.18 },
  { selector: ".wid-da-headline", from: { opacity: 0, y: 10 }, to: { opacity: 1, y: 0 }, position: 0.21, length: 0.16 },
  { selector: ".wid-da-kpis .wid-da-kpi:nth-child(1)", from: { opacity: 0, y: 10 }, to: { opacity: 1, y: 0 }, position: 0.34, length: 0.13 },
  { selector: ".wid-da-kpis .wid-da-kpi:nth-child(2)", from: { opacity: 0, y: 10 }, to: { opacity: 1, y: 0 }, position: 0.39, length: 0.13 },
  { selector: ".wid-da-chart-line", from: { opacity: 0, scaleX: 0, transformOrigin: "left" }, to: { opacity: 1, scaleX: 1 }, position: 0.48, length: 0.18 },
  { selector: ".wid-da-feed .wid-da-feed-row:nth-child(1)", from: { opacity: 0, x: -10 }, to: { opacity: 1, x: 0 }, position: 0.68, length: 0.12 },
  { selector: ".wid-da-feed .wid-da-feed-row:nth-child(2)", from: { opacity: 0, x: -10 }, to: { opacity: 1, x: 0 }, position: 0.74, length: 0.12 },
  { selector: ".wid-da-feed .wid-da-feed-row:nth-child(3)", from: { opacity: 0, x: -10 }, to: { opacity: 1, x: 0 }, position: 0.8, length: 0.12 },
  { selector: ".wid-da-footer", from: { opacity: 0 }, to: { opacity: 1 }, position: 0.93, length: 0.07 },
];

export const saasSteps = [
  { selector: ".wid-sa-topbar", from: { opacity: 0, y: -8 }, to: { opacity: 1, y: 0 }, position: 0, length: 0.18 },
  { selector: ".wid-sa-revenue", from: { opacity: 0, y: 10 }, to: { opacity: 1, y: 0 }, position: 0.22, length: 0.18 },
  { selector: ".wid-sa-stats .wid-sa-stat:nth-child(1)", from: { opacity: 0, y: 10 }, to: { opacity: 1, y: 0 }, position: 0.42, length: 0.14 },
  { selector: ".wid-sa-stats .wid-sa-stat:nth-child(2)", from: { opacity: 0, y: 10 }, to: { opacity: 1, y: 0 }, position: 0.47, length: 0.14 },
  { selector: ".wid-sa-list .wid-sa-list-row:nth-child(1)", from: { opacity: 0, x: -10 }, to: { opacity: 1, x: 0 }, position: 0.64, length: 0.13 },
  { selector: ".wid-sa-list .wid-sa-list-row:nth-child(2)", from: { opacity: 0, x: -10 }, to: { opacity: 1, x: 0 }, position: 0.71, length: 0.13 },
  { selector: ".wid-sa-list .wid-sa-list-row:nth-child(3)", from: { opacity: 0, x: -10 }, to: { opacity: 1, x: 0 }, position: 0.78, length: 0.13 },
  { selector: ".wid-sa-footer", from: { opacity: 0 }, to: { opacity: 1 }, position: 0.93, length: 0.07 },
];

export const aiSteps = [
  { selector: ".wid-ga-topbar", from: { opacity: 0, y: -8 }, to: { opacity: 1, y: 0 }, position: 0, length: 0.18 },
  { selector: ".wid-ga-prompt", from: { opacity: 0, y: 8 }, to: { opacity: 1, y: 0 }, position: 0.22, length: 0.18 },
  { selector: ".wid-ga-preview", from: { opacity: 0, scale: 0.94 }, to: { opacity: 1, scale: 1 }, position: 0.42, length: 0.24 },
  { selector: ".wid-ga-thumb-a", from: { opacity: 0, scale: 0.6 }, to: { opacity: 1, scale: 1 }, position: 0.68, length: 0.1 },
  { selector: ".wid-ga-thumb-b", from: { opacity: 0, scale: 0.6 }, to: { opacity: 1, scale: 1 }, position: 0.73, length: 0.1 },
  { selector: ".wid-ga-thumb-c", from: { opacity: 0, scale: 0.6 }, to: { opacity: 1, scale: 1 }, position: 0.78, length: 0.1 },
  { selector: ".wid-ga-thumb-d", from: { opacity: 0, scale: 0.6 }, to: { opacity: 1, scale: 1 }, position: 0.83, length: 0.1 },
  { selector: ".wid-ga-footer", from: { opacity: 0 }, to: { opacity: 1 }, position: 0.94, length: 0.06 },
];

export const interactiveSteps = [
  { selector: ".wid-ix-panel-1", from: { opacity: 0, scale: 0.82 }, to: { opacity: 1, scale: 1 }, position: 0, length: 0.2 },
  { selector: ".wid-ix-panel-2", from: { opacity: 0, scale: 0.82 }, to: { opacity: 1, scale: 1 }, position: 0.16, length: 0.2 },
  { selector: ".wid-ix-panel-3", from: { opacity: 0, scale: 0.82 }, to: { opacity: 1, scale: 1 }, position: 0.32, length: 0.2 },
  { selector: ".wid-ix-sheen", from: { opacity: 0 }, to: { opacity: 1 }, position: 0.5, length: 0.12 },
  { selector: ".wid-ix-chip-a", from: { opacity: 0, y: 8 }, to: { opacity: 1, y: 0 }, position: 0.58, length: 0.12 },
  { selector: ".wid-ix-chip-b", from: { opacity: 0, y: 8 }, to: { opacity: 1, y: 0 }, position: 0.64, length: 0.12 },
  { selector: ".wid-ix-dot-a", from: { opacity: 0, scale: 0.4 }, to: { opacity: 1, scale: 1 }, position: 0.72, length: 0.1 },
  { selector: ".wid-ix-dot-b", from: { opacity: 0, scale: 0.4 }, to: { opacity: 1, scale: 1 }, position: 0.78, length: 0.1 },
  { selector: ".wid-ix-cursor", from: { opacity: 0, x: -14, y: 10 }, to: { opacity: 1, x: 0, y: 0 }, position: 0.86, length: 0.1 },
  { selector: ".wid-ix-ring", from: { opacity: 0, scale: 0.5 }, to: { opacity: 1, scale: 1 }, position: 0.9, length: 0.1 },
];
