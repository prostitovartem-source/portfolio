import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Points, PointMaterial } from "@react-three/drei";
import { Object3D } from "three";
import { useEffect, useMemo, useRef } from "react";
import FadeIn from "../components/FadeIn.jsx";
import ContactButton from "../components/ContactButton.jsx";
import TypewriterText from "../components/TypewriterText.jsx";

const NAV_LINKS = [
  { label: "Обо мне", href: "#about" },
  { label: "Услуги", href: "#services" },
  { label: "Проекты", href: "#projects" },
  { label: "Контакты", href: "#contact" },
];

// Слева от заголовка.
const TESSERACT_BASE_X = -2.9;
const TESSERACT_SCALE = 1.55;

// 16 вершин гиперкуба — все комбинации ±1 по 4 координатам (x,y,z,w).
const TESSERACT_VERTICES_4D = Array.from({ length: 16 }, (_, i) => [
  i & 1 ? 1 : -1,
  i & 2 ? 1 : -1,
  i & 4 ? 1 : -1,
  i & 8 ? 1 : -1,
]);

// 32 ребра — соединяют вершины, отличающиеся ровно в одной координате.
const TESSERACT_EDGES = (() => {
  const edges = [];
  for (let i = 0; i < 16; i++) {
    for (let bit = 0; bit < 4; bit++) {
      const j = i ^ (1 << bit);
      if (j > i) edges.push([i, j]);
    }
  }
  return edges;
})();

function rotate4D(v, angleXW, angleYZ) {
  const [x, y, z, w] = v;
  const cosXW = Math.cos(angleXW);
  const sinXW = Math.sin(angleXW);
  const x1 = x * cosXW - w * sinXW;
  const w1 = x * sinXW + w * cosXW;

  const cosYZ = Math.cos(angleYZ);
  const sinYZ = Math.sin(angleYZ);
  const y1 = y * cosYZ - z * sinYZ;
  const z1 = y * sinYZ + z * cosYZ;

  return [x1, y1, z1, w1];
}

// Перспективная проекция 4D -> 3D по координате w (то самое "сложение сквозь себя" у гиперкуба).
function project4Dto3D([x, y, z, w], viewerDistance) {
  const factor = viewerDistance / (viewerDistance - w);
  return [x * factor, y * factor, z * factor];
}

/**
 * Тессеракт (гиперкуб) — куб внутри куба, соединённые рёбрами, вращающийся
 * сразу в двух 4D-плоскостях (XW и YZ) с проекцией в 3D. Дрейфует к курсору,
 * как и предыдущая фигура.
 */
function Tesseract() {
  const groupRef = useRef();
  const geometryRef = useRef();
  const dotsRef = useRef();
  const pointer = useRef({ x: 0, y: 0 });
  const dummy = useMemo(() => new Object3D(), []);
  const linePositions = useMemo(() => new Float32Array(TESSERACT_EDGES.length * 2 * 3), []);

  useEffect(() => {
    function handlePointerMove(e) {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const projected = TESSERACT_VERTICES_4D.map((v) => {
      const rotated = rotate4D(v, t * 0.4, t * 0.25);
      const [x, y, z] = project4Dto3D(rotated, 3.2);
      return [x * TESSERACT_SCALE, y * TESSERACT_SCALE, z * TESSERACT_SCALE];
    });

    TESSERACT_EDGES.forEach(([a, b], i) => {
      const pa = projected[a];
      const pb = projected[b];
      linePositions.set([...pa, ...pb], i * 6);
    });
    geometryRef.current.attributes.position.needsUpdate = true;
    geometryRef.current.computeBoundingSphere();

    projected.forEach((p, i) => {
      dummy.position.set(p[0], p[1], p[2]);
      dummy.updateMatrix();
      dotsRef.current.setMatrixAt(i, dummy.matrix);
    });
    dotsRef.current.instanceMatrix.needsUpdate = true;

    const targetX = TESSERACT_BASE_X + pointer.current.x * 0.5;
    const targetY = pointer.current.y * 0.5;
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.04;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.04;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.15} floatIntensity={1}>
      <group ref={groupRef} position={[TESSERACT_BASE_X, 0, 0]}>
        <lineSegments>
          <bufferGeometry ref={geometryRef}>
            <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color="#BBCCD7" transparent opacity={0.8} />
        </lineSegments>

        <instancedMesh ref={dotsRef} args={[null, null, TESSERACT_VERTICES_4D.length]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#eaf1f6" />
        </instancedMesh>
      </group>
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
          <Tesseract />
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
