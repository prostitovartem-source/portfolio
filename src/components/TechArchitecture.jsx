import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Стек как архитектура, а не облако логотипов: слои идут сверху вниз и
 * собираются по скроллу тем же языком, что и таймлайн в About — хребет,
 * узлы, связи. Технологии — ровно те, что реально используются в проекте.
 *
 * level отражает роль, а не «качество»: core — то, на чём пишется основное,
 * tool — рабочий инструмент, ai — AI-слой.
 */
const LAYERS = [
  {
    id: "frontend",
    title: "Frontend",
    note: "интерфейс и взаимодействие",
    nodes: [
      { label: "TypeScript", level: "core" },
      { label: "React", level: "core" },
      { label: "Next.js", level: "core" },
      { label: "JavaScript", level: "core" },
      { label: "HTML", level: "tool" },
      { label: "CSS", level: "tool" },
      { label: "Tailwind", level: "tool" },
      { label: "Framer Motion", level: "tool" },
      { label: "Three.js", level: "tool" },
      { label: "GSAP", level: "tool" },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    note: "логика и API",
    nodes: [{ label: "Node.js", level: "core" }],
  },
  {
    id: "data",
    title: "Данные",
    note: "хранение и доступ",
    nodes: [
      { label: "Prisma", level: "tool" },
      { label: "PostgreSQL", level: "tool" },
    ],
  },
  {
    id: "ai",
    title: "AI",
    note: "модели внутри продукта",
    nodes: [
      { label: "AI APIs", level: "ai" },
      { label: "Python", level: "ai" },
    ],
  },
];

export default function TechArchitecture() {
  const rootRef = useRef(null);
  const spineRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ all: "all", reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
        const { reduced } = context.conditions;
        const q = (s) => rootRef.current.querySelectorAll(s);

        if (reduced) {
          gsap.set([...q(".arch-layer"), ...q(".arch-node"), ...q(".arch-core")], { opacity: 1, y: 0 });
          gsap.set(spineRef.current, { scaleY: 1 });
          return;
        }

        gsap.set(spineRef.current, { scaleY: 0, transformOrigin: "top" });
        gsap.set(q(".arch-layer"), { opacity: 0, y: 26 });
        gsap.set(q(".arch-node"), { opacity: 0, y: 14 });
        gsap.set(q(".arch-core"), { opacity: 0, y: 20 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 78%",
            end: "bottom 62%",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        // Хребет тянется на всю высоту, слои садятся на него по очереди.
        tl.to(spineRef.current, { scaleY: 1, duration: LAYERS.length, ease: "none" }, 0);

        LAYERS.forEach((layer, i) => {
          tl.to(q(`.arch-layer-${layer.id}`), { opacity: 1, y: 0, duration: 0.45 }, i * 0.9);
          tl.to(
            q(`.arch-layer-${layer.id} .arch-node`),
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.035 },
            i * 0.9 + 0.15
          );
        });

        // Финал: всё сходится в одно — тот же приём, что и «Продукт» в About.
        tl.to(q(".arch-core"), { opacity: 1, y: 0, duration: 0.5 }, LAYERS.length * 0.9);
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [] }
  );

  return (
    <div ref={rootRef} className="arch">
      <span ref={spineRef} className="arch-spine" aria-hidden="true" />

      {LAYERS.map((layer) => (
        <div key={layer.id} className={`arch-layer arch-layer-${layer.id}`}>
          <div className="arch-layer-head">
            <span className="arch-layer-dot" aria-hidden="true" />
            <h3 className="arch-layer-title">{layer.title}</h3>
            <span className="arch-layer-note">{layer.note}</span>
          </div>

          <ul className="arch-nodes">
            {layer.nodes.map((n) => (
              <li key={n.label} className={`arch-node arch-node-${n.level}`}>
                {n.label}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="arch-core">
        <span className="arch-core-dot" aria-hidden="true" />
        <b className="arch-core-title">Full Stack</b>
        <span className="arch-core-note">продукт целиком — от интерфейса до базы данных</span>
      </div>
    </div>
  );
}
