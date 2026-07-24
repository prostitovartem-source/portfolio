import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { BackSide } from "three";
import { useEffect, useMemo, useRef } from "react";
import FadeIn from "../components/FadeIn.jsx";
import ContactButton from "../components/ContactButton.jsx";
import TypewriterText from "../components/TypewriterText.jsx";
import { createEarthCanvas } from "../components/earthTexture.js";

const NAV_LINKS = [
  { label: "Обо мне", href: "#about" },
  { label: "Услуги", href: "#services" },
  { label: "Проекты", href: "#projects" },
  { label: "Контакты", href: "#contact" },
];

// Смещена вправо, чтобы не перекрывать заголовок.
const EARTH_BASE_X = 2.6;

/**
 * Земля с Луной: дрейфует к курсору (как раньше), но вращается сама
 * только когда за неё "держат" — мышью (pointerdown+move) или пальцем
 * (те же Pointer Events унифицируют touch). Без захвата — тихо крутится сама.
 */
function EarthAndMoon() {
  const systemRef = useRef();
  const earthRef = useRef();
  const moonPivotRef = useRef();
  const pointer = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  const earthTexture = useMemo(() => createEarthCanvas(), []);

  useEffect(() => {
    function handlePointerMove(e) {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (dragging.current && earthRef.current) {
        const dx = e.clientX - lastPointer.current.x;
        const dy = e.clientY - lastPointer.current.y;
        earthRef.current.rotation.y += dx * 0.008;
        earthRef.current.rotation.x += dy * 0.008;
        lastPointer.current = { x: e.clientX, y: e.clientY };
      }
    }
    function handlePointerUp() {
      dragging.current = false;
      document.body.style.cursor = "";
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointercancel", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, []);

  function handlePointerDown(e) {
    dragging.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    document.body.style.cursor = "grabbing";
  }

  useFrame((state) => {
    const targetX = EARTH_BASE_X + pointer.current.x * 0.5;
    const targetY = pointer.current.y * 0.6;
    systemRef.current.position.x += (targetX - systemRef.current.position.x) * 0.04;
    systemRef.current.position.y += (targetY - systemRef.current.position.y) * 0.04;

    if (!dragging.current) {
      earthRef.current.rotation.y += 0.0025;
    }
    moonPivotRef.current.rotation.y = state.clock.elapsedTime * 0.35;
  });

  return (
    <group ref={systemRef} position={[EARTH_BASE_X, 0, 0]}>
      <mesh
        ref={earthRef}
        onPointerDown={handlePointerDown}
        onPointerOver={() => (document.body.style.cursor = "grab")}
        onPointerOut={() => !dragging.current && (document.body.style.cursor = "")}
      >
        <sphereGeometry args={[1.3, 48, 48]} />
        <meshStandardMaterial roughness={0.85} metalness={0.05}>
          <canvasTexture attach="map" args={[earthTexture]} />
        </meshStandardMaterial>
      </mesh>

      {/* Лёгкое атмосферное свечение */}
      <mesh scale={1.08}>
        <sphereGeometry args={[1.3, 32, 32]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.12} side={BackSide} />
      </mesh>

      <group ref={moonPivotRef}>
        <mesh position={[2.3, 0.35, 0]}>
          <sphereGeometry args={[0.28, 24, 24]} />
          <meshStandardMaterial color="#a3abb3" roughness={1} />
        </mesh>
      </group>
    </group>
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
          <EarthAndMoon />
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
        <TypewriterText
          as="h1"
          className="hero-heading hero-title"
          text="hi, i'm copick"
          startDelay={0.5}
        />
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
