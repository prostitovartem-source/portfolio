import { useEffect, useRef } from "react";
import gsap from "gsap";
import { shouldReduceMotion } from "../hooks/useMotionPreference.js";

/**
 * Элемент притягивается к курсору, когда тот оказывается рядом (в радиусе
 * padding), и пружинисто возвращается, когда курсор уходит. Движение через
 * GSAP - без React-состояния на каждый mousemove (раньше каждый
 * Magnet на странице ререндерился от любого движения мыши).
 * Отключается на touch-устройствах и при reduced-motion.
 */
export default function Magnet({ children, padding = 90, strength = 4, className, style }) {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches || shouldReduceMotion()) return;
    const el = ref.current;

    let inside = false;

    function handleMouseMove(e) {
      // Считаем от исходного положения, без текущего сдвига магнита -
      // иначе элемент «убегает» за курсором.
      const rect = el.getBoundingClientRect();
      const tx = gsap.getProperty(el, "x");
      const ty = gsap.getProperty(el, "y");
      const cx = rect.left - tx + rect.width / 2;
      const cy = rect.top - ty + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const distance = Math.hypot(
        Math.max(0, Math.abs(dx) - rect.width / 2),
        Math.max(0, Math.abs(dy) - rect.height / 2)
      );

      if (distance < padding) {
        inside = true;
        // overwrite:"auto" гасит предыдущий твин по тем же свойствам,
        // включая пружинный возврат, если курсор вернулся посреди него.
        gsap.to(el, { x: dx / strength, y: dy / strength, duration: 0.35, ease: "power3.out", overwrite: "auto" });
      } else if (inside) {
        inside = false;
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)", overwrite: "auto" });
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.killTweensOf(el);
    };
  }, [padding, strength]);

  return (
    <div ref={ref} className={className} style={{ ...style, display: "inline-flex", willChange: "transform" }}>
      {children}
    </div>
  );
}
