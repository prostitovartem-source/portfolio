import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Points, PointMaterial, RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { createCodeMonitorCanvas } from "./codeMonitorTexture.js";

// Справа от заголовка на десктопе; по центру и выше на мобильном (см. isMobile).
const MONITOR_BASE_X_DESKTOP = 3.2;
const MONITOR_BASE_X_MOBILE = 0;

/**
 * 3D-монитор с "живым" кодом на экране (canvas-текстура, см.
 * codeMonitorTexture.js). Экран самосветящийся (meshBasicMaterial,
 * toneMapped=false) — остаётся читаемым независимо от освещения сцены.
 * Держит лёгкое непрерывное покачивание, а не полный оборот — иначе код
 * половину времени был бы повёрнут от зрителя.
 */
function CodeMonitor({ reducedMotion, isMobile, scrollProgress }) {
  const groupRef = useRef();
  const textureRef = useRef();
  const screenMatRef = useRef();
  const pointer = useRef({ x: 0, y: 0 });
  const mountedAt = useRef(null);
  const drawAccum = useRef(0);

  const baseX = isMobile ? MONITOR_BASE_X_MOBILE : MONITOR_BASE_X_DESKTOP;
  const scale = isMobile ? 0.62 : 1;
  const baseY = isMobile ? 0.85 : 0;

  const { canvas, draw } = useMemo(() => createCodeMonitorCanvas(), []);
  const drawInterval = reducedMotion ? 0.5 : isMobile ? 0.12 : 0.08;

  useEffect(() => {
    function handlePointerMove(e) {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useFrame((state, delta) => {
    const clockT = state.clock.elapsedTime;
    if (mountedAt.current === null) mountedAt.current = clockT;
    const localT = clockT - mountedAt.current;

    // "Power-on": монитор въезжает масштабом+лёгким довёртом первые ~0.9с после монтирования.
    const introT = Math.min(localT / 0.9, 1);
    const eased = 1 - Math.pow(1 - introT, 3);
    const introScale = reducedMotion ? 1 : 0.55 + eased * 0.45;

    const idleSpeed = reducedMotion ? 0.05 : 1;
    const wobbleY = Math.sin(clockT * 0.35) * 0.12 * idleSpeed + pointer.current.x * 0.25;
    const wobbleX = Math.sin(clockT * 0.27) * 0.05 * idleSpeed - pointer.current.y * 0.12;

    const scroll = scrollProgress?.get() ?? 0;
    const scrollFade = 1 - Math.min(scroll * 1.6, 1);

    groupRef.current.rotation.y = wobbleY;
    groupRef.current.rotation.x = wobbleX;
    groupRef.current.scale.setScalar(scale * introScale * (0.94 + scrollFade * 0.06));

    const targetX = baseX + pointer.current.x * 0.3;
    const targetY = baseY + pointer.current.y * 0.2 - scroll * 1.4;
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.045;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.045;

    if (screenMatRef.current) {
      screenMatRef.current.opacity = scrollFade;
    }

    drawAccum.current += delta;
    if (drawAccum.current >= drawInterval) {
      drawAccum.current = 0;
      draw(localT);
      if (textureRef.current) textureRef.current.needsUpdate = true;
    }
  });

  return (
    <Float speed={reducedMotion ? 0 : 1.1} rotationIntensity={0} floatIntensity={reducedMotion ? 0 : 0.6}>
      <group ref={groupRef} position={[baseX, baseY, 0]}>
        <RoundedBox args={[2.6, 1.68, 0.12]} radius={0.07} smoothness={4}>
          <meshStandardMaterial color="#11151f" roughness={0.45} metalness={0.35} />
        </RoundedBox>

        {/* Тонкий светящийся обод экрана */}
        <mesh position={[0, 0, 0.061]}>
          <planeGeometry args={[2.42, 1.52]} />
          <meshBasicMaterial color="#7dd3fc" transparent opacity={0.22} toneMapped={false} />
        </mesh>

        {/* Экран — самосветящийся, не зависит от освещения сцены */}
        <mesh position={[0, 0, 0.066]}>
          <planeGeometry args={[2.34, 1.44]} />
          <meshBasicMaterial ref={screenMatRef} transparent opacity={1} toneMapped={false}>
            <canvasTexture ref={textureRef} attach="map" args={[canvas]} />
          </meshBasicMaterial>
        </mesh>

        {/* Подставка */}
        <mesh position={[0, -1.02, -0.04]}>
          <boxGeometry args={[0.14, 0.4, 0.1]} />
          <meshStandardMaterial color="#11151f" roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[0, -1.24, -0.04]}>
          <boxGeometry args={[0.9, 0.06, 0.5]} />
          <meshStandardMaterial color="#11151f" roughness={0.5} metalness={0.3} />
        </mesh>
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

function AnimatedParticles({ count, reducedMotion }) {
  const ref = useRef();

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < positions.length; i++) {
      positions[i] = (hash(i * 1.61 + i) - 0.5) * 15;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    const speed = reducedMotion ? 0.1 : 1;
    ref.current.rotation.y = state.clock.elapsedTime * 0.03 * speed;
    ref.current.rotation.x = state.clock.elapsedTime * 0.015 * speed;
    const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.5) * (reducedMotion ? 0.005 : 0.03);
    ref.current.scale.setScalar(breathe);
  });

  return (
    <Points ref={ref} positions={particles} stride={3}>
      <PointMaterial transparent color="#7dd3fc" size={0.02} sizeAttenuation depthWrite={false} opacity={0.6} />
    </Points>
  );
}

/** Camera parallax + лёгкий scroll-dolly — курсор и скролл заметно влияют на сцену. */
function CameraRig({ reducedMotion, scrollProgress }) {
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
    const scroll = scrollProgress?.get() ?? 0;
    if (reducedMotion) {
      state.camera.position.z += (6 + scroll * 1.5 - state.camera.position.z) * 0.05;
      state.camera.lookAt(0, 0, 0);
      return;
    }
    const targetX = pointer.current.x * 0.55;
    const targetY = pointer.current.y * 0.32;
    const targetZ = 6 + scroll * 1.8;
    state.camera.position.x += (targetX - state.camera.position.x) * 0.035;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.035;
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.035;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

/** Свет слегка тянется к курсору — интерактивность заметна и в освещении, не только в движении объектов. */
function CursorLight({ reducedMotion }) {
  const ref = useRef();
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

  useFrame(() => {
    if (reducedMotion || !ref.current) return;
    const targetX = 3 + pointer.current.x * 2;
    const targetY = 3 + pointer.current.y * 2;
    ref.current.position.x += (targetX - ref.current.position.x) * 0.04;
    ref.current.position.y += (targetY - ref.current.position.y) * 0.04;
  });

  return <pointLight ref={ref} position={[3, 3, 5]} intensity={2} color="#7dd3fc" />;
}

/**
 * Вся Three.js-сцена Hero вынесена в отдельный чанк (см. React.lazy в
 * HeroSection.jsx) — @react-three/fiber, drei и three вместе весят
 * ощутимую часть бандла; ленивая загрузка не блокирует первую отрисовку
 * текста/CTA, сцена докатывается следом.
 */
export default function HeroScene({ reducedMotion, isMobile, scrollProgress }) {
  return (
    <Canvas camera={{ position: [0, 0, 6] }} dpr={isMobile ? [1, 1.5] : [1, 2]}>
      <color attach="background" args={["#080808"]} />
      <fog attach="fog" args={["#080808", 5, 20]} />
      <ambientLight intensity={0.55} />
      <CursorLight reducedMotion={reducedMotion} />
      <CameraRig reducedMotion={reducedMotion} scrollProgress={scrollProgress} />
      <CodeMonitor reducedMotion={reducedMotion} isMobile={isMobile} scrollProgress={scrollProgress} />
      <AnimatedParticles count={isMobile ? 900 : 4000} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
