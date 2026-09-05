import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ContactButton from "../components/ContactButton.jsx";

const ABOUT_TEXT =
  "Меня зовут Артём, мне 16 лет, учусь в 11 классе. В программировании — с 14 лет: начинал с python, а сейчас работаю как full stack разработчик и создаю современные веб-продукты (и не только) с фокусом на качество, производительность и удобство пользователя. Использую typescript, react, next.js и node.js, работаю с ai как инструментом ускорения разработки и создаю продукты полного цикла — от идеи и интерфейса до backend-логики и базы данных.";

// Слова стека внутри параграфа подсвечиваются и реагируют на курсор —
// они же служат «сигналами» системы, а не декоративными бейджами.
const TECH_WORDS = new Set(["python", "typescript", "react", "next.js", "node.js", "ai", "backend-логики"]);

const ABOUT_MARKERS = [
  "Программирую с 14 лет",
  "TypeScript · React · Next.js",
  "AI-assisted development",
  "Продукт под ключ",
];

/**
 * Семь фаз эволюции. Каждая веха на «хребте» таймлайна открывает свой
 * узел-возможность справа — так личная история превращается в архитектуру
 * системы, а на последней фазе всё сходится в «Продукт».
 */
const PHASES = [
  { id: "start", label: "14 лет", note: "первая строка кода", sat: null },
  { id: "python", label: "Python", note: "алгоритмы, логика", sat: "Логика" },
  { id: "web", label: "Web", note: "вёрстка, браузер", sat: "Frontend" },
  { id: "react", label: "React / TypeScript", note: "компоненты, типы", sat: "Интерфейсы" },
  { id: "node", label: "Next.js / Node.js", note: "сервер, API", sat: "Backend" },
  { id: "ai", label: "AI", note: "модели в продукте", sat: "AI-слой" },
  { id: "fullstack", label: "Full Stack", note: "полный цикл", sat: "Продукт" },
];

// Геометрия SVG (viewBox 0 0 120 200): хребет слева, узлы-возможности справа.
const SPINE_X = 26;
const SAT_X = 84;
const TOP_Y = 12;
const STEP = 29.3;
const nodeY = (i) => TOP_Y + i * STEP;
const satY = (i) => nodeY(i) - 5;
// Дуги схождения выгибаются вправо, иначе они легли бы поверх колонки
// узлов и читались бы как вторая прямая линия, а не как связи.
const convergePath = (i, lastI) => `M ${SAT_X} ${satY(i)} Q ${SAT_X + 22} ${(satY(i) + satY(lastI)) / 2} ${SAT_X} ${satY(lastI)}`;

function splitWords(text) {
  return text.split(" ").map((word, i) => {
    const clean = word.toLowerCase().replace(/[.,—:()]/g, "");
    return { word, isTech: TECH_WORDS.has(clean), key: `${clean}-${i}` };
  });
}

const WORDS = splitWords(ABOUT_TEXT);

