import { t } from "../../i18n/index.js";

const MEDIA = `${import.meta.env.BASE_URL}media/`;

/**
 * Все экраны - настоящие скриншоты работающих продуктов (Playwright,
 * 390x844 при DPR 3). Длинные кадры (`long`) прокручиваются внутри телефона
 * вместе со скроллом страницы, поэтому сцена читается как запись экрана,
 * но остаётся чёткой на 4K и весит в разы меньше видео.
 *
 * bars - у ALTIME шапка и нижняя навигация зафиксированы, в длинном кадре
 * их нет: они накладываются отдельными полосками из обычного кадра.
 * tap - куда «нажимает палец» перед переходом на следующий экран, в % от
 * области экрана.
 */
export const SCREENS = [
  {
    chapter: "altime",
    src: "altime/home-long.webp",
    w: 1170,
    h: 10200,
    bars: { src: "altime/home-chrome.webp", top: 66 / 844, bottom: 89 / 844 },
    tap: { x: 28, y: 50 },
  },
  { chapter: "altime", src: "altime/photoshoot.webp", w: 1170, h: 2532, tap: { x: 10, y: 4.2 } },
  {
    chapter: "altime",
    src: "altime/group-long.webp",
    w: 1170,
    h: 3492,
    bars: { src: "altime/group-chrome.webp", top: 66 / 844, bottom: 89 / 844 },
    tap: { x: 83, y: 4.2 },
  },
  { chapter: "altime", src: "altime/buy.webp", w: 1170, h: 2532 },
  { chapter: "quantix", src: "quantix/home-long.webp", w: 1170, h: 12600, light: true, tap: { x: 80, y: 3.8 } },
  { chapter: "quantix", src: "quantix/register.webp", w: 1170, h: 2532, light: true },
  { chapter: "zfinde", src: "zfinde/form.webp", w: 1170, h: 2532, tap: { x: 26, y: 37.4 } },
  { chapter: "zfinde", src: "zfinde/results-long.webp", w: 1170, h: 9456 },
].map((s) => ({
  ...s,
  src: MEDIA + s.src,
  bars: s.bars ? { ...s.bars, src: MEDIA + s.bars.src } : null,
  long: s.h > 2532,
}));

const CHAPTER_META = {
  altime: {
    name: "ALTIME AI",
    mark: "ALTIME",
    accent: "#f43f75",
    side: "right",
    link: "https://max.ru/se13793521_bot",
    stack: ["Next.js 16", "TypeScript", "Prisma", "PostgreSQL", "Gemini", "YooKassa"],
  },
  quantix: {
    name: "QUANTIX",
    mark: "QUANTIX",
    accent: "#3b6ff5",
    side: "left",
    link: "https://quantix-five.vercel.app/",
    stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "AI / OCR", "Yandex Cloud"],
  },
  zfinde: {
    name: "ZFINDE",
    mark: "ZFINDE",
    accent: "#f0a83a",
    side: "right",
    link: "https://zfinde.vercel.app/",
    stack: ["Next.js", "React", "OpenStreetMap", "Vercel"],
  },
};

export const CHAPTERS = Object.entries(CHAPTER_META).map(([id, meta]) => {
  const copy = t(`showcase.chapters.${id}`);
  const screens = SCREENS.map((s, i) => ({ ...s, index: i })).filter((s) => s.chapter === id);
  return { id, ...meta, ...copy, screens };
});
