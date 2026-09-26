import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { shouldReduceMotion } from "../hooks/useMotionPreference.js";

gsap.registerPlugin(ScrollTrigger);

/**
 * Глобальные «фоновые» скролл-эффекты, которые не принадлежат одной секции:
 * большие номера секций (01, 02...) плывут медленнее контента - глубина
 * без лишнего шума. Ничего не рендерит.
 */
export default function ScrollFx() {
  useGSAP(() => {
    if (shouldReduceMotion()) return;

    gsap.utils.toArray(".section-number").forEach((num) => {
      const section = num.closest("section") ?? num.parentElement;
      gsap.fromTo(
        num,
        { yPercent: -35 },
        {
          yPercent: 35,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    });
  }, []);

  return null;
}
