import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import FadeIn from "../../components/FadeIn.jsx";
import { SERVICES } from "./data.js";
import Phone from "./screens/Phone.jsx";
import RestaurantScreen from "./screens/RestaurantScreen.jsx";

/**
 * 6 состояний скролла. Телефон СТОИТ на месте справа — меняется только то,
 * что он «делает»: микро-наклон/масштаб как реакция на скролл + сайт EMBER,
 * который реально прокручивается внутри клип-области экрана.
 *
 * phone.x/y — в пикселях, максимум ±8px: левый край телефона на 1440px
 * находится на 816px при центре вьюпорта 720px, поэтому даже в худшем
 * состоянии между телефоном и центром остаётся ~88px запаса.
 * scroll — доля полного хода внутренней страницы EMBER.
 */
const STATES = [
  { phone: { rotationZ: -1.5, rotationY: 0, scale: 0.98, x: 0, y: 0 }, glassY: 0, deco: { x: 0, y: 0 }, scroll: 0 },
  { phone: { rotationZ: 1, rotationY: -2, scale: 1, x: -6, y: -4 }, glassY: 3, deco: { x: 5, y: 8 }, scroll: 0.06 },
  { phone: { rotationZ: -1, rotationY: 2, scale: 1.015, x: 4, y: 6 }, glassY: -4, deco: { x: -6, y: -10 }, scroll: 0.28 },
  { phone: { rotationZ: 1.5, rotationY: -1.5, scale: 0.99, x: -8, y: -6 }, glassY: 4, deco: { x: 7, y: 11 }, scroll: 0.52 },
  { phone: { rotationZ: -1, rotationY: 2, scale: 1.01, x: 6, y: 4 }, glassY: -3, deco: { x: -5, y: -8 }, scroll: 0.76 },
  { phone: { rotationZ: 0, rotationY: 0, scale: 1, x: 0, y: 0 }, glassY: 0, deco: { x: 0, y: 0 }, scroll: 1 },
];

// Состояний 6, а услуг 5: последнее — «READY», успокоение, на нём активной
// остаётся карточка 05. Сегментов между состояниями, соответственно, 5.
const SEGMENTS = STATES.length - 1;

