import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FadeIn from "../components/FadeIn.jsx";
import LiveProjectButton from "../components/LiveProjectButton.jsx";
import TiltCard from "../components/TiltCard.jsx";

const PROJECTS = [
  {
    number: "01",
    title: "Quantix",
    category: "SaaS-продукт",
    featured: true,
    featuredLabel: "Флагманский проект",
    description:
      "AI SaaS-платформа для автоматизации учёта товаров и обработки накладных. Распознаёт документы с помощью AI, извлекает данные и помогает управлять складскими операциями.",
    tag: "Next.js • AI • Prisma",
    link: "https://quantix-five.vercel.app",
    ctaLabel: "Смотреть проект",
    accent: "#38bdf8",
  },
  {
    number: "02",
    title: "ALTME AI",
    category: "AI-бот для MAX",
    featured: false,
    description:
      "AI-бот и мини-приложение внутри мессенджера MAX для генерации и стилизации фотографий. Загрузка фото, выбор AI-стиля или свой промпт, внутренняя валюта 🍓 и реферальная система — весь опыт целиком живёт в MAX, без отдельного сайта.",
    tag: "Next.js • MAX Bot API • Gemini AI",
    link: "https://max.ru/se13793521_bot",
    ctaLabel: "Открыть в MAX",
    accent: "#fb2c5c",
  },
];

function ProjectCard({ project, index, total }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  });

  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div ref={containerRef} className="project-card-container">
      <motion.div
        className={`project-card ${project.featured ? "project-card-featured" : ""}`}
        style={{ scale, top: `${index * 28}px`, "--project-accent": project.accent }}
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
          <LiveProjectButton href={project.link} label={project.ctaLabel} />
        </div>

        <div className="project-card-bottom">
          <TiltCard className="project-poster" max={7}>
            <span className="project-poster-mark" aria-hidden="true">
              {project.title[0]}
            </span>
            <div className="project-poster-info">
              <p>{project.description}</p>
              <span className="project-poster-tag">{project.tag}</span>
            </div>
          </TiltCard>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <section className="projects" id="projects">
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
