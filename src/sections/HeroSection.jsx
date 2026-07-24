import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { BackSide, AdditiveBlending } from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import FadeIn from "../components/FadeIn.jsx";
import ContactButton from "../components/ContactButton.jsx";
import TypewriterText from "../components/TypewriterText.jsx";
import { loadImage, bakeMoscowMarker } from "../components/earthTexture.js";

const NAV_LINKS = [
  { label: "Обо мне", href: "#about" },
  { label: "Услуги", href: "#services" },
  { label: "Проекты", href: "#projects" },
  { label: "Контакты", href: "#contact" },
];

// Смещена вправо, чтобы не перекрывать заголовок.
const EARTH_BASE_X = 3;
const EARTH_RADIUS = 1.75;

/**
 * Земля с Луной: дрейфует к курсору (как раньше), но вращается сама
 * только когда за неё "держат" — мышью (pointerdown+move) или пальцем
 * (те же Pointer Events унифицируют touch). Без захвата — тихо крутится сама.
 */
function EarthAndMoon() {
  const systemRef = useRef();
  const earthRef = useRef();
  const cloudsRef = useRef();
  const moonPivotRef = useRef();
  const pointer = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  const [textures, setTextures] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      loadImage("/textures/earth_atmos_2048.jpg"),
      loadImage("/textures/earth_clouds_1024.png"),
      loadImage("/textures/moon_1024.jpg"),
    ]).then(([earthImage, cloudsImage, moonImage]) => {
      if (cancelled) return;
      setTextures({
        earth: bakeMoscowMarker(earthImage),
        clouds: cloudsImage,
        moon: moonImage,
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

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

    if (!textures) return;

    if (!dragging.current) {
      earthRef.current.rotation.y += 0.0025;
    }
    cloudsRef.current.rotation.y += 0.0011;
    moonPivotRef.current.rotation.y = state.clock.elapsedTime * 0.35;
  });

  return (
    <group ref={systemRef} position={[EARTH_BASE_X, 0, 0]}>
      {textures && (
        <>
          <mesh
            ref={earthRef}
            onPointerDown={handlePointerDown}
            onPointerOver={() => (document.body.style.cursor = "grab")}
            onPointerOut={() => !dragging.current && (document.body.style.cursor = "")}
          >
            <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
            <meshStandardMaterial roughness={0.9} metalness={0}>
              <canvasTexture attach="map" args={[textures.earth]} />
            </meshStandardMaterial>
          </mesh>

          {/* Облака — отдельная чуть большая сфера, вращается независимо от Земли. Опасити невысокое, иначе весь шар выглядит выцветшим/прозрачным. */}
          <mesh ref={cloudsRef} scale={1.012}>
            <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
            <meshStandardMaterial transparent opacity={0.25} depthWrite={false}>
              <canvasTexture attach="map" args={[textures.clouds]} />
            </meshStandardMaterial>
          </mesh>

          {/* Лёгкое атмосферное свечение */}
          <mesh scale={1.06}>
            <sphereGeometry args={[EARTH_RADIUS, 32, 32]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.1} side={BackSide} />
          </mesh>

          <group ref={moonPivotRef}>
            <mesh position={[EARTH_RADIUS * 1.85, EARTH_RADIUS * 0.28, 0]}>
              <sphereGeometry args={[EARTH_RADIUS * 0.2, 24, 24]} />
              <meshStandardMaterial roughness={1}>
                <canvasTexture attach="map" args={[textures.moon]} />
              </meshStandardMaterial>
            </mesh>
          </group>
        </>
      )}
    </group>
  );
}

// Дешёвый детерминированный "хэш" в [0, 1) — вместо Math.random (стабильные
// позиции звёзд, не пересчитываются на каждый ререндер).
function hash(n) {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

function useScatteredStars(count, spread, seed) {
  return useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (hash(seed + i * 1.001) - 0.5) * spread;
      positions[i * 3 + 1] = (hash(seed + i * 2.002 + 7) - 0.5) * spread;
      positions[i * 3 + 2] = (hash(seed + i * 3.003 + 13) - 0.5) * spread;
    }
    return positions;
  }, [count, spread, seed]);
}

// Узкая наклонная полоса точек через всю сцену — читается как Млечный Путь.
function useMilkyWayBand(count, length, tiltX, tiltZ) {
  return useMemo(() => {
    const positions = new Float32Array(count * 3);
    const cosX = Math.cos(tiltX);
    const sinX = Math.sin(tiltX);
    const cosZ = Math.cos(tiltZ);
    const sinZ = Math.sin(tiltZ);
    for (let i = 0; i < count; i++) {
      const u = (hash(i * 1.31 + 3) - 0.5) * length;
      const v = (hash(i * 2.53 + 9) - 0.5) * (length * 0.1);
      const w = (hash(i * 3.77 + 15) - 0.5) * (length * 0.1);
      const x1 = u * cosZ - v * sinZ;
      const y1 = u * sinZ + v * cosZ;
      const y2 = y1 * cosX - w * sinX;
      const z2 = y1 * sinX + w * cosX;
      positions[i * 3] = x1;
      positions[i * 3 + 1] = y2;
      positions[i * 3 + 2] = z2;
    }
    return positions;
  }, [count, length, tiltX, tiltZ]);
}

/** Спокойный звёздный фон + полоса Млечного Пути — задник, не конкурирующий с Землёй по яркости/размеру. */
function SpaceBackdrop() {
  const groupRef = useRef();
  const stars = useScatteredStars(2600, 26, 0);
  const band = useMilkyWayBand(2000, 22, 0.5, 0.35);

  useFrame((state) => {
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.006;
    groupRef.current.rotation.x = state.clock.elapsedTime * 0.003;
  });

  return (
    <group ref={groupRef}>
      <Points positions={stars} stride={3}>
        <PointMaterial
          transparent
          color="#dfe7ee"
          size={0.011}
          sizeAttenuation
          depthWrite={false}
          opacity={0.75}
        />
      </Points>
      <Points positions={band} stride={3}>
        <PointMaterial
          transparent
          color="#9fb8d9"
          size={0.018}
          sizeAttenuation
          depthWrite={false}
          opacity={0.3}
          blending={AdditiveBlending}
        />
      </Points>
    </group>
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
          <SpaceBackdrop />
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
