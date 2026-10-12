import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { shouldReduceMotion } from "../hooks/useMotionPreference.js";
import ContactButton from "../components/ContactButton.jsx";
import { locale, t } from "../i18n/index.js";

const ABOUT_PARAGRAPHS = t("about.text");

// Слова стека внутри параграфа подсвечиваются и реагируют на курсор -
// они же служат «сигналами» системы, а не декоративными бейджами. Список
// слов для подсветки идёт из словаря вместе с текстом - в RU и EN тексте
// это разные токены (например "backend-логики" против "backend").
const TECH_WORDS = new Set(t("about.techWords"));

// Стаж в разработке - число в большом счётчике секции.
const EXPERIENCE_YEARS = 2;
// Подпись согласуется с числом по правилам языка: 2 → «года опыта», 5 → «лет опыта».
const EXPERIENCE_FORMS = t("about.experience");
const PLURAL_RULES = new Intl.PluralRules(locale);
const experienceLabel = (n) => EXPERIENCE_FORMS[PLURAL_RULES.select(n)] ?? EXPERIENCE_FORMS.other;
const EXPERIENCE_LABEL = experienceLabel(EXPERIENCE_YEARS);

// Чипы стека: id совпадает со словом в тексте, по нему чип подсвечивает
// своё упоминание в абзаце. Python - стартовая точка, остальное - текущий стек
// (ровно так, как сказано в самом тексте).
const STACK_FROM = [{ id: "python", label: "Python" }];
const STACK_NOW = [
  { id: "typescript", label: "TypeScript" },
  { id: "react", label: "React" },
  { id: "next.js", label: "Next.js" },
  { id: "node.js", label: "Node.js" },
];

/**
 * Семь фаз эволюции. Каждая веха на «хребте» таймлайна открывает свой
 * узел-возможность справа - так личная история превращается в архитектуру
 * системы, а на последней фазе всё сходится в «Продукт».
 */
const PHASE_IDS = ["start", "python", "web", "react", "node", "ai", "fullstack"];
const PHASES = PHASE_IDS.map((id) => {
  const phase = t(`about.phases.${id}`);
  return { id, label: phase.label, note: phase.note, sat: phase.sat ?? null };
});

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

/**
 * Абзац → куски: обычный текст остаётся строкой, слово стека - отдельный
 * кусок с id. Пунктуацию отрезаем от слова, чтобы подчёркивание не
 * захватывало запятую.
 */
function splitParagraph(text) {
  const parts = [];
  let plain = "";
  text.split(" ").forEach((word, i) => {
    const sep = i > 0 ? " " : "";
    // Знаки препинания по краям слова, но не точка внутри (next.js, node.js).
    const m = word.match(/^([«(]*)(.*?)([»),:;.!?]*)$/);
    const id = m[2].toLowerCase();
    if (!TECH_WORDS.has(id)) {
      plain += sep + word;
      return;
    }
    parts.push(plain + sep + m[1]);
    parts.push({ id, word: m[2] });
    plain = m[3];
  });
  parts.push(plain);
  return parts;
}

const PARAGRAPHS = ABOUT_PARAGRAPHS.map(splitParagraph);

/** Подсветка чипа и его упоминаний в тексте - прямо в DOM, без ре-рендера. */
function highlightTech(root, id) {
  if (!root) return;
  root.querySelectorAll("[data-tech]").forEach((el) => {
    el.classList.toggle("is-linked", id !== null && el.dataset.tech === id);
  });
}

/**
 * Общие обработчики для чипа и слова в тексте: наведение на одно
 * подсвечивает второе. Мышь - hover; тач и клавиатура - фокус (тап держит
 * подсветку, пока не тапнешь в другое место).
 */
function linkProps(id) {
  // Корень ищем от элемента события: ref в рендере сюда не передаём.
  const rootOf = (e) => e.currentTarget.closest(".about-copy");
  const show = (e, techId) => highlightTech(rootOf(e), techId);
  // После ухода мыши возвращаем подсветку элементу в фокусе, если он есть.
  const restore = (e) => {
    const focused = document.activeElement;
    show(e, rootOf(e)?.contains(focused) ? (focused.dataset.tech ?? null) : null);
  };
  return {
    "data-tech": id,
    tabIndex: 0,
    onPointerEnter: (e) => e.pointerType === "mouse" && show(e, id),
    onPointerLeave: (e) => e.pointerType === "mouse" && restore(e),
    onFocus: (e) => show(e, id),
    onBlur: (e) => show(e, null),
    onClick: (e) => show(e, id),
  };
}

