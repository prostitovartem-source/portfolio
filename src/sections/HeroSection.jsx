import { lazy, Suspense, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FadeIn from "../components/FadeIn.jsx";
import Magnet from "../components/Magnet.jsx";
import ContactButton from "../components/ContactButton.jsx";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion.js";
import useIntroReady from "../hooks/useIntroReady.js";
import { t } from "../i18n/index.js";

// Three.js/@react-three/fiber/drei - тяжёлый кусок бандла, живёт в
// отдельном чанке и подгружается уже после первой отрисовки текста/CTA.
const HeroScene = lazy(() => import("./HeroScene.jsx"));

function useIsMobile() {
  const [mobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  return mobile;
}

const TITLE_EASE = [0.16, 1, 0.3, 1];

/**
 * Первая строка собирается побуквенно: каждая буква выезжает из-под маски
 * строки со своей задержкой. Для скринридеров - целое слово в aria-label.
 */
function CharLine({ text, delay, play, reducedMotion }) {
  return (
    <span className="hero-title-line-mask">
      <span className="sr-only">{text}</span>
      <span className="hero-title-chars" aria-hidden="true">
        {Array.from(text).map((ch, i) => (
          <motion.span
            key={i}
            className="hero-title-char"
            initial={reducedMotion ? { opacity: 0 } : { y: "115%", rotate: 8, opacity: 0 }}
            animate={play ? { y: "0%", rotate: 0, opacity: 1 } : undefined}
            transition={
              reducedMotion ? { duration: 0.2 } : { duration: 0.95, delay: delay + i * 0.035, ease: TITLE_EASE }
            }
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        ))}
      </span>
    </span>
  );
}

/**
 * Градиентная строка анимируется целиком: побуквенный transform ломает
 * background-clip:text в Chromium. Вместо этого - подъём из маски и
 * шторка clip-path слева направо, градиент остаётся цельным.
 */
function TitleLine({ children, delay, play, reducedMotion, className }) {
  return (
    <span className="hero-title-line-mask">
      <motion.span
        className={className}
        initial={
          reducedMotion
            ? { opacity: 0 }
            : { y: "100%", opacity: 0, clipPath: "inset(0% 100% 0% 0%)" }
        }
        animate={play ? { y: "0%", opacity: 1, clipPath: "inset(0% 0% 0% 0%)" } : undefined}
        transition={reducedMotion ? { duration: 0.2 } : { duration: 1.1, delay, ease: TITLE_EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function HeroSection() {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const introReady = useIntroReady();
  const sectionRef = useRef(null);

  // Скролл влияет на сцену напрямую: content уходит вверх и тает, а
  // scrollYProgress (MotionValue) читается внутри HeroScene через .get() -
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
        <FadeIn onIntro delay={0} y={12} className="hero-kicker">
          COPICK
        </FadeIn>

        <FadeIn onIntro delay={0.05} y={16} className="hero-status">
          <span className="hero-status-dot" />
          {t("hero.status")}
        </FadeIn>

        <h1 className="hero-title-main">
          <CharLine text="Full-Stack" delay={0.1} play={introReady} reducedMotion={reducedMotion} />
          <TitleLine delay={0.4} play={introReady} reducedMotion={reducedMotion} className="hero-title-accent">
            Web Developer
          </TitleLine>
        </h1>

        <FadeIn onIntro delay={0.7} y={20} className="hero-subtext">
          <p>{t("hero.description")}</p>
        </FadeIn>

        <FadeIn onIntro delay={0.85} y={20} className="hero-cta-row">
          <Magnet padding={90} strength={4}>
            <a href="#projects" className="btn-ghost" data-cursor-label="→">
              {t("hero.ctaProjects")}
            </a>
          </Magnet>
          <ContactButton href="#contact" label={t("nav.contactCta")} />
        </FadeIn>
      </motion.div>

      <FadeIn onIntro delay={1.2} y={0} className="hero-scroll-cue" aria-hidden="true">
        <span className="hero-scroll-label">{t("hero.scroll")}</span>
        <span className="hero-scroll-line" />
        <span className="hero-scroll-node" />
      </FadeIn>

      <FadeIn onIntro delay={1.1} y={0} className="hero-tech-meta" aria-hidden="true">
        React · TypeScript · Next.js · Node.js
      </FadeIn>
    </section>
  );
}
