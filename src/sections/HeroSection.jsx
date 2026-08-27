import { lazy, Suspense, useState } from "react";
import { motion } from "framer-motion";
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

export default function HeroSection() {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  return (
    <section className="hero" id="hero" style={{ overflowX: "clip" }}>
      <div className="hero-visual" aria-hidden="true">
        <Suspense fallback={null}>
          <HeroScene reducedMotion={reducedMotion} isMobile={isMobile} />
        </Suspense>
      </div>

      <div className="hero-content">
        <FadeIn delay={0.05} y={12} className="hero-kicker">
          COPICK
        </FadeIn>

        <FadeIn delay={0.15} y={16} className="hero-status">
          <span className="hero-status-dot" />
          Открыт к проектам
        </FadeIn>

        <motion.h1
          className="hero-title-main"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0.2 : 1, delay: reducedMotion ? 0 : 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span>Full-Stack</span>
          <span className="hero-title-accent">Web Developer</span>
        </motion.h1>

        <FadeIn delay={0.6} y={20} className="hero-subtext">
          <p>
            Создаю современные сайты, веб-приложения и цифровые продукты —
            от идеи до готового решения.
          </p>
        </FadeIn>

        <FadeIn delay={0.75} y={20} className="hero-cta-row">
          <Magnet padding={70} strength={7}>
            <a href="#projects" className="btn-ghost" data-cursor-label="→">
              Смотреть проекты
            </a>
          </Magnet>
          <ContactButton href="#contact" label="Написать мне" />
        </FadeIn>
      </div>

      <FadeIn delay={1.1} y={0} className="hero-scroll-cue" aria-hidden="true">
        <span className="hero-scroll-line" />
        <span className="hero-scroll-label">Скролл</span>
      </FadeIn>
    </section>
  );
}
