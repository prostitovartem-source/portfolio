import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { shouldReduceMotion } from "../hooks/useMotionPreference.js";
import { play } from "../lib/sound.js";

/**
 * Заголовок секции, который проявляется построчно из-под маски - тот же
 * язык, что у заголовка в hero, вместо плоского fade.
 *
 * Градиент .hero-heading переносится с h2 на каждую строку: у строки
 * background-size = N высот, а позиция сдвинута на её номер - вместе
 * строки дают ровно тот же вертикальный градиент, что был у целого h2.
 * Иначе transform на строках ломает background-clip:text в Chromium.
 */
export default function SplitHeading({ lines, className = "", as = "h2", delay = 0 }) {
  const ref = useRef(null);
  const list = Array.isArray(lines) ? lines : [lines];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ all: "all", reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
        const inner = ref.current.querySelectorAll(".split-line-inner");
        if (shouldReduceMotion(context.conditions.reduced)) {
          gsap.set(inner, { yPercent: 0, rotate: 0, opacity: 1 });
          return;
        }
        gsap.fromTo(
          inner,
          { yPercent: 110, rotate: 4, opacity: 0 },
          {
            yPercent: 0,
            rotate: 0,
            opacity: 1,
            duration: 1.1,
            delay,
            ease: "expo.out",
            stagger: 0.12,
            onStart: () => play("reveal"),
            scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
          }
        );
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [] }
  );

  const Tag = as;
  return (
    <Tag ref={ref} className={`split-heading ${className}`} aria-label={list.join(" ")}>
      {list.map((line, i) => (
        <span key={i} className="split-line" aria-hidden="true">
          <span className="split-line-inner" style={{ "--i": i, "--n": list.length }}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
