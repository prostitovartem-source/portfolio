import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Points, PointMaterial } from "@react-three/drei";
import { motion } from "framer-motion";
import { useMemo, useRef } from "react";
import FadeIn from "../components/FadeIn.jsx";
import Magnet from "../components/Magnet.jsx";
import ContactButton from "../components/ContactButton.jsx";

const NAV_LINKS = [
  { label: "Обо мне", href: "#about" },
  { label: "Услуги", href: "#services" },
  { label: "Проекты", href: "#projects" },
  { label: "Контакты", href: "#contact" },
];

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
        <meshStandardMaterial color="#BBCCD7" wireframe />
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
      <PointMaterial transparent color="#646973" size={0.02} sizeAttenuation depthWrite={false} />
    </Points>
  );
}

export default function HeroSection() {
  return (
    <section className="hero" style={{ overflowX: "clip" }}>
      <Magnet padding={150} strength={20} className="hero-visual">
        <Canvas camera={{ position: [0, 0, 6] }}>
          <color attach="background" args={["#0C0C0C"]} />
          <fog attach="fog" args={["#0C0C0C", 5, 20]} />
          <ambientLight intensity={0.7} />
          <pointLight position={[5, 5, 5]} intensity={2} color="#BBCCD7" />
          <AnimatedSphere />
          <AnimatedParticles />
        </Canvas>
      </Magnet>

      <FadeIn as="nav" delay={0} y={-20} className="navbar">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </FadeIn>

      <div className="hero-heading-wrap">
        <motion.h1
          className="hero-heading hero-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          привет, я артём
        </motion.h1>
      </div>

      <div className="hero-bottom">
        <FadeIn delay={0.35} y={20} className="hero-caption">
          <p>
            full stack разработчик, создающий продукты от интерфейса
            до серверной логики и ai-интеграций
          </p>
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}
