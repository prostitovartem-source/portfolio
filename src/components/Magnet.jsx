import { useEffect, useRef, useState } from "react";

/** Элемент притягивается к курсору, когда тот оказывается рядом (в радиусе padding). */
export default function Magnet({
  children,
  padding = 100,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
  className,
  style,
}) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [transition, setTransition] = useState(inactiveTransition);

  useEffect(() => {
    function handleMouseMove(e) {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      const distX = Math.max(0, Math.abs(dx) - rect.width / 2);
      const distY = Math.max(0, Math.abs(dy) - rect.height / 2);
      const distance = Math.hypot(distX, distY);

      if (distance < padding) {
        setTransition(activeTransition);
        setOffset({ x: dx / strength, y: dy / strength });
      } else {
        setTransition(inactiveTransition);
        setOffset({ x: 0, y: 0 });
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [padding, strength, activeTransition, inactiveTransition]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
