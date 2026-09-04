import { useState } from "react";

// Позиции в процентах (совпадают 1:1 с SVG viewBox 0 0 100 100) — рукой
// расставленное созвездие по кластерам (frontend / backend-data / AI),
// а не физическая симуляция: для 15 узлов она не нужна и менее предсказуема.
const NODES = [
  { id: "typescript", label: "TypeScript", level: "core", x: 13, y: 14 },
  { id: "javascript", label: "JavaScript", level: "core", x: 6, y: 34 },
  { id: "react", label: "React", level: "core", x: 23, y: 30 },
  { id: "nextjs", label: "Next.js", level: "core", x: 35, y: 16 },
  { id: "html", label: "HTML", level: "tool", x: 19, y: 52 },
  { id: "css", label: "CSS", level: "tool", x: 33, y: 50 },
  { id: "tailwind", label: "Tailwind", level: "tool", x: 45, y: 36 },
  { id: "framer", label: "Framer Motion", level: "tool", x: 47, y: 10 },
  { id: "threejs", label: "Three.js", level: "tool", x: 61, y: 18 },
  { id: "gsap", label: "GSAP", level: "tool", x: 59, y: 2 },
  { id: "nodejs", label: "Node.js", level: "core", x: 67, y: 42 },
  { id: "prisma", label: "Prisma", level: "tool", x: 81, y: 32 },
  { id: "postgres", label: "PostgreSQL", level: "tool", x: 91, y: 46 },
  { id: "python", label: "Python", level: "ai", x: 73, y: 64 },
  { id: "aiapis", label: "AI APIs", level: "ai", x: 55, y: 68 },
];

const LINKS = [
  ["typescript", "react"],
  ["typescript", "nextjs"],
  ["react", "nextjs"],
  ["react", "javascript"],
  ["react", "html"],
  ["html", "css"],
  ["css", "tailwind"],
  ["react", "framer"],
  ["nextjs", "threejs"],
  ["threejs", "gsap"],
  ["nextjs", "nodejs"],
  ["nodejs", "prisma"],
  ["prisma", "postgres"],
  ["nodejs", "aiapis"],
  ["aiapis", "python"],
  ["python", "prisma"],
];

const ADJACENCY = LINKS.reduce((map, [a, b]) => {
  if (!map.has(a)) map.set(a, new Set());
  if (!map.has(b)) map.set(b, new Set());
  map.get(a).add(b);
  map.get(b).add(a);
  return map;
}, new Map());

const NODE_BY_ID = new Map(NODES.map((n) => [n.id, n]));

/**
 * Технологии как система связей, а не сетка логотипов: наведение/фокус на
 * узле подсвечивает его и связанные технологии, остальное притухает.
 * Уровень (core/tool/ai) даёт честную иерархию уверенности — без "плохих"
 * технологий, просто разная роль в стеке (см. About: AI как ускоритель,
 * не замена понимания).
 */
export default function TechConstellation() {
  const [activeId, setActiveId] = useState(null);
  const connected = activeId ? ADJACENCY.get(activeId) : null;

  function nodeState(id) {
    if (!activeId) return "idle";
    if (id === activeId || connected?.has(id)) return "active";
    return "dim";
  }

  return (
    <div className="constellation" role="group" aria-label="Технологический стек">
      <svg className="constellation-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {LINKS.map(([a, b]) => {
          const nodeA = NODE_BY_ID.get(a);
          const nodeB = NODE_BY_ID.get(b);
          const isActive = activeId && (a === activeId || b === activeId);
          const isDim = activeId && !isActive;
          return (
            <line
              key={`${a}-${b}`}
              x1={nodeA.x}
              y1={nodeA.y}
              x2={nodeB.x}
              y2={nodeB.y}
              className={`constellation-link${isActive ? " constellation-link-active" : ""}${isDim ? " constellation-link-dim" : ""}`}
            />
          );
        })}
      </svg>

      {NODES.map((node) => (
        <button
          key={node.id}
          type="button"
          className={`constellation-node constellation-node-${node.level} constellation-node-${nodeState(node.id)}`}
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          onMouseEnter={() => setActiveId(node.id)}
          onMouseLeave={() => setActiveId(null)}
          onFocus={() => setActiveId(node.id)}
          onBlur={() => setActiveId(null)}
        >
          {node.label}
        </button>
      ))}
    </div>
  );
}

/** Упрощённый вариант для узких экранов — та же иерархия уровней, без пространственного графа (читаемость важнее). */
export function TechConstellationMobile() {
  return (
    <div className="constellation-mobile">
      {NODES.map((node) => (
        <span key={node.id} className={`constellation-chip constellation-chip-${node.level}`}>
          {node.label}
        </span>
      ))}
    </div>
  );
}
