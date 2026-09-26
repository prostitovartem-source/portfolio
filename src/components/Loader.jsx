import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { markIntroReady } from "../lib/intro.js";
import { shouldReduceMotion } from "../hooks/useMotionPreference.js";

/**
 * Короткий экран загрузки - ждёт готовности шрифтов (или максимум 700мс,
 * без искусственных задержек). Уходит шторкой вверх, и в момент, когда
 * шторка открывает сцену, отдаёт сигнал markIntroReady - интро hero
 * стартует именно тогда, а не под лоадером.
 */
export default function Loader() {
  const rootRef = useRef(null);
  const countRef = useRef(null);
  const fillRef = useRef(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const reduced = shouldReduceMotion();
    const counter = { v: 0 };
    let cancelled = false;

    // Счётчик и полоса едут одним твином к 96, финальный рывок к 100 -
    // после реальной готовности. Без setState на каждый кадр.
    const render = () => {
      const v = Math.round(counter.v);
      if (countRef.current) countRef.current.textContent = String(v).padStart(2, "0");
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${counter.v / 100})`;
    };
    const progress = gsap.to(counter, { v: 96, duration: 0.6, ease: "power2.out", onUpdate: render });

    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    const minTime = new Promise((resolve) => setTimeout(resolve, 300));
    const maxTime = new Promise((resolve) => setTimeout(resolve, 700));

    let exit;
    Promise.race([Promise.all([fontsReady, minTime]), maxTime]).then(() => {
      if (cancelled) return;
      progress.kill();

      if (reduced) {
        counter.v = 100;
        render();
        exit = gsap.to(root, {
          opacity: 0,
          duration: 0.3,
          onStart: markIntroReady,
          onComplete: () => setDone(true),
        });
        return;
      }

      exit = gsap
        .timeline({ onComplete: () => setDone(true) })
        .to(counter, { v: 100, duration: 0.25, ease: "power1.out", onUpdate: render })
        .to(root.querySelector(".loader-inner"), { y: -40, opacity: 0, duration: 0.45, ease: "power3.in" }, "+=0.05")
        // Шторка: clip-path уезжает вверх, снизу открывается сайт.
        .to(root, { clipPath: "inset(0 0 100% 0)", duration: 0.8, ease: "expo.inOut" }, "-=0.15")
        // Интро стартует, когда шторка прошла примерно треть пути.
        .call(markIntroReady, null, "-=0.55");
    });

    return () => {
      cancelled = true;
      progress.kill();
      exit?.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div ref={rootRef} className="loader" aria-hidden="true" style={{ clipPath: "inset(0 0 0% 0)" }}>
      <div className="loader-inner">
        <span className="loader-brand">COPICK</span>
        <span ref={countRef} className="loader-count">
          00
        </span>
        <div className="loader-bar">
          <div ref={fillRef} className="loader-bar-fill" />
        </div>
      </div>
    </div>
  );
}
