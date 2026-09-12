import ru from "./locales/ru.js";
import en from "./locales/en.js";

const LOCALES = { ru, en };
const STORAGE_KEY = "copick:lang";
export const DEFAULT_LOCALE = "ru";

/**
 * Язык переключается перезагрузкой страницы — тем же приёмом, что уже
 * используется в этом проекте для смены motion-предпочтения
 * (см. MotionToggle/MotionPrompt): пересобрать на лету все GSAP-таймлайны
 * с их ScrollTrigger-пинами (About, WhatIDo, TechArchitecture) safely
 * нельзя — размеры текста меняются при смене языка, старые измерения
 * останутся в замерах пина. Перезагрузка даёт гарантированно чистый пересчёт
 * без риска сломанных сцен, и делает язык обычным module-level синглтоном:
 * компонентам не нужен React Context, достаточно вызвать t() при рендере.
 */
function detectLocale() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "ru" || stored === "en") return stored;
  } catch {
    // localStorage недоступен (приватный режим, политика браузера) — тихо
    // остаёмся на дефолтном языке.
  }
  return DEFAULT_LOCALE;
}

export const locale = detectLocale();
const dict = LOCALES[locale] ?? LOCALES[DEFAULT_LOCALE];

function getPath(obj, path) {
  return path.split(".").reduce((node, key) => (node == null ? node : node[key]), obj);
}

/** Достаёт строку по ключу вида "about.heading". Отсутствие ключа в EN
 * тихо откатывается на RU (никогда не показываем пользователю сырой ключ),
 * с предупреждением в dev-консоли, чтобы пропуск был заметен при переводе. */
export function t(key) {
  const value = getPath(dict, key);
  if (value === undefined) {
    const fallback = getPath(LOCALES.ru, key);
    if (import.meta.env.DEV) {
      console.warn(`[i18n] missing key "${key}" for locale "${locale}"`);
    }
    return fallback ?? key;
  }
  return value;
}

export function isEn() {
  return locale === "en";
}

/** Сохраняет выбор и перезагружает страницу — см. комментарий выше. */
export function setLocale(next) {
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* не критично: просто не запомним выбор */
  }
  window.location.reload();
}
