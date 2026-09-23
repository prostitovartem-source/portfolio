import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";

/**
 * Физический корпус телефона в WebGL под DOM-экраном.
 *
 * Сцена не анимирует телефон сама: скролл-таймлайн GSAP по-прежнему
 * двигает DOM-телефон (.sc-phone), а корпус каждый тик читает ту же
 * трансформацию и повторяет её. Камера совпадает с CSS-перспективой
 * 2400px, точка схода - центр слота телефона, поэтому стекло-экран
 * (DOM) и металлический корпус (WebGL) сидят друг в друге без швов.
 * Единица мира = 1 CSS-пиксель, ось Y смотрит вверх.
 *
 * Кадр рисуется только когда трансформация изменилась (frameloop
 * "demand"), без постобработки и теней в реальном времени.
 */

const PERSPECTIVE = 2400;
// Пропорции iPhone 15 Pro: 70.6 x 146.6 x 8.25 мм.
const DEPTH_RATIO = 8.25 / 70.6;

function roundedRect(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function Body({ w, h }) {
  const depth = w * DEPTH_RATIO;
  const radius = (w / 30) * 4.9;
  const bevel = w * 0.034;

  const geometry = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(roundedRect(w - bevel * 2, h - bevel * 2, radius - bevel), {
      depth: depth - bevel * 2,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 8,
      curveSegments: 28,
    });
    // Лицевая грань корпуса - в плоскости DOM-экрана (z = 0), тело уходит назад.
    g.translate(0, 0, -(depth - bevel));
    return g;
  }, [w, h, depth, radius, bevel]);

  const camera = useMemo(() => {
    const plate = w * 0.44;
    const lens = plate * 0.2;
    const pos = [
      [-plate * 0.22, plate * 0.22],
      [-plate * 0.22, -plate * 0.22],
      [plate * 0.22, 0],
    ];
    return { plate, lens, pos };
  }, [w]);

  const buttons = [
    { side: -1, top: 0.16, len: 0.045 },
    { side: -1, top: 0.24, len: 0.075 },
    { side: -1, top: 0.335, len: 0.075 },
    { side: 1, top: 0.26, len: 0.12 },
  ];

  return (
    <group>
      <mesh geometry={geometry}>
        {/* группа 0 - плоские крышки (под экраном и задняя), 1 - обод и фаски */}
        <meshStandardMaterial attach="material-0" color="#141417" metalness={0.3} roughness={0.55} />
        <meshStandardMaterial attach="material-1" color="#a4a3a8" metalness={1} roughness={0.28} envMapIntensity={1.7} />
      </mesh>

      {/* Задняя матовая стеклянная панель. */}
      <mesh position={[0, 0, -depth - 0.5]} rotation={[0, Math.PI, 0]}>
        <shapeGeometry args={[roundedRect(w - bevel * 3, h - bevel * 3, radius - bevel * 1.5), 24]} />
        <meshStandardMaterial color="#2a2a2e" metalness={0.2} roughness={0.7} />
      </mesh>

      {/* Камерный блок на спине. */}
      <group position={[w / 2 - camera.plate * 0.62, h / 2 - camera.plate * 0.62, -depth - 1]} rotation={[0, Math.PI, 0]}>
        <RoundedBox args={[camera.plate, camera.plate, 4]} radius={camera.plate * 0.24} smoothness={4}>
          <meshStandardMaterial color="#3a3a40" metalness={0.6} roughness={0.35} />
        </RoundedBox>
        {camera.pos.map(([x, y], i) => (
          <group key={i} position={[x, y, 4]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[camera.lens, camera.lens, 6, 32]} />
              <meshStandardMaterial color="#8a8a90" metalness={1} roughness={0.25} />
            </mesh>
            <mesh position={[0, 0, 3.2]}>
              <circleGeometry args={[camera.lens * 0.78, 32]} />
              <meshStandardMaterial color="#05060a" metalness={0.4} roughness={0.08} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Боковые кнопки: чуть выступают из обода. */}
      {buttons.map((b, i) => {
        const len = h * b.len;
        const y = h / 2 - h * b.top - len / 2;
        return (
          <RoundedBox
            key={i}
            args={[w * 0.022, len, depth * 0.34]}
            radius={w * 0.008}
            smoothness={3}
            position={[b.side * (w / 2 + w * 0.004), y, -depth / 2]}
          >
            <meshStandardMaterial color="#a9a8ad" metalness={1} roughness={0.24} envMapIntensity={1.6} />
          </RoundedBox>
        );
      })}

      {/* Антенные полосы - маленькая деталь, которая делает обод «настоящим». */}
      {[-1, 1].map((sx) =>
        [0.12, 0.88].map((py) => (
          <mesh key={`${sx}-${py}`} position={[sx * (w / 2 + 0.3), h / 2 - h * py, -depth / 2]} rotation={[0, (sx * Math.PI) / 2, 0]}>
            <planeGeometry args={[depth * 0.55, w * 0.012]} />
            <meshStandardMaterial color="#2c2c30" metalness={0.4} roughness={0.6} />
          </mesh>
        ))
      )}
    </group>
  );
}

/** Мягкая тень под корпусом: один полупрозрачный спрайт, без shadow map. */
function SoftShadow({ w, h }) {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    const grd = g.createRadialGradient(64, 64, 8, 64, 64, 64);
    grd.addColorStop(0, "rgba(0,0,0,0.55)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh position={[w * 0.06, -h * 0.05, -w * DEPTH_RATIO - 60]} renderOrder={-1}>
      <planeGeometry args={[w * 1.9, h * 1.35]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

function Rig({ phoneRef, slotRef, canvasEl, onSize }) {
  const getState = useThree((st) => st.get);
  const group = useRef(null);
  const last = useRef("");

  useEffect(() => {
    const { camera, invalidate } = getState();
    const phoneEl = phoneRef.current;
    const slotEl = slotRef.current;
    if (!phoneEl || !slotEl) return;
    last.current = "";
    // Проекция задаётся вручную (off-axis), поэтому штатный пересчёт
    // камеры при ресайзе отключён.
    camera.updateProjectionMatrix = () => {};

    const tick = () => {
      if (!group.current) return;
      const c = canvasEl.getBoundingClientRect();
      const s = slotEl.getBoundingClientRect();
      if (!c.width || !s.width) return;
      const get = gsap.getProperty(phoneEl);
      const v = [get("x"), get("y"), get("rotation"), get("rotationX"), get("rotationY"), get("scale"), c.width, c.height, s.left, s.top, s.width, s.height];
      const key = v.map((n) => Math.round(n * 100)).join(",");
      if (key === last.current) return;
      last.current = key;

      const [x, y, rz, rx, ry, sc] = v;
      const cx = s.left + s.width / 2 - c.left;
      const cy = s.top + s.height / 2 - c.top;

      // Камера в точке схода CSS-перспективы; кадр покрывает весь canvas.
      const near = 10;
      const far = 8000;
      const k = near / PERSPECTIVE;
      camera.position.set(0, 0, PERSPECTIVE);
      camera.quaternion.identity();
      camera.projectionMatrix.makePerspective(-cx * k, (c.width - cx) * k, cy * k, (cy - c.height) * k, near, far);
      camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();

      // CSS (y вниз) -> WebGL (y вверх): знаки X- и Z-поворота меняются.
      const d = THREE.MathUtils.DEG2RAD;
      group.current.position.set(x, -y, 0);
      group.current.rotation.set(-rx * d, ry * d, -rz * d, "ZYX");
      group.current.scale.setScalar(sc);

      // Блик на стекле DOM-экрана следует за поворотом корпуса.
      phoneEl.style.setProperty("--glare-x", `${50 + ry * 2.2}%`);
      phoneEl.style.setProperty("--glare-y", `${40 - rx * 1.6}%`);

      if (Math.abs(phoneEl.offsetWidth - onSize.w) > 0.5 || Math.abs(phoneEl.offsetHeight - onSize.h) > 0.5) {
        onSize.set(phoneEl.offsetWidth, phoneEl.offsetHeight);
      }
      invalidate();
    };

    gsap.ticker.add(tick);
    tick();
    return () => gsap.ticker.remove(tick);
  }, [getState, phoneRef, slotRef, canvasEl, onSize]);

  return (
    <group ref={group}>
      <SoftShadow w={onSize.w} h={onSize.h} />
      <Body w={onSize.w} h={onSize.h} />
    </group>
  );
}

export default function Phone3D({ phoneRef, slotRef }) {
  const [wrap, setWrap] = useState(null);
  // Настоящий размер корпус получит на первом тике Rig из DOM-телефона.
  const [size, setSize] = useState({ w: 334, h: 720 });
  const sizeApi = useMemo(() => ({ ...size, set: (w, h) => setSize({ w, h }) }), [size]);

  useEffect(() => {
    const phone = phoneRef.current;
    phone?.classList.add("sc-phone-3d");
    return () => phone?.classList.remove("sc-phone-3d");
  }, [phoneRef]);

  return (
    <div ref={setWrap} className="sc-phone-canvas" aria-hidden="true">
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, PERSPECTIVE], near: 10, far: 8000 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.3;
        }}
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[-600, 900, 1400]} intensity={1.2} />
        {/* Окружение из световых панелей, без внешних HDR: мягкий бокс сверху
            и две вертикальные полосы дают титану живые переливы. */}
        <Environment resolution={256} frames={1}>
          <color attach="background" args={["#0b0a10"]} />
          <Lightformer form="rect" intensity={4} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[12, 4, 1]} />
          <Lightformer form="rect" intensity={6} position={[-6, 1, 1]} rotation-y={Math.PI / 2} scale={[10, 0.5, 1]} />
          <Lightformer form="rect" intensity={5} position={[6, -1, 1]} rotation-y={-Math.PI / 2} scale={[10, 0.8, 1]} />
          <Lightformer form="rect" intensity={2.5} position={[0, 0, 6]} scale={[6, 6, 1]} />
          <Lightformer form="rect" intensity={1.5} position={[0, -6, 0]} rotation-x={-Math.PI / 2} scale={[12, 2, 1]} />
          <Lightformer form="ring" color="#c7b8ff" intensity={2} position={[3, -2, 4]} scale={2.5} />
        </Environment>
        {wrap && (
          <Rig phoneRef={phoneRef} slotRef={slotRef} canvasEl={wrap} onSize={sizeApi} />
        )}
      </Canvas>
    </div>
  );
}
