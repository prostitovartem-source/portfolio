import { Canvas } from "@react-three/fiber";
import { Float, Points, PointMaterial } from "@react-three/drei";
import { motion } from "framer-motion";
import { useMemo } from "react";
import "./App.css";

function Background() {
  const positions = useMemo(() => {
    const arr = new Float32Array(3000 * 3);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = (Math.random() - 0.5) * 12;
    }
    return arr;
  }, []);

  return (
    <Points positions={positions} stride={3}>
      <PointMaterial transparent color="#60a5fa" size={0.015} sizeAttenuation />
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
            <ambientLight intensity={0.7} />

            <Float speed={1.2} rotationIntensity={0.4} floatIntensity={1}>
              <mesh>
                <icosahedronGeometry args={[1.6, 1]} />
                <meshStandardMaterial color="#38bdf8" wireframe />
              </mesh>
            </Float>

            <Background />
          </Canvas>
        </div>

        <motion.h1 className="title">
          Фронтенд-разработчик
        </motion.h1>

        <motion.p className="subtitle">
          Создаю современные интерфейсы с фокусом на UX, производительность и 3D-визуал
        </motion.p>

        <p className="vibe">
          Вайб-кодер • использую ИИ как ускоритель разработки • React / Three.js
        </p>

        <div className="buttons">
          <button className="btn primary">Смотреть проекты</button>
          <button className="btn secondary">Связаться</button>
        </div>

      </section>

      {/* ABOUT */}
      <section className="section">
        <h2>О себе</h2>

        <p>
          Я фронтенд-разработчик, 16 лет. Создаю современные веб-интерфейсы с акцентом на UX,
          визуальную чистоту и производительность.
        </p>

        <p>
          Использую React, Three.js и AI-инструменты для ускорения разработки и улучшения качества продуктов.
          Начал в 14 лет с Python, позже перешёл во frontend и продолжаю развиваться.
        </p>

        <p className="muted">
          Фокус: интерфейсы, которые выглядят “дорого” и ощущаются как продукт уровня SaaS.
        </p>
      </section>

      {/* PROJECTS */}
      <section className="section">
        <h2>Проекты</h2>

        <div className="grid">

          <div className="card">
            <b>3D Portfolio System</b>
            <p>Интерактивное портфолио с Three.js и анимациями.</p>
          </div>

          <div className="card">
            <b>UI Component System</b>
            <p>Система переиспользуемых компонентов интерфейса.</p>
          </div>

          <div className="card">
            <b>Landing Page Engine</b>
            <p>Генератор современных лендингов.</p>
          </div>

        </div>
      </section>

      {/* CONTACT */}
      <section className="section">
        <h2>Контакты</h2>

        <p>Открыт к работе и проектам.</p>

        <p className="muted">email: copickprostitov@email.com</p>
        <p className="muted">telegram: @copick1</p>
      </section>

      <footer>
        © 2026 Portfolio
      </footer>

    </div>
  );
}