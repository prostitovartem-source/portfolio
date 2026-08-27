import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Points, PointMaterial } from "@react-three/drei";
import { Object3D } from "three";
import { useEffect, useMemo, useRef } from "react";

// Справа от заголовка, подальше от текста, чтобы не залезал на него.
const TESSERACT_BASE_X = 3.6;
const TESSERACT_SCALE = 1.35;

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
 * сразу в двух 4D-плоскостях (XW и YZ) с проекцией в 3D. Дрейфует к курсору.
 * Digital-sculpture акцент сцены, не просто "вращающийся куб".
 */
function Tesseract({ reducedMotion }) {
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
    const speed = reducedMotion ? 0.06 : 1;
    const projected = TESSERACT_VERTICES_4D.map((v) => {
      const rotated = rotate4D(v, t * 0.4 * speed, t * 0.25 * speed);
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

    const targetX = TESSERACT_BASE_X + pointer.current.x * 0.3;
    const targetY = pointer.current.y * 0.35;
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.04;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.04;
  });

  return (
    <Float speed={reducedMotion ? 0 : 1.4} rotationIntensity={reducedMotion ? 0 : 0.15} floatIntensity={reducedMotion ? 0 : 1}>
      <group ref={groupRef} position={[TESSERACT_BASE_X, 0, 0]}>
        <lineSegments>
          <bufferGeometry ref={geometryRef}>
            <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color="#7dd3fc" transparent opacity={0.85} />
        </lineSegments>

        <instancedMesh ref={dotsRef} args={[null, null, TESSERACT_VERTICES_4D.length]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#a78bfa" />
        </instancedMesh>
      </group>
    </Float>
  );
}

// Дешёвый детерминированный "хэш" в [0, 1) — вместо Math.random (стабильные
// позиции частиц, не пересчитываются на каждый ререндер).
function hash(n) {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

function AnimatedParticles({ count }) {
  const ref = useRef();

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < positions.length; i++) {
      positions[i] = (hash(i * 1.61 + i) - 0.5) * 15;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    ref.current.rotation.x = state.clock.elapsedTime * 0.015;
  });

  return (
    <Points ref={ref} positions={particles} stride={3}>
      <PointMaterial transparent color="#7dd3fc" size={0.02} sizeAttenuation depthWrite={false} opacity={0.6} />
    </Points>
  );
}

/** Лёгкий parallax камеры вслед за курсором — глубина сцены помимо дрейфа самого объекта. */
function CameraParallax({ reducedMotion }) {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion) return;
    function handleMove(e) {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [reducedMotion]);

  useFrame((state) => {
    if (reducedMotion) return;
    const targetX = pointer.current.x * 0.4;
    const targetY = pointer.current.y * 0.25;
    state.camera.position.x += (targetX - state.camera.position.x) * 0.03;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.03;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

/**
 * Вся Three.js-сцена Hero вынесена в отдельный чанк (см. React.lazy в
 * HeroSection.jsx) — @react-three/fiber, drei и three вместе весят
 * ощутимую часть бандла; ленивая загрузка не блокирует первую отрисовку
 * текста/CTA, сцена докатывается следом.
 */
export default function HeroScene({ reducedMotion, isMobile }) {
  return (
    <Canvas camera={{ position: [0, 0, 6] }} dpr={[1, 2]}>
      <color attach="background" args={["#080808"]} />
      <fog attach="fog" args={["#080808", 5, 20]} />
      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#7dd3fc" />
      <CameraParallax reducedMotion={reducedMotion} />
      <Tesseract reducedMotion={reducedMotion} />
      <AnimatedParticles count={isMobile ? 1200 : 4000} />
    </Canvas>
  );
}
