import { motion } from "framer-motion";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion.js";

const EASE = [0.25, 0.1, 0.25, 1];

/** Появление элемента при попадании во вьюпорт (однократно). Учитывает prefers-reduced-motion — при активной настройке появляется почти мгновенно, без сдвига. */
export default function FadeIn({
  as = "div",
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
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
      initial={{ opacity: 0, x: reduced ? 0 : x, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={reduced ? { duration: 0.15 } : { delay, duration, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}
