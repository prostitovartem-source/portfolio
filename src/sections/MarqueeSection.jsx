import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { shouldReduceMotion } from "../hooks/useMotionPreference.js";

gsap.registerPlugin(ScrollTrigger);

const ROW_1 = ["React", "TypeScript", "Next.js", "Node.js", "Three.js", "Framer Motion", "Vite"];
const ROW_2 = ["PostgreSQL", "Prisma", "AI Integration", "REST API", "Git", "Clean Code", "CI/CD"];

// Базовый дрейф в px/сек и насколько скорость скролла его разгоняет.
const BASE_SPEED = 40;
const VELOCITY_GAIN = 0.35;
const MAX_SKEW = 7;

function tripled(items) {
  return [...items, ...items, ...items];
}

function MarqueeRow({ items, rowRef }) {
  return (
    <div ref={rowRef} className="marquee-row">
      {tripled(items).map((item, i) => (
        <div key={`${item}-${i}`} className="marquee-tile" aria-hidden={i >= items.length ? "true" : undefined}>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Две ленты стека: постоянно дрейфуют навстречу друг другу, скролл их
 * разгоняет и слегка наклоняет (skew от скорости), направление следует за
 * направлением скролла. Всё на GSAP-тикере без React-ререндеров; тикер
 * крутится только пока секция на экране.
 */
export default function MarqueeSection() {
  const sectionRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);

  useGSAP(
    () => {
      const rows = [row1Ref.current, row2Ref.current];
      if (shouldReduceMotion()) {
        gsap.set(rows[0], { x: -200 });
        gsap.set(rows[1], { x: -400 });
        return;
      }

      // Ширина одного набора плиток (лента утроена) - период зацикливания.
      let period = rows.map((r) => r.scrollWidth / 3);
      const onResize = () => (period = rows.map((r) => r.scrollWidth / 3));
      window.addEventListener("resize", onResize);

      const pos = [-period[0] * 0.3, -period[1] * 0.6];
      let direction = 1;
      let velocity = 0;
      const setX = rows.map((r) => gsap.quickSetter(r, "x", "px"));
      const skewTo = rows.map((r) => gsap.quickTo(r, "skewX", { duration: 0.6, ease: "power3.out" }));

      const tick = (_, deltaMs) => {
        const dt = Math.min(deltaMs, 50) / 1000;
        // Скорость скролла плавно затухает, базовый дрейф остаётся.
        velocity *= 0.92;
        const speed = BASE_SPEED + Math.abs(velocity) * VELOCITY_GAIN;
        pos[0] = gsap.utils.wrap(-period[0], 0, pos[0] + speed * dt * direction);
        pos[1] = gsap.utils.wrap(-period[1], 0, pos[1] - speed * dt * direction);
        setX[0](pos[0]);
        setX[1](pos[1]);
        // Наклон следует за затухающей скоростью и сам возвращается в ноль.
        const skew = gsap.utils.clamp(-MAX_SKEW, MAX_SKEW, velocity / -250);
        skewTo[0](skew);
        skewTo[1](-skew);
      };

      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)),
        onUpdate: (self) => {
          const v = self.getVelocity();
          velocity = v;
          if (v !== 0) direction = v > 0 ? 1 : -1;
        },
      });

      tick(0, 0);

      return () => {
        st.kill();
        gsap.ticker.remove(tick);
        window.removeEventListener("resize", onResize);
      };
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section ref={sectionRef} className="marquee-section">
      <MarqueeRow items={ROW_1} rowRef={row1Ref} />
      <MarqueeRow items={ROW_2} rowRef={row2Ref} />
    </section>
  );
}
