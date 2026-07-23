import { useEffect, useRef, useState } from "react";

const ROW_1 = ["React", "TypeScript", "Next.js", "Node.js", "Three.js", "Framer Motion", "Vite"];
const ROW_2 = ["PostgreSQL", "Prisma", "AI Integration", "REST API", "Git", "Clean Code", "CI/CD"];

function tripled(items) {
  return [...items, ...items, ...items];
}

function MarqueeRow({ items, translateX }) {
  return (
    <div className="marquee-row" style={{ transform: `translateX(${translateX}px)`, willChange: "transform" }}>
      {tripled(items).map((item, i) => (
        <div key={`${item}-${i}`} className="marquee-tile">
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

export default function MarqueeSection() {
  const sectionRef = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const el = sectionRef.current;
      if (!el) return;
      const sectionTop = el.getBoundingClientRect().top + window.scrollY;
      const next = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(next);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="marquee-section">
      <MarqueeRow items={ROW_1} translateX={offset - 200} />
      <MarqueeRow items={ROW_2} translateX={-(offset - 200)} />
    </section>
  );
}
