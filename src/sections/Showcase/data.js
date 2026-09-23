import { t } from "../../i18n/index.js";

const MEDIA = `${import.meta.env.BASE_URL}media/`;

/**
 * Пять направлений - пять глав. Внутри каждой настоящий продукт как
 * доказательство.
 *
 * Экраны двух видов:
 * - src: настоящий скриншот работающего продукта (Playwright, 390x844 при
 *   DPR 3). Длинные кадры прокручиваются внутри телефона вместе со скроллом.
 * - kind: живой экран, собранный в коде (чат бота, схема автоматизации,
 *   AI-пайплайн). Тексты бота и шаги цепочек взяты из исходников ALTIME.
 *
 * bars - у ALTIME шапка и нижняя навигация зафиксированы, в длинном кадре
 * их нет: они накладываются отдельными полосками.
 * tap - куда «нажимает палец» перед переходом: в % области экрана или
 * селектор элемента внутри живого экрана.
 * enter - как телефон входит в главу: у каждой главы свой переход.
 */
const CHAPTER_META = [
  {
    id: "bots",
    proof: "ALTIME AI",
    accent: "#f43f75",
    side: "right",
    enter: "rise",
    link: "https://max.ru/se13793521_bot",
    stack: ["MAX Bot API", "Next.js 16", "TypeScript", "Prisma", "PostgreSQL", "YooKassa"],
    screens: [
      { kind: "chat", tap: { sel: "[data-tap='open-app']" } },
      {
        src: "altime/home-long.webp",
        w: 1170,
        h: 10200,
        bars: { src: "altime/home-chrome.webp", top: 66 / 844, bottom: 89 / 844 },
        tap: { x: 28, y: 50 },
      },
      { src: "altime/photoshoot.webp", w: 1170, h: 2532, tap: { x: 83, y: 4.2 } },
      { src: "altime/buy.webp", w: 1170, h: 2532 },
    ],
  },
  {
    id: "saas",
    proof: "QUANTIX",
    accent: "#3b6ff5",
    side: "left",
    enter: "swing",
    link: "https://quantix-five.vercel.app/",
    stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "AI / OCR", "Yandex Cloud"],
    screens: [
      { src: "quantix/home-long.webp", w: 1170, h: 12600, light: true, tap: { x: 80, y: 3.8 } },
      { src: "quantix/register.webp", w: 1170, h: 2532, light: true },
    ],
  },
  {
    id: "automation",
    proof: "ALTIME AI",
    accent: "#34d399",
    side: "right",
    enter: "roll",
    link: "#contact",
    decor: "grid",
    stack: ["Webhooks", "REST API", "Cron", "PostgreSQL", "MAX Bot API"],
    screens: [
      { kind: "flow", swap: "fade" },
      { kind: "run" },
    ],
  },
  {
    id: "web",
    proof: "ZFINDE",
    accent: "#f0a83a",
    side: "left",
    enter: "spin",
    link: "https://zfinde.vercel.app/",
    stack: ["Next.js", "React", "OpenStreetMap", "Vercel"],
    screens: [
      { src: "zfinde/form.webp", w: 1170, h: 2532, tap: { x: 26, y: 37.4 } },
      { src: "zfinde/results-long.webp", w: 1170, h: 9456 },
    ],
  },
  {
    id: "ai",
    proof: "ALTIME + QUANTIX",
    accent: "#a78bfa",
    side: "left",
    enter: "dive",
    link: "https://max.ru/se13793521_bot",
    decor: "rings",
    stack: ["Gemini 2.5 Flash Image", "AI / OCR", "Cloudinary", "Prisma"],
    screens: [
      { kind: "aigen", swap: "fade" },
      { kind: "ocr", light: true },
    ],
  },
];

let index = 0;
export const CHAPTERS = CHAPTER_META.map((meta) => {
  const copy = t(`showcase.chapters.${meta.id}`);
  const screens = meta.screens.map((s) => ({
    ...s,
    chapter: meta.id,
    index: index++,
    src: s.src ? MEDIA + s.src : null,
    bars: s.bars ? { ...s.bars, src: MEDIA + s.bars.src } : null,
    long: Boolean(s.h && s.h > 2532),
  }));
  return { ...meta, ...copy, screens };
});

export const SCREENS = CHAPTERS.flatMap((c) => c.screens);

export const ALTIME_SHOT = (name) => `${MEDIA}altime/shots/${name}.webp`;