export default function AboutSection() {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const expRef = useRef(null);
  const expValueRef = useRef(null);
  const expLabelRef = useRef(null);
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
          const { isMobile } = context.conditions;
          const reduced = shouldReduceMotion(context.conditions.reduced);
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
            // Счётчик сразу с итоговым значением - на случай, если настройку
            // переключили посреди анимации счёта.
            if (expValueRef.current) expValueRef.current.textContent = String(EXPERIENCE_YEARS);
            if (expLabelRef.current) expLabelRef.current.textContent = EXPERIENCE_LABEL;
            dashed.forEach((el) => el && (el.style.strokeDashoffset = 0));
            gsap.set([...q(".about-node"), ...q(".about-sat")], { opacity: 1 });
            gsap.set(q(".about-node-dot"), { attr: { r: 2.6 }, opacity: 0.75 });
            gsap.set(q(".about-ring"), { opacity: 0 });
            gsap.set(q(".about-sat"), { attr: { r: 2.8 }, opacity: 1 });
            gsap.set(q(".about-sat-fullstack"), { attr: { r: 4.2 } });
            gsap.set([ambientRef.current, gridRef.current], { opacity: 0.5 });
            return;
          }

          const k = isMobile ? 0.6 : 1;

          // ── ЛЕВАЯ КОЛОНКА: одно однократное появление при входе в экран ──
          // Не привязано к scrub: текст, счётчик и чипы проигрываются один
          // раз и дальше просто стоят. Только transform и opacity.
          const reveal = gsap.timeline({
            defaults: { ease: "expo.out", duration: 0.9 },
            scrollTrigger: { trigger: copyRef.current, start: "top 80%", once: true },
          });
          gsap.set(q(".about-eyebrow-line"), { scaleX: 0, transformOrigin: "left" });
          gsap.set([expRef.current, ...q(".about-para"), ...q(".about-stack-group"), ...q(".about-cta")], {
            opacity: 0,
            y: 22 * k,
          });
          gsap.set(q(".about-chip"), { opacity: 0, y: 10 * k, scale: 0.92 });
          gsap.set(q(".about-stack-link"), { scaleX: 0, transformOrigin: "left" });
          // Число и подпись меняются вместе: «0 лет» → «1 год» → «2 года».
          let shown = null;
          const renderCount = (n) => {
            if (n === shown || !expValueRef.current || !expLabelRef.current) return;
            shown = n;
            expValueRef.current.textContent = String(n);
            expLabelRef.current.textContent = experienceLabel(n);
          };
          renderCount(0);

          reveal.to(q(".about-eyebrow-line"), { scaleX: 1, duration: 0.8 }, 0);
          reveal.to(expRef.current, { opacity: 1, y: 0 }, 0.05);
          // Счётчик 0 → EXPERIENCE_YEARS: пишем в DOM напрямую, без React-state на кадр.
          const counter = { v: 0 };
          reveal.to(
            counter,
            {
              v: EXPERIENCE_YEARS,
              duration: 1.1,
              ease: "power2.out",
              onUpdate: () => {
                renderCount(Math.round(counter.v));
              },
            },
            0.15
          );
          reveal.to(q(".about-para"), { opacity: 1, y: 0, stagger: 0.12 }, 0.2);
          reveal.to(q(".about-stack-group"), { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, 0.5);
          reveal.to(q(".about-chip"), { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.06 }, 0.55);
          reveal.to(q(".about-stack-link"), { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, 0.6);
          reveal.to(q(".about-cta"), { opacity: 1, y: 0 }, 0.85);

          gsap.set([ambientRef.current, gridRef.current], { opacity: 0 });
          gsap.set(q(".about-node"), { opacity: 0 });
          // Радиус вместо scale: у SVG-кругов GSAP добавляет собственную
          // компенсацию transform-origin, которая смещает элемент.
          gsap.set(q(".about-node-dot"), { attr: { r: 1.1 }, opacity: 0.3 });
          gsap.set(q(".about-ring"), { attr: { r: 3 }, opacity: 0 });
          gsap.set(q(".about-sat"), { attr: { r: 0 }, opacity: 0 });

          // На мобильном секция НЕ пинится: уместить абзац, счётчик опыта и схему в
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
            // completed: видима, но спокойнее - кольцо гаснет, точка садится
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
              {t("about.eyebrow")}
              <span className="about-eyebrow-line" aria-hidden="true" />
            </span>

            <h2 className="hero-heading about-heading">{t("about.heading")}</h2>

            {/* Число и подпись - два отдельных элемента на общей базовой
                линии. Скринридер читает одну фразу без анимации счёта. */}
            <p ref={expRef} className="about-exp">
              <span ref={expValueRef} className="about-exp-value" aria-hidden="true">
                {EXPERIENCE_YEARS}
              </span>
              <span ref={expLabelRef} className="about-exp-label" aria-hidden="true">
                {EXPERIENCE_LABEL}
              </span>
              <span className="sr-only">{`${EXPERIENCE_YEARS} ${EXPERIENCE_LABEL}`}</span>
            </p>

            <div className="about-text">
              {PARAGRAPHS.map((parts, pi) => (
                <p key={pi} className="about-para">
                  {parts.map((part, i) =>
                    typeof part === "string" ? (
                      part
                    ) : (
                      <span key={i} className="about-tech" {...linkProps(part.id)}>
                        {part.word}
                      </span>
                    )
                  )}
                </p>
              ))}
            </div>

            {/* Python - откуда начинал, справа - текущий стек; линия между
                группами показывает переход, а не иерархию. */}
            <div className="about-stack">
              <div className="about-stack-group about-stack-from">
                <span className="about-stack-caption">{t("about.stackFrom")}</span>
                <ul className="about-chips">
                  {STACK_FROM.map((s) => (
                    <li key={s.id} className="about-chip" data-cursor="" {...linkProps(s.id)}>
                      {s.label}
                    </li>
                  ))}
                </ul>
              </div>
              <span className="about-stack-link" aria-hidden="true" />
              <div className="about-stack-group about-stack-now">
                <span className="about-stack-caption">{t("about.stackNow")}</span>
                <ul className="about-chips">
                  {STACK_NOW.map((s) => (
                    <li key={s.id} className="about-chip" data-cursor="" {...linkProps(s.id)}>
                      {s.label}
                    </li>
                  ))}
                </ul>
              </div>
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

              {/* Подписи живут в той же системе координат, что и узлы -
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

            {/* Тот же путь развития - обычным списком для скринридеров:
                SVG-версия декоративна и скрыта от них. */}
            <ol className="sr-only">
              {PHASES.map((p) => (
                <li key={`sr-${p.id}`}>
                  {p.label} - {p.note}
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
