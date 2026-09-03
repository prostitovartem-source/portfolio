import { motion } from "framer-motion";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion.js";

const EASE = [0.16, 1, 0.3, 1];

/**
 * Появление элемента при попадании во вьюпорт (однократно): сдвиг + лёгкий
 * scale-in + blur-to-sharp — не плоский opacity-фейд. Учитывает
 * prefers-reduced-motion — при активной настройке появляется почти
 * мгновенно, без сдвига/scale/blur.
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
  const MotionTag = motion[as] ?? motion.div;
  const reduced = usePrefersReducedMotion();

  return (
    <MotionTag
      className={className}
      style={style}
      initial={
        reduced
          ? { opacity: 0 }
          : { opacity: 0, x, y, scale, filter: `blur(${blur}px)` }
      }
      whileInView={
        reduced
          ? { opacity: 1 }
          : { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }
      }
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={reduced ? { duration: 0.15 } : { delay, duration, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}
