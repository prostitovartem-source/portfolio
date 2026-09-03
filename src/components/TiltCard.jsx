import { useRef } from "react";

/**
 * 3D-наклон под курсор (perspective tilt) — прямая мутация DOM-стиля через
 * ref, без React state/ререндеров на каждый mousemove. Отключается на
 * touch-устройствах, где нет курсора для наклона.
 */
export default function TiltCard({ children, className, style, max = 10 }) {
  const ref = useRef(null);

  function handleMove(e) {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)", willChange: "transform" }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}
