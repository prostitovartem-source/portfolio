import { Canvas } from "@react-three/fiber";
import { Float, Points, PointMaterial } from "@react-three/drei";
import { motion } from "framer-motion";
import { useMemo } from "react";
import "./App.css";

function Background() {
  const positions = useMemo(() => {
    const arr = new Float32Array(2500 * 3);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = (Math.random() - 0.5) * 10;
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

        <motion.h1
          className="title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Frontend Developer
        </motion.h1>

        <motion.p
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          I create modern interfaces with a focus on UX, performance, and 3D visuals
        </motion.p>

        <p className="vibe">
          Vibe coder • AI-augmented development • React / Three.js
        </p>

      </section>

      <section className="section">
        <h2>О себе</h2>

        <p>
          Я фронтенд-разработчик, 16 лет, который создаёт современные веб-интерфейсы с упором на UX,
          визуальную чистоту и производительность, используя React, Three.js и AI-инструменты для оптимизации разработки.
          в простонародии Вайб кодер т.е я пользуюсь ИИ для ускорения разработки и создания более качественных продуктов.
          начал заниматся програмированием в 14 лет на python(в 15 уже начал смотреть уроки на ютуб по frontend), с тех пор постоянно учусь и развиваюсь,
          создавая проекты от интерактивных портфолио до UI-компонентных систем.
        </p>

        <p className="muted">
          Фокус: понятный интерфейс, хороший дизайн и ощущение “дорогого продукта”.
        </p>
      </section>

      <section className="section">
        <h2>Проекты</h2>

        <div className="grid">

          <div className="card">
            <b>3D Portfolio System</b>
            <p>Интерактивное портфолио с Three.js и анимациями.</p>
          </div>

          <div className="card">
            <b>UI Component System</b>
            <p>Набор переиспользуемых UI компонентов.</p>
          </div>

          <div className="card">
            <b>Landing Page Engine</b>
            <p>Система для создания современных лендингов.</p>
          </div>

        </div>
      </section>

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