import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Points, PointMaterial } from "@react-three/drei";
import { motion } from "framer-motion";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import "./App.css";

// ── 3-D helpers ──────────────────────────────────────────────

function AnimatedSphere() {
  const meshRef = useRef();

  useFrame((state) => {
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.25;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.8, 1]} />
        <meshStandardMaterial color="#38bdf8" wireframe />
      </mesh>
    </Float>
  );
}

function AnimatedParticles() {
  const ref = useRef();

  const particles = useMemo(() => {
    const positions = new Float32Array(4000 * 3);
    for (let i = 0; i < positions.length; i++) {
      positions[i] = (Math.random() - 0.5) * 15;
    }
    return positions;
  }, []);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    ref.current.rotation.x = state.clock.elapsedTime * 0.015;
  });

  return (
    <Points ref={ref} positions={particles} stride={3}>
      <PointMaterial
        transparent
        color="#60a5fa"
        size={0.02}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

// ── Animation variant — появление снизу ──────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// ── Навыки ───────────────────────────────────────────────────
const skills = [
  "React", "JavaScript", "Three.js", "CSS / Tailwind",
  "Framer Motion", "Vite", "Git", "AI-tools",
];

// ── Проекты ──────────────────────────────────────────────────
const projects = [
  {
    title: "3D Portfolio System",
    desc: "Интерактивное портфолио с Three.js, анимациями и живым UI.",
    tag: "Three.js",
  },
  {
    title: "UI Component System",
    desc: "Система переиспользуемых компонентов интерфейса.",
    tag: "React",
  },
  {
    title: "Landing Engine",
    desc: "Генератор современных landing page.",
    tag: "Vite",
  },
];

// ── Контакты ─────────────────────────────────────────────────
const contacts = [
  {
    label: "Telegram",
    value: "@copicks",
    href: "https://t.me/copicks",
    icon: (
      // простой SVG-логотип Telegram
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0
          12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506
          0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962
          6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184
          3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793
          1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663
          3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627
          4.476-1.635z"/>
      </svg>
    ),
    color: "#38bdf8",
  },
  {
    label: "Email",
    value: "copickprostitov@gmail.com",
    href: "mailto:copickprostitov@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        width="22" height="22">
        <rect x="2" y="4" width="20" height="16" rx="3"/>
        <path d="m2 7 10 7 10-7"/>
      </svg>
    ),
    color: "#a78bfa",
  },
  {
    label: "GitHub",
    value: "github.com",
    href: "https://github.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205
          11.385.6.113.82-.258.82-.577
          0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729
          1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304
          3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931
          0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0
          1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005
          2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653
          1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0
          4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823
          2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24
          12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
    color: "#60a5fa",
  },
];

// ── App ───────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="app">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="canvas">
          <Canvas camera={{ position: [0, 0, 6] }}>
            <color attach="background" args={["#030712"]} />
            <fog attach="fog" args={["#030712", 5, 20]} />
            <ambientLight intensity={0.7} />
            <pointLight position={[5, 5, 5]} intensity={2} color="#38bdf8" />
            <AnimatedSphere />
            <AnimatedParticles />
          </Canvas>
        </div>

        <motion.h1
          className="title"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Frontend Developer
        </motion.h1>

        <motion.p
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Создаю современные интерфейсы с фокусом на UX,
          производительность и живой интерактивный UI
        </motion.p>

        <motion.p
          className="vibe"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Vibe coder • AI-augmented development • React / Three.js
        </motion.p>

        <motion.div
          className="buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <a href="#projects" className="btn primary">
            Смотреть проекты
          </a>
          <a href="#contact" className="btn secondary">
            Написать мне
          </a>
        </motion.div>
      </section>

      {/* ── ABOUT ── */}
      <motion.section
        className="section"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2>О себе</h2>

        <p>
          Я frontend-разработчик, который создаёт современные
          веб-интерфейсы с упором на UX, визуальную чистоту
          и производительность.
        </p>

        <p>
          Использую React, Three.js и AI-инструменты
          для ускорения разработки и улучшения качества продукта.
        </p>

        <p className="muted" style={{ marginBottom: "36px" }}>
          Фокус: интерфейсы, которые выглядят дорого
          и ощущаются как полноценный digital product.
        </p>

        {/* Теги навыков */}
        <div className="skills">
          {skills.map((skill) => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
        </div>
      </motion.section>

      {/* ── PROJECTS ── */}
      <section className="section" id="projects">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Проекты
        </motion.h2>

        <div className="grid">
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              className="card"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.12 }}
            >
              <span className="card-tag">{p.tag}</span>
              <b>{p.title}</b>
              <p>{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <motion.section
        className="section"
        id="contact"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2>Контакты</h2>
        <p style={{ marginBottom: "40px" }}>
          Открыт к работе и новым проектам — напиши мне удобным способом.
        </p>

        <div className="contact-grid">
          {contacts.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card"
              style={{ "--accent-color": c.color }}
            >
              <span className="contact-icon">{c.icon}</span>
              <span className="contact-label">{c.label}</span>
              <span className="contact-value">{c.value}</span>
            </a>
          ))}
        </div>
      </motion.section>

      <footer>
        <p>© 2026 Portfolio · Сделано с React & Three.js</p>
      </footer>

    </div>
  );
}
