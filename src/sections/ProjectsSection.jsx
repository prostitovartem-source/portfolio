import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FadeIn from "../components/FadeIn.jsx";
import LiveProjectButton from "../components/LiveProjectButton.jsx";

const PROJECTS = [
  {
    number: "01",
    title: "Quantix",
    category: "SaaS-продукт",
    description:
      "AI SaaS-платформа для автоматизации учёта товаров и обработки накладных. Распознаёт документы с помощью AI, извлекает данные и помогает управлять складскими операциями.",
    tag: "Next.js • AI • Prisma",
    link: "https://quantix-five.vercel.app",
    accent: "#38bdf8",
  },
  {
    number: "02",
    title: "ALTME AI",
    category: "AI-продукт",
    description:
      "AI-сервис для генерации и редактирования изображений. Загрузка фото, выбор AI-стилей, система внутренней валюты 🍓, история генераций и современный интерфейс на Next.js.",
    tag: "Next.js • AI • Replicate",
    link: "https://altime-five.vercel.app/",
    accent: "#a78bfa",
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
        className="project-card"
        style={{ scale, top: `${index * 28}px` }}
      >
        <div className="project-card-top">
          <span className="project-number">{project.number}</span>
          <div className="project-heading">
            <span className="project-category">{project.category}</span>
            <b className="project-name">{project.title}</b>
          </div>
          <LiveProjectButton href={project.link} label="Live Project" />
        </div>

        <div className="project-card-bottom">
          <div
            className="project-poster"
            style={{ "--project-accent": project.accent }}
          >
            <span className="project-poster-mark">{project.title[0]}</span>
            <div className="project-poster-info">
              <p>{project.description}</p>
              <span className="project-poster-tag">{project.tag}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <section className="projects" id="projects">
      <FadeIn delay={0} y={40}>
        <h2 className="hero-heading projects-heading">Проект</h2>
      </FadeIn>

      <div className="project-cards-wrap">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} total={PROJECTS.length} />
        ))}
      </div>
    </section>
  );
}
