import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { shouldReduceMotion } from "../hooks/useMotionPreference.js";

/**
 * Появление элемента при попадании во вьюпорт (однократно): сдвиг + лёгкий
 * scale-in + blur-to-sharp — не плоский opacity-фейд.
 *
 * Переведён с framer-motion на GSAP: на сайте остаётся одна система
 * скролл-анимации, а не две параллельных. Публичный API компонента не
 * изменился, поэтому все существующие вызовы работают как раньше.
 */
export default function FadeIn({
  as = "div",
  delay = 0,
  duration = 0.9,
  x = 0,
  y = 46,
  scale = 0.94,
  blur = 8,
  className,
  style,
  children,
}) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ all: "all", reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
        const el = ref.current;
        if (!el) return;

        // При reduced-motion контент показывается сразу и не зависит от
        // скролла: ScrollTrigger здесь оставлять нельзя — когда About
        // перестаёт пиниться, высота страницы меняется, позиции триггеров
        // устаревают, и часть элементов так и не проявляется.
        if (shouldReduceMotion(context.conditions.reduced)) {
          gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1, filter: "none" });
          return;
        }

        gsap.fromTo(
          el,
          { opacity: 0, x, y, scale, filter: `blur(${blur}px)` },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            delay,
            duration,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 98%", once: true },
          }
        );
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [] }
  );

  const Tag = as;
  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
