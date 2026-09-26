import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { shouldReduceMotion } from "../hooks/useMotionPreference.js";

/**
 * Кастомный курсор: точка мягко догоняет мышь (gsap.quickTo), над
 * интерактивными элементами раскрывается в кольцо с подписью.
 * React-состояние меняется только при смене цели под курсором, а не на
 * каждый mousemove. Отключён на touch-устройствах и при reduced-motion.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const [enabled] = useState(() => {
    if (typeof window === "undefined") return false;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    return !isCoarse && !shouldReduceMotion();
  });
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState(null);

  useEffect(() => {
    if (!enabled) return;
    const el = dotRef.current;

    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.18, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.18, ease: "power3.out" });

    let lastTarget = null;
    let visible = false;

    function handleMove(e) {
      if (!visible) {
        // Первое появление - без «прилёта» из угла экрана.
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { opacity: 1, duration: 0.25 });
        visible = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);

      const target = e.target.closest?.("a, button, [data-cursor]") ?? null;
      if (target !== lastTarget) {
        lastTarget = target;
        setActive(!!target);
        setLabel(target?.getAttribute("data-cursor-label") ?? null);
      }
    }

    function handleLeave() {
      visible = false;
      lastTarget = null;
      gsap.to(el, { opacity: 0, duration: 0.2 });
      setActive(false);
      setLabel(null);
    }

    function handleDown() {
      gsap.to(el, { scale: 0.8, duration: 0.15, ease: "power2.out" });
    }
    function handleUp() {
      gsap.to(el, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });
    }

    document.body.classList.add("has-custom-cursor");
    window.addEventListener("mousemove", handleMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleLeave);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", handleMove);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      gsap.killTweensOf(el);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={dotRef} className={`custom-cursor ${active ? "custom-cursor-active" : ""}`} aria-hidden="true">
      {label && <span className="custom-cursor-label">{label}</span>}
    </div>
  );
}