export default function AboutSection() {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const ageRef = useRef(null);
  const ageWrapRef = useRef(null);
  const ambientRef = useRef(null);
  const gridRef = useRef(null);
  const netRef = useRef(null);
  const copyRef = useRef(null);
  const spineRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          all: "all",
          isMobile: "(max-width: 767px)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isMobile, reduced } = context.conditions;
          const scope = stageRef.current;
          const q = (sel) => scope.querySelectorAll(sel);

          // Прогрессивная отрисовка линий без платного DrawSVGPlugin:
          // dasharray = длине пути, гоним dashoffset от длины к нулю.
          const dashed = [spineRef.current, ...q(".about-link"), ...q(".about-converge")];
          dashed.forEach((el) => {
            if (!el) return;
            const len = el.getTotalLength();
            el.style.strokeDasharray = len;
            el.style.strokeDashoffset = len;
          });

          if (reduced) {
            // Всё видно сразу, структура сохранена, скролл-механики нет.
            dashed.forEach((el) => el && (el.style.strokeDashoffset = 0));
            gsap.set([...q(".about-word"), ...q(".about-node"), ...q(".about-sat"), ...q(".about-marker"), ...q(".about-cta")], {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            });
            gsap.set(q(".about-node-dot"), { attr: { r: 2.6 }, opacity: 0.75 });
            gsap.set(q(".about-ring"), { opacity: 0 });
            gsap.set(q(".about-sat"), { attr: { r: 2.8 }, opacity: 1 });
            gsap.set(q(".about-sat-fullstack"), { attr: { r: 4.2 } });
            gsap.set([ambientRef.current, gridRef.current], { opacity: 0.5 });
            if (ageRef.current) ageRef.current.textContent = "16";
            gsap.set(ageWrapRef.current, { opacity: 1, y: 0, filter: "blur(0px)" });
            return;
          }

          const k = isMobile ? 0.6 : 1;

          gsap.set([ambientRef.current, gridRef.current], { opacity: 0 });
          gsap.set(ageWrapRef.current, { opacity: 0, y: 26 * k, filter: "blur(10px)" });
          gsap.set(q(".about-word"), { opacity: 0, y: 14 * k, filter: "blur(6px)" });
          gsap.set([...q(".about-marker"), ...q(".about-cta")], { opacity: 0, y: 16 * k });
          gsap.set(q(".about-node"), { opacity: 0 });
          // Радиус вместо scale: у SVG-кругов GSAP добавляет собственную
          // компенсацию transform-origin, которая смещает элемент.
          gsap.set(q(".about-node-dot"), { attr: { r: 1.1 }, opacity: 0.3 });
          gsap.set(q(".about-ring"), { attr: { r: 3 }, opacity: 0 });
          gsap.set(q(".about-sat"), { attr: { r: 0 }, opacity: 0 });

          // На мобильном секция НЕ пинится: уместить абзац, «16» и схему в
          // 100vh можно только ценой нечитаемых подписей. Вместо этого та же
          // история проигрывается, пока секция проходит через экран.
          const tl = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: isMobile
              ? {
                  trigger: stageRef.current,
                  start: "top 85%",
                  end: "bottom 15%",
                  scrub: 1,
                  invalidateOnRefresh: true,
                }
              : {
                  trigger: trackRef.current,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 1,
                  pin: stageRef.current,
                  pinSpacing: false,
                  invalidateOnRefresh: true,
                },
          });

          // ── ВХОД: сцена «просыпается» слоями, а не одним fade ──────────
          tl.to(ambientRef.current, { opacity: 1, duration: 0.5 }, 0);
          tl.to(gridRef.current, { opacity: 1, duration: 0.5 }, 0.1);
          tl.fromTo(
            q(".about-eyebrow-line"),
            { scaleX: 0, transformOrigin: "left" },
            { scaleX: 1, duration: 0.4 },
            0.15
          );
          tl.to(q(".about-word"), { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, stagger: 0.012 }, 0.25);
          tl.to(ageWrapRef.current, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5 }, 0.3);

          // Маркеры и кнопка — часть вводного блока: если придержать их до
          // финала, левая колонка почти весь скролл выглядит незаконченной.
          tl.to([...q(".about-marker"), ...q(".about-cta")], { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 }, 0.55);

          // Счётчик 0 → 16: пишем в DOM напрямую, без React-state на кадр.
          const counter = { v: 0 };
          tl.to(
            counter,
            {
              v: 16,
              duration: 0.6,
              ease: "power1.out",
              onUpdate: () => {
                if (ageRef.current) ageRef.current.textContent = String(Math.round(counter.v));
              },
            },
            0.35
          );

          // ── ФАЗЫ: хребет чертится, вехи оживают, система усложняется ──
          const PHASE_START = 1;
          PHASES.forEach((phase, i) => {
            const at = PHASE_START + i;
            const dot = q(`.about-node-${phase.id} .about-node-dot`);
            const ring = q(`.about-node-${phase.id} .about-ring`);

            // Хребет дорисовывается ровно до текущей вехи.
            const spineLen = spineRef.current.getTotalLength();
            tl.to(
              spineRef.current,
              { strokeDashoffset: spineLen * (1 - (i + 1) / PHASES.length), duration: 0.75, ease: "none" },
              at - 0.35
            );

            tl.to(q(`.about-node-${phase.id}`), { opacity: 1, duration: 0.3 }, at - 0.2);
            // active: точка ярче, кольцо расходится наружу
            tl.to(dot, { attr: { r: 3.1 }, opacity: 1, duration: 0.3 }, at - 0.1);
            tl.fromTo(
              ring,
              { attr: { r: 3.2 }, opacity: 0 },
              { attr: { r: 6.4 }, opacity: 0.85, duration: 0.45 },
              at - 0.1
            );
            // completed: видима, но спокойнее — кольцо гаснет, точка садится
            tl.to(dot, { attr: { r: 2.4 }, opacity: 0.7, duration: 0.4 }, at + 0.45);
            tl.to(ring, { attr: { r: 8.5 }, opacity: 0, duration: 0.5 }, at + 0.45);

            // Узел-возможность и связь к нему.
            if (phase.sat) {
              q(`.about-link-${phase.id}`).forEach((el) => {
                tl.to(el, { strokeDashoffset: 0, duration: 0.4, ease: "none" }, at);
              });
              tl.to(
                q(`.about-sat-${phase.id}`),
                { attr: { r: phase.id === "fullstack" ? 4.2 : 2.8 }, opacity: 1, duration: 0.4 },
                at + 0.12
              );
            }
          });

          // ── ФИНАЛ: всё сходится в единую систему ──────────────────────
          const finale = PHASE_START + PHASES.length - 1;
          q(".about-converge").forEach((el, i) => {
            tl.to(el, { strokeDashoffset: 0, duration: 0.5, ease: "none" }, finale + 0.25 + i * 0.06);
          });
          tl.to(q(".about-sat-fullstack"), { attr: { r: 5.6 }, duration: 0.3 }, finale + 0.55);
          tl.to(q(".about-sat-fullstack"), { attr: { r: 4.6 }, duration: 0.4 }, finale + 0.85);

          // ── МОСТ В «ЧТО Я ДЕЛАЮ»: сеть сжимается и уходит вперёд ──────
          tl.to(netRef.current, { opacity: 0.25, scale: 0.94, y: -30 * k, duration: 0.7 }, finale + 1.15);
          tl.to(ambientRef.current, { opacity: 0.35, duration: 0.7 }, finale + 1.15);

          // ── ПАРАЛЛАКС ОТ КУРСОРА (отключён на мобильных) ──────────────
          if (!isMobile) {
            const layers = [
              { el: ambientRef.current, d: 2 },
              { el: gridRef.current, d: 4 },
              { el: netRef.current, d: 7 },
              { el: copyRef.current, d: 1.5 },
            ];
            // quickTo вместо нового твина на каждое движение мыши.
            const setters = layers.map(({ el, d }) => ({
              d,
              x: gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" }),
              y: gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" }),
            }));
            const onMove = (e) => {
              const r = stageRef.current.getBoundingClientRect();
              const nx = (e.clientX - r.left) / r.width - 0.5;
              const ny = (e.clientY - r.top) / r.height - 0.5;
              setters.forEach((s) => {
                s.x(nx * s.d * 2);
                s.y(ny * s.d * 2);
              });
            };
            stageRef.current.addEventListener("mousemove", onMove, { passive: true });
            return () => stageRef.current?.removeEventListener("mousemove", onMove);
          }
        }
      );

      return () => mm.revert();
    },
    { scope: stageRef, dependencies: [] }
  );

  return (
    <section className="about" id="about">
      <span className="section-number" aria-hidden="true">
        01
      </span>

      <div
        ref={trackRef}
        className="about-track"
        style={{ height: `calc(var(--about-phase-vh) * ${PHASES.length + 2})` }}
      >
        <div ref={stageRef} className="about-stage">
          <div ref={ambientRef} className="about-ambient" aria-hidden="true" />
          <div ref={gridRef} className="about-grid" aria-hidden="true" />

          <div ref={copyRef} className="about-copy">
            <span className="section-eyebrow about-eyebrow">
              01 / Обо мне
              <span className="about-eyebrow-line" aria-hidden="true" />
            </span>

            <h2 className="hero-heading about-heading">Обо мне</h2>

            <div ref={ageWrapRef} className="about-age">
              <span ref={ageRef} className="about-age-value">
                0
              </span>
              <span className="about-age-label">
                лет
                <span className="about-age-sub">в 11 классе</span>
              </span>
            </div>

            <p className="about-text">
              {WORDS.map(({ word, isTech, key }, i) => (
                <span key={key}>
                  <span
                    className={`about-word${isTech ? " about-tech" : ""}`}
                    tabIndex={isTech ? 0 : undefined}
                  >
                    {word}
                  </span>
                  {i < WORDS.length - 1 ? " " : ""}
                </span>
              ))}
            </p>

            <div className="about-markers">
              {ABOUT_MARKERS.map((m) => (
                <span key={m} className="about-marker">
                  {m}
                </span>
              ))}
            </div>

            <div className="about-cta">
              <ContactButton />
            </div>
          </div>

          <div ref={netRef} className="about-net">
            <svg viewBox="0 0 120 200" className="about-svg" aria-hidden="true">
              {/* Хребет таймлайна */}
              <line
                ref={spineRef}
                className="about-spine"
                x1={SPINE_X}
                y1={TOP_Y}
                x2={SPINE_X}
                y2={nodeY(PHASES.length - 1)}
              />

              {/* Связи веха → узел-возможность */}
              {PHASES.map((p, i) =>
                p.sat ? (
                  <line
                    key={`l-${p.id}`}
                    className={`about-link about-link-${p.id}`}
                    x1={SPINE_X}
                    y1={nodeY(i)}
                    x2={SAT_X}
                    y2={satY(i)}
                  />
                ) : null
              )}

              {/* Финальное схождение: всё соединяется с «Продуктом» */}
              {PHASES.slice(1, -1).map((p, i) => (
                <path key={`c-${p.id}`} className="about-converge" d={convergePath(i + 1, PHASES.length - 1)} fill="none" />
              ))}

              {/* Вехи на хребте */}
              {PHASES.map((p, i) => (
                <g key={p.id} className={`about-node about-node-${p.id}`}>
                  <circle className="about-ring" cx={SPINE_X} cy={nodeY(i)} r={5.5} />
                  <circle className="about-node-dot" cx={SPINE_X} cy={nodeY(i)} r={2.6} />
                </g>
              ))}

              {/* Узлы-возможности */}
              {PHASES.map((p, i) =>
                p.sat ? (
                  <circle
                    key={`s-${p.id}`}
                    className={`about-sat about-sat-${p.id}`}
                    cx={SAT_X}
                    cy={satY(i)}
                    r={p.id === "fullstack" ? 4.2 : 2.8}
                  />
                ) : null
              )}

              {/* Подписи живут в той же системе координат, что и узлы —
                  иначе при preserveAspectRatio они неизбежно разъезжаются
                  с кругами на разных пропорциях контейнера. */}
              {PHASES.map((p, i) => (
                <g key={`t-${p.id}`} className={`about-node about-node-${p.id}`}>
                  <text className="about-label" x={SPINE_X + 5} y={nodeY(i) + 1.4}>
                    {p.label}
                  </text>
                  <text className="about-note" x={SPINE_X + 5} y={nodeY(i) + 6.2}>
                    {p.note}
                  </text>
                  {p.sat ? (
                    <text className="about-sat-label" x={SAT_X + 6} y={satY(i) + 1.2}>
                      {p.sat}
                    </text>
                  ) : null}
                </g>
              ))}
            </svg>

            {/* Тот же путь развития — обычным списком для скринридеров:
                SVG-версия декоративна и скрыта от них. */}
            <ol className="sr-only">
              {PHASES.map((p) => (
                <li key={`sr-${p.id}`}>
                  {p.label} — {p.note}
                  {p.sat ? `, ${p.sat}` : ""}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
