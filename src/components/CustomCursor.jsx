import { useEffect, useRef, useState } from "react";

/**
 * Минимальный кастомный курсор: точка следует за мышью, увеличивается над
 * интерактивными элементами. Отключён на touch-устройствах и при
 * prefers-reduced-motion — ничего не ломает, просто не монтируется.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const [enabled] = useState(() => {
    if (typeof window === "undefined") return false;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return !isCoarse && !reduced;
  });
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState(null);

  useEffect(() => {
    if (!enabled) return;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    function handleMove(e) {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const el = dotRef.current;
      if (el) el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;

      const target = e.target.closest("a, button, [data-cursor]");
      setActive(!!target);
      setLabel(target?.getAttribute("data-cursor-label") ?? null);
    }

    function handleLeave() {
      setActive(false);
      setLabel(null);
    }

    document.body.classList.add("has-custom-cursor");
    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseleave", handleLeave);
    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={dotRef} className={`custom-cursor ${active ? "custom-cursor-active" : ""}`} aria-hidden="true">
      {label && <span className="custom-cursor-label">{label}</span>}
    </div>
  );
}
