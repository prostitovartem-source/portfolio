import { useEffect, useState } from "react";

/**
 * Единый источник правды для prefers-reduced-motion. Раньше глобальный CSS
 * (App.css) гасил только CSS transition/animation — JS-анимации Framer
 * Motion (FadeIn, AnimatedText, вход Hero-заголовка) это не затрагивало и
 * человек с этой настройкой всё равно видел полное движение. Хук читает
 * live-значение и подписывается на смену системной настройки.
 */
export default function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
