import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion.js";

function Char({ children, range, progress }) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span style={{ opacity: 0.2 }}>{children}</span>
      <motion.span style={{ position: "absolute", left: 0, top: 0, opacity }}>
        {children}
      </motion.span>
    </span>
  );
}

/** Текст, проявляющийся посимвольно по мере прокрутки мимо него. При prefers-reduced-motion рендерится статично, без scroll-биндинга. */
export default function AnimatedText({ text, className, style }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });

  if (reduced) {
    return (
      <p ref={ref} className={className} style={style}>
        {text}
      </p>
    );
  }

  const chars = text.split("");

  return (
    <p ref={ref} className={className} style={style}>
      {chars.map((char, i) => {
        // Пробел — обычный текстовый узел, не span. display:inline-block на
        // пробеле схлопывался в 0 на границе переноса строки (чаще на узких
        // мобильных экранах, где слова переносятся значительно чаще), из-за
        // чего текст визуально "слипался" в одно слово.
        if (char === " ") return " ";
        const start = i / chars.length;
        const end = start + 1 / chars.length;
        return (
          <Char key={i} range={[start, end]} progress={scrollYProgress}>
            {char}
          </Char>
        );
      })}
    </p>
  );
}
