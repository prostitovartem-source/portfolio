import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { shouldReduceMotion } from "../hooks/useMotionPreference.js";

/**
 * Связка между секциями: тонкая линия дочерчивается по скроллу и приводит
 * к узлу следующего раздела. Нужна, чтобы переход не читался как «секция
 * кончилась», а как продолжение одной системы.
 *
 * label — короткая техническая подпись перехода (архитектура → продукт).
 */
export default function SectionBridge({ label }) {
  const rootRef = useRef(null);
  const lineRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ all: "all", reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
        const reduced = shouldReduceMotion(context.conditions.reduced);
        const q = (s) => rootRef.current.querySelectorAll(s);

        if (reduced) {
          gsap.set(lineRef.current, { scaleY: 1 });
          gsap.set([...q(".bridge-label"), ...q(".bridge-dot")], { opacity: 1 });
          return;
        }

        gsap.set(lineRef.current, { scaleY: 0, transformOrigin: "top" });
        gsap.set([...q(".bridge-label"), ...q(".bridge-dot")], { opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 92%",
            end: "bottom 45%",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(lineRef.current, { scaleY: 1, duration: 1, ease: "none" }, 0);
        tl.to(q(".bridge-label"), { opacity: 1, duration: 0.3 }, 0.15);
        tl.to(q(".bridge-dot"), { opacity: 1, duration: 0.25 }, 0.8);
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [] }
  );

  return (
    <div ref={rootRef} className="bridge" aria-hidden="true">
      <span ref={lineRef} className="bridge-line" />
      {label ? <span className="bridge-label">{label}</span> : null}
      <span className="bridge-dot" />
    </div>
  );
}
