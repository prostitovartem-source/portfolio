import { lazy, Suspense, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FadeIn from "../components/FadeIn.jsx";
import Magnet from "../components/Magnet.jsx";
import ContactButton from "../components/ContactButton.jsx";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion.js";

// Three.js/@react-three/fiber/drei — тяжёлый кусок бандла, живёт в
// отдельном чанке и подгружается уже после первой отрисовки текста/CTA.
const HeroScene = lazy(() => import("./HeroScene.jsx"));

function useIsMobile() {
  const [mobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  return mobile;
}

const TITLE_EASE = [0.16, 1, 0.3, 1];

function TitleLine({ children, delay, reducedMotion, className }) {
  return (
    <span className="hero-title-line-mask">
      <motion.span
        className={className}
        initial={reducedMotion ? { opacity: 0 } : { y: "110%", opacity: 0, filter: "blur(10px)" }}
        animate={reducedMotion ? { opacity: 1 } : { y: "0%", opacity: 1, filter: "blur(0px)" }}
        transition={reducedMotion ? { duration: 0.2 } : { duration: 0.9, delay, ease: TITLE_EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function HeroSection() {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const sectionRef = useRef(null);

  // Скролл влияет на сцену напрямую: content уходит вверх и тает, а
  // scrollYProgress (MotionValue) читается внутри HeroScene через .get() —
  // без лишних React-ререндеров на каждый пиксель скролла.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -70]);

  return (
    <section ref={sectionRef} className="hero" id="hero" style={{ overflowX: "clip" }}>
      <div className="hero-visual" aria-hidden="true">
        <Suspense fallback={null}>
          <HeroScene reducedMotion={reducedMotion} isMobile={isMobile} scrollProgress={scrollYProgress} />
        </Suspense>
      </div>

      <motion.div
        className="hero-content"
        style={reducedMotion ? undefined : { opacity: contentOpacity, y: contentY }}
      >
        <FadeIn delay={0.05} y={12} className="hero-kicker">
          COPICK
        </FadeIn>

        <FadeIn delay={0.15} y={16} className="hero-status">
          <span className="hero-status-dot" />
          Открыт к проектам
        </FadeIn>

        <h1 className="hero-title-main">
          <TitleLine delay={0.35} reducedMotion={reducedMotion}>
            Full-Stack
          </TitleLine>
          <TitleLine delay={0.48} reducedMotion={reducedMotion} className="hero-title-accent">
            Web Developer
          </TitleLine>
        </h1>

        <FadeIn delay={0.75} y={20} className="hero-subtext">
          <p>
            Создаю современные сайты, веб-приложения и цифровые продукты —
            от идеи до готового решения.
          </p>
        </FadeIn>

        <FadeIn delay={0.9} y={20} className="hero-cta-row">
          <Magnet padding={90} strength={4}>
            <a href="#projects" className="btn-ghost" data-cursor-label="→">
              Смотреть проекты
            </a>
          </Magnet>
          <ContactButton href="#contact" label="Написать мне" />
        </FadeIn>
      </motion.div>

      <FadeIn delay={1.2} y={0} className="hero-scroll-cue" aria-hidden="true">
        <span className="hero-scroll-line" />
        <span className="hero-scroll-label">Скролл</span>
      </FadeIn>
    </section>
  );
}
