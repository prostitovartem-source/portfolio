import FadeIn from "../components/FadeIn.jsx";

const STACK_GROUPS = [
  { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Three.js", "Framer Motion"] },
  { category: "Backend", items: ["Node.js", "PostgreSQL", "Prisma"] },
  { category: "AI", items: ["AI Integration", "Replicate"] },
];

export default function StackSection() {
  return (
    <section className="stack" id="stack">
      <FadeIn delay={0} y={40}>
        <h2 className="hero-heading stack-heading">Technologies</h2>
      </FadeIn>

      <div className="stack-groups">
        {STACK_GROUPS.map((group, gi) => (
          <FadeIn key={group.category} delay={gi * 0.1} y={30} className="stack-group">
            <span className="stack-group-label">{group.category}</span>
            <div className="stack-group-items">
              {group.items.map((item) => (
                <span key={item} className="stack-chip">
                  {item}
                </span>
              ))}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