export default function WhatIDoSection() {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const phoneRef = useRef(null);
  const decoLayerRef = useRef(null);
  const textRefs = useRef([]);
  const decoRefs = useRef([]);
  const progressLabelRef = useRef(null);
  const progressFillRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          // "all" обязателен: без него gsap.matchMedia не вызовет колбэк,
          // когда ни одно именованное условие не совпало (обычный десктоп
          // без reduced-motion) — и анимация молча не построится.
          all: "all",
          isMobile: "(max-width: 767px)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isMobile, reduced } = context.conditions;
          const scope = stageRef.current;
          const glass = scope.querySelector(".wid-r-viewport");
          const ember = scope.querySelector(".wid-r");
          const screen = scope.querySelector(".wid-phone-screen-inner");

          // Полный ход внутренней страницы = насколько она выше экрана.
          // Функция, а не константа: пересчитывается на refresh (ресайз,
          // подгрузка шрифтов), см. invalidateOnRefresh ниже.
          const travel = () => (ember && screen ? Math.max(0, ember.scrollHeight - screen.clientHeight) : 0);

          if (reduced) {
            // Без pin/scrub: телефон в нейтрали, EMBER в исходной позиции,
            // все карточки услуг читаемы (раскладку в поток делает CSS).
            gsap.set(phoneRef.current, { rotationZ: 0, rotationY: 0, scale: 1, x: 0, y: 0 });
            gsap.set(ember, { y: 0 });
            gsap.set(glass, { y: 0 });
            gsap.set(textRefs.current, { opacity: 1, y: 0 });
            gsap.set(decoRefs.current, { opacity: 1, y: 0 });
            return;
          }

          // На мобильном амплитуда микродвижений гасится — композиция там
          // вертикальная и узкая, тот же наклон читается сильнее.
          const k = isMobile ? 0.45 : 1;
          const amp = (v) => v * k;

          gsap.set(phoneRef.current, {
            rotationZ: amp(STATES[0].phone.rotationZ),
            rotationY: amp(STATES[0].phone.rotationY),
            scale: 1 + (STATES[0].phone.scale - 1) * k,
            x: amp(STATES[0].phone.x),
            y: amp(STATES[0].phone.y),
          });
          gsap.set(ember, { y: 0 });
          gsap.set(textRefs.current[0], { opacity: 1, y: 0 });
          gsap.set(textRefs.current.slice(1), { opacity: 0, y: 18 });
          gsap.set(decoRefs.current[0], { opacity: 1, y: 0 });
          gsap.set(decoRefs.current.slice(1), { opacity: 0, y: 12 });

          const tl = gsap.timeline({
            defaults: { ease: "power1.inOut" },
            scrollTrigger: {
              trigger: trackRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              pin: stageRef.current,
              pinSpacing: false,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                // Прогресс → время таймлайна (SEGMENTS сегментов). Новая
                // карточка проявляется на t=i+0.8…i+1.0, поэтому +0.2: номер
                // меняется вместе с её появлением, а не раньше.
                const t = self.progress * SEGMENTS;
                const idx = Math.min(SERVICES.length - 1, Math.max(0, Math.floor(t + 0.2)));
                // Прямая запись в DOM вместо setState: на скролле не должно
                // быть ни одного ре-рендера React.
                if (progressLabelRef.current) {
                  progressLabelRef.current.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(SERVICES.length).padStart(2, "0")}`;
                }
                if (progressFillRef.current) {
                  progressFillRef.current.style.width = `${((idx + 1) / SERVICES.length) * 100}%`;
                }
              },
            },
          });

          for (let i = 1; i < STATES.length; i += 1) {
            const at = i - 1;
            const s = STATES[i];

            // Слой 1 — корпус: минимальная амплитуда, мягкий ease.
            tl.to(
              phoneRef.current,
              {
                rotationZ: amp(s.phone.rotationZ),
                rotationY: amp(s.phone.rotationY),
                scale: 1 + (s.phone.scale - 1) * k,
                x: amp(s.phone.x),
                y: amp(s.phone.y),
                duration: 1,
              },
              at
            );

            // Слой 2 — «стекло»: встречное микросмещение, даёт глубину.
            tl.to(glass, { y: amp(s.glassY), duration: 1 }, at);

            // Слой 3 — сама страница EMBER: ease "none", чтобы читалось как
            // настоящий скролл сайта, а не как анимация.
            tl.to(ember, { y: () => -travel() * s.scroll, duration: 1, ease: "none" }, at);

            // Слой 4 — деко: собственные оффсеты, противоход к контенту.
            if (!isMobile) {
              tl.to(decoLayerRef.current, { x: s.deco.x, y: s.deco.y, duration: 1 }, at);
            }
          }

          // Смена карточки услуги — строго последовательно: уходящая гаснет
          // ПОЛНОСТЬЮ до того, как появится следующая. Перекрытие окон дало бы
          // два читаемых текста друг поверх друга на стыке состояний.
          // Уход: i+0.60 → i+0.80, приход: i+0.80 → i+1.00 (ровно к состоянию).
          for (let i = 0; i < SERVICES.length - 1; i += 1) {
            tl.to(textRefs.current[i], { opacity: 0, y: -18, duration: 0.2, ease: "power2.in" }, i + 0.6);
            tl.fromTo(
              textRefs.current[i + 1],
              { opacity: 0, y: 18 },
              { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
              i + 0.8
            );

            if (!isMobile) {
              tl.to(decoRefs.current[i], { opacity: 0, y: -12, duration: 0.2, ease: "power2.in" }, i + 0.6);
              tl.fromTo(
                decoRefs.current[i + 1],
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
                i + 0.8
              );
            }
          }
        }
      );

      return () => mm.revert();
    },
    { scope: stageRef, dependencies: [] }
  );

  return (
    <section className="wid-section" id="services">
      <span className="section-number" aria-hidden="true">
        03
      </span>

      <FadeIn delay={0} y={20} className="section-eyebrow">
        03 / Чем занимаюсь
      </FadeIn>

      <FadeIn delay={0.05} y={40}>
        <h2 className="hero-heading wid-heading">Что я делаю</h2>
      </FadeIn>

      <div ref={trackRef} className="wid-pin-track" style={{ height: `calc(var(--wid-state-vh) * ${SEGMENTS + 1})` }}>
        <div ref={stageRef} className="wid-pin-stage">
          <div className="wid-pin-copy">
            {SERVICES.map((service, i) => (
              <div
                key={service.number}
                className="wid-pin-text"
                ref={(el) => {
                  if (el) textRefs.current[i] = el;
                }}
              >
                <span className="wid-pin-number">{service.number}</span>
                <h3 className="wid-pin-title">{service.name}</h3>
                <p className="wid-pin-desc">{service.description}</p>
                <div className="wid-pin-tech">
                  {service.tech.map((t) => (
                    <span key={t} className="wid-pin-tech-chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            <div className="wid-pin-progress" aria-hidden="true">
              <span ref={progressLabelRef} className="wid-pin-progress-label">
                01 / {String(SERVICES.length).padStart(2, "0")}
              </span>
              <span className="wid-pin-progress-track">
                <span
                  ref={progressFillRef}
                  className="wid-pin-progress-fill"
                  style={{ width: `${(1 / SERVICES.length) * 100}%` }}
                />
              </span>
            </div>
          </div>

          <div className="wid-pin-phone-slot">
            <div ref={phoneRef} className="wid-pin-phone">
              <Phone>
                <RestaurantScreen />
              </Phone>
            </div>

            <div ref={decoLayerRef} className="wid-pin-deco" aria-hidden="true">
              {SERVICES.map((service, i) => (
                <div
                  key={service.number}
                  className="wid-pin-deco-set"
                  ref={(el) => {
                    if (el) decoRefs.current[i] = el;
                  }}
                >
                  <span className="wid-pin-deco-chip wid-pin-deco-chip-a">{service.deco[0]}</span>
                  <span className="wid-pin-deco-chip wid-pin-deco-chip-b">{service.deco[1]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
