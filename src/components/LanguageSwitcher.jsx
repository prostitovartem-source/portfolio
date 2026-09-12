import { useState } from "react";
import { locale, setLocale, t } from "../i18n/index.js";

/**
 * RU / EN — переключение перезагружает страницу (см. комментарий в
 * i18n/index.js: единственный безопасный способ пересобрать все
 * GSAP/ScrollTrigger-пины с новыми размерами текста). Короткая пауза перед
 * перезагрузкой даёт странице заметно "выдохнуть" вместо мгновенного
 * обрыва — переключение читается как решение, а не как баг.
 */
export default function LanguageSwitcher({ className }) {
  const [leaving, setLeaving] = useState(false);

  function choose(next) {
    if (next === locale || leaving) return;
    setLeaving(true);
    document.documentElement.classList.add("lang-leaving");
    setTimeout(() => setLocale(next), 260);
  }

  return (
    <div
      className={`lang-switch ${className ?? ""}`}
      role="group"
      aria-label={t("langSwitch.ariaLabel")}
    >
      <button
        type="button"
        className={`lang-switch-btn ${locale === "ru" ? "lang-switch-active" : ""}`}
        aria-pressed={locale === "ru"}
        onClick={() => choose("ru")}
      >
        RU
      </button>
      <span className="lang-switch-sep" aria-hidden="true" />
      <button
        type="button"
        className={`lang-switch-btn ${locale === "en" ? "lang-switch-active" : ""}`}
        aria-pressed={locale === "en"}
        onClick={() => choose("en")}
      >
        EN
      </button>
    </div>
  );
}
