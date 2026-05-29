import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Points, PointMaterial } from "@react-three/drei";
import { motion } from "framer-motion";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import "./App.css";

function AnimatedSphere() {
  const meshRef = useRef();

  useFrame((state) => {
    meshRef.current.rotation.x =
      state.clock.elapsedTime * 0.15;

    meshRef.current.rotation.y =
      state.clock.elapsedTime * 0.25;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.8, 1]} />
        <meshStandardMaterial
          color="#38bdf8"
          wireframe
        />
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
    ref.current.rotation.y =
      state.clock.elapsedTime * 0.03;

    ref.current.rotation.x =
      state.clock.elapsedTime * 0.015;
  });

  return (
    <Points
      ref={ref}
      positions={particles}
      stride={3}
    >
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

export default function App() {
  return (
    <div className="app">

      {/* HERO */}
      <section className="hero">

        <div className="canvas">
          <Canvas camera={{ position: [0, 0, 6] }}>
            <color attach="background" args={["#030712"]} />

            <fog attach="fog" args={["#030712", 5, 20]} />

            <ambientLight intensity={0.7} />

            <pointLight
              position={[5, 5, 5]}
              intensity={2}
              color="#38bdf8"
            />

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

        {/* BUTTONS */}
        <div className="buttons">

          <a href="#projects" className="btn primary">
            Смотреть проекты
          </a>

          <a
            href="https://github.com/"
            target="_blank"
            className="btn secondary"
          >
            GitHub
          </a>

        </div>

      </section>

      {/* ABOUT */}
      <section className="section">
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

        <p className="muted">
          Фокус: интерфейсы, которые выглядят дорого
          и ощущаются как полноценный digital product.
        </p>
      </section>

      {/* PROJECTS */}
      <section className="section" id="projects">
        <h2>Проекты</h2>

        <div className="grid">

          <div className="card">
            <b>3D Portfolio System</b>

            <p>
              Интерактивное портфолио с Three.js,
              анимациями и живым UI.
            </p>
          </div>

          <div className="card">
            <b>UI Component System</b>

            <p>
              Система переиспользуемых компонентов интерфейса.
            </p>
          </div>

          <div className="card">
            <b>Landing Engine</b>

            <p>
              Генератор современных landing page.
            </p>
          </div>

        </div>
      </section>

      {/* CONTACT */}
      <section className="section">
        <h2>Контакты</h2>

        <p>Открыт к работе и проектам.</p>

        <p className="muted">
          email: copickprostitov@email.com
        </p>

        <p className="muted">
          telegram: @copick1
        </p>
      </section>

      <footer>
        © 2026 Portfolio
      </footer>

    </div>
  );
}