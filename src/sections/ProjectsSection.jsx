import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { shouldReduceMotion } from "../hooks/useMotionPreference.js";
import FadeIn from "../components/FadeIn.jsx";
import LiveProjectButton from "../components/LiveProjectButton.jsx";
import TiltCard from "../components/TiltCard.jsx";

const PROJECTS = [
  {
    number: "01",
    title: "QWANTIX",
    category: "SaaS-продукт",
    featured: true,
    featuredLabel: "Флагманский проект",
    description:
      "AI SaaS-платформа для автоматизации учёта товаров и обработки накладных. Распознаёт документы с помощью AI, извлекает данные и помогает управлять складскими операциями.",
    tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "AI / OCR", "Yandex Cloud"],
    status: "live",
    link: "https://quantix-five.vercel.app/",
    ctaLabel: "Открыть QWANTIX",
    accent: "var(--accent-2)",
  },
  {
    number: "02",
    title: "ALTME AI",
    category: "AI-бот для MAX",
    featured: false,
    description:
      "AI-бот и мини-приложение внутри мессенджера MAX для генерации и стилизации фотографий. Загрузка фото, выбор AI-стиля или свой промпт, внутренняя валюта 🍓 и реферальная система — весь опыт целиком живёт в MAX, без отдельного сайта.",
    tech: ["Next.js", "React", "TypeScript", "Replicate", "Express"],
    status: "live",
    link: "https://max.ru/se13793521_bot",
    ctaLabel: "Открыть в MAX",
    accent: "var(--accent)",
  },
];

function ProjectCard({ project, index, total }) {
  const containerRef = useRef(null);
  const cardRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ all: "all", reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
        const reduced = shouldReduceMotion(context.conditions.reduced);
        const q = (s) => cardRef.current.querySelectorAll(s);
        const node = containerRef.current.querySelector(".project-node");

        if (reduced) {
          gsap.set([...q(".project-tech-chip"), node], { opacity: 1, y: 0, scale: 1 });
          return;
        }

        gsap.set(q(".project-tech-chip"), { opacity: 0, y: 10 });
        gsap.set(node, { opacity: 0, scale: 0.4 });

        // Карточка «подключается» к системе: сначала загорается узел на
        // связке, затем по очереди активируются технологии проекта.
        const reveal = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: { trigger: cardRef.current, start: "top 78%", once: true },
        });
        reveal.to(node, { opacity: 1, scale: 1, duration: 0.4 });
        reveal.to(q(".project-tech-chip"), { opacity: 1, y: 0, duration: 0.35, stagger: 0.05 }, "-=0.15");

        // Стопка карточек: нижняя чуть уменьшается, когда её накрывает
        // следующая. Эффект сохранён с прежней версии, переведён с
        // framer-motion на GSAP — чтобы на сайте осталась одна система
        // скролл-анимации, а не две параллельных.
        const targetScale = 1 - (total - 1 - index) * 0.03;
        gsap.fromTo(
          cardRef.current,
          { scale: 1 },
          {
            scale: targetScale,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "top top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [] }
  );

  const reversed = index % 2 === 1;

  return (
    <div ref={containerRef} className="project-card-container">
      <span className="project-node" aria-hidden="true" />
      <div
        ref={cardRef}
        className={`project-card ${project.featured ? "project-card-featured" : ""} ${reversed ? "project-card-reverse" : ""}`}
        style={{ top: `${index * 28}px`, "--project-accent": project.accent }}
      >
        <div className="project-card-top">
          <span className="project-number">{project.number}</span>
          <div className="project-heading">
            <span className="project-category">
              {project.category}
              {project.featured && <span className="project-featured-badge">{project.featuredLabel}</span>}
            </span>
            <b className="project-name">{project.title}</b>
          </div>

          {project.status === "live" ? (
            <LiveProjectButton href={project.link} label={project.ctaLabel} />
          ) : (
            <span className="project-status-soon">
              <span className="project-status-dot" />
              Demo soon
            </span>
          )}
        </div>

        <div className="project-card-bottom">
          <TiltCard className="project-poster" max={7}>
            <span className="project-poster-mark" aria-hidden="true">
              {project.title[0]}
            </span>
            <div className="project-poster-info">
              <p>{project.description}</p>
              <div className="project-tech-list">
                {project.tech.map((t) => (
                  <span key={t} className="project-tech-chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </TiltCard>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <section className="projects" id="projects">
      <span className="section-number" aria-hidden="true">
        05
      </span>

      <FadeIn delay={0} y={20} className="section-eyebrow">
        05 / Проекты
      </FadeIn>

      <FadeIn delay={0.05} y={40}>
        <h2 className="hero-heading projects-heading">Избранные проекты</h2>
      </FadeIn>

      <div className="project-cards-wrap">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} total={PROJECTS.length} />
        ))}
      </div>
    </section>
  );
}
