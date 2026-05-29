import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Points, PointMaterial } from "@react-three/drei";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import "./App.css";

function Scene() {
  const points = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < positions.length; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, []);

  return (
    <Points positions={points} stride={3} frustumCulled>
      <PointMaterial transparent color="#38bdf8" size={0.02} sizeAttenuation />
    </Points>
  );
}

function GitHubCard({ title, desc, url }) {
  return (
    <a href={url} target="_blank" className="card">
      <h3>{title}</h3>
      <p>{desc}</p>
    </a>
  );
}

export default function App() {
  const [status, setStatus] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value,
    };

    try {
      await fetch("https://formspree.io/f/your-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      setStatus("Message sent successfully");
      e.target.reset();
    } catch {
      setStatus("Error sending message");
    }
  }

  return (
    <div className="app">

      {/* HERO (Apple style + 3D scene) */}
      <section className="hero">
        <div className="canvas">
          <Canvas camera={{ position: [0, 0, 6] }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[2, 2, 2]} />

            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.2}>
              <mesh>
                <icosahedronGeometry args={[1.2, 1]} />
                <meshStandardMaterial color="#38bdf8" wireframe />
              </mesh>
            </Float>

            <Scene />
            <OrbitControls enableZoom={false} />
          </Canvas>
        </div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          Frontend Developer
        </motion.h1>

        <p className="subtitle">
          React • Three.js • UI Engineering • AI-Augmented Development
        </p>

        <p className="vibe">
          Vibe Coder — строю продукты с помощью AI как ускорителя разработки
        </p>

        <a className="cv" href="/cv.pdf" download>
          Скачать CV
        </a>

        <div className="github-row">
          <GitHubCard
            title="GitHub Profile"
            desc="Мои проекты и код"
            url="https://github.com/prostitovartem-source"
          />
        </div>
      </section>

      {/* ABOUT */}
      <section className="section">
        <h2>Обо мне</h2>
        <p>
          Фронтенд-разработчик, специализирующийся на создании высокопроизводительных интерфейсов,
          интерактивных 3D-приложений и современных UI-систем. Использую ИИ в качестве основного
          инструмента разработки для генерации идей, прототипирования и ускорения процесса.
        </p>
      </section>

      {/* SKILLS */}
      <section className="section">
        <h2>Мои скилы</h2>
        <div className="skills">
          {[
            "React",
            "Vite",
            "Three.js",
            "Framer Motion",
            "UI/UX",
            "AI-assisted engineering",
            "WebGL"
          ].map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section className="section">
        <h2>Projects</h2>

        <div className="grid">
          <GitHubCard
            title="3D Portfolio"
            desc="Interactive WebGL portfolio with Three.js"
            url="#"
          />
          <GitHubCard
            title="Dashboard UI"
            desc="Analytics dashboard UI system"
            url="#"
          />
          <GitHubCard
            title="Landing System"
            desc="Conversion optimized landing pages"
            url="#"
          />
        </div>
      </section>

      {/* CONTACT */}
      <section className="section">
        <h2>Contact</h2>

        <form onSubmit={handleSubmit} className="form">
          <input name="Имя" placeholder="Name" />
          <input name="email" placeholder="смысла писать нету, " />
          <textarea name="Сообщение" placeholder=" я не доделал" />

          <button type="submit">Send</button>
        </form>

        {status && <p>{status}</p>}
      </section>

      {/* FOOTER */}
      <footer>
        © 2026 Vibe Coder Portfolio • Built with React + Three.js + AI
      </footer>
    </div>
  );
}