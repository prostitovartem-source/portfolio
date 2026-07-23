import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Points, PointMaterial } from "@react-three/drei";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import FadeIn from "../components/FadeIn.jsx";
import ContactButton from "../components/ContactButton.jsx";

const NAV_LINKS = [
  { label: "Обо мне", href: "#about" },
  { label: "Услуги", href: "#services" },
  { label: "Проекты", href: "#projects" },
  { label: "Контакты", href: "#contact" },
];

/** Узел-тор, дрейфующий следом за курсором (плавный lerp к нормализованной позиции мыши). */
function AnimatedShape() {
  const meshRef = useRef();
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function handlePointerMove(e) {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useFrame((state) => {
    const mesh = meshRef.current;
    mesh.rotation.x = state.clock.elapsedTime * 0.2;
    mesh.rotation.y = state.clock.elapsedTime * 0.3;

    const targetX = pointer.current.x * 1.8;
    const targetY = pointer.current.y * 1.2;
    mesh.position.x += (targetX - mesh.position.x) * 0.04;
    mesh.position.y += (targetY - mesh.position.y) * 0.04;
  });

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1.5}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.2, 0.38, 220, 32]} />
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
      <div className="hero-visual">
        <Canvas camera={{ position: [0, 0, 6] }}>
          <color attach="background" args={["#0C0C0C"]} />
          <fog attach="fog" args={["#0C0C0C", 5, 20]} />
          <ambientLight intensity={0.7} />
          <pointLight position={[5, 5, 5]} intensity={2} color="#BBCCD7" />
          <AnimatedShape />
          <AnimatedParticles />
        </Canvas>
      </div>

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
          hi, i&apos;m artem
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
