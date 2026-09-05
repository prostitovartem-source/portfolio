import { useEffect, useState } from "react";

const KEY = "copick:motion";

/**
 * Единый источник правды о том, показывать ли движение.
 *
 * Приоритет: осознанный выбор человека на сайте > настройка системы.
 * По умолчанию (выбора нет) уважаем prefers-reduced-motion — это сигнал
 * доступности, для части людей движение вызывает физическое недомогание.
 * Но у настройки есть и вторая, куда более частая причина: в Windows
 * анимации нередко выключены «ради производительности», и человек не знает,
 * что это влияет на сайты. Поэтому мы не переопределяем настройку молча,
 * а даём выбор и запоминаем его.
 */
export function readMotionChoice() {
  try {
    const v = localStorage.getItem(KEY);
    return v === "full" || v === "reduced" ? v : null;
  } catch {
    // localStorage может быть недоступен (приватный режим, политика браузера)
    return null;
  }
}

export function writeMotionChoice(value) {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    /* не критично: просто не запомним выбор */
  }
}

export function systemPrefersReduced() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Итоговое решение для анимационного кода. Вызывается внутри GSAP-колбэков,
 * поэтому это обычная функция, а не хук.
 */
export function shouldReduceMotion(systemReduced = systemPrefersReduced()) {
  const choice = readMotionChoice();
  if (choice === "full") return false;
  if (choice === "reduced") return true;
  return systemReduced;
}

/** Реактивная версия для React-компонентов (Hero, футер, подсказка). */
export default function useMotionPreference() {
  const [state, setState] = useState(() => ({
    system: systemPrefersReduced(),
    choice: readMotionChoice(),
  }));

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e) => setState((s) => ({ ...s, system: e.matches }));
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return {
    systemReduced: state.system,
    choice: state.choice,
    reduced: shouldReduceMotion(state.system),
  };
}
