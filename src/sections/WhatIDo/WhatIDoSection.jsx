import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import FadeIn from "../../components/FadeIn.jsx";
import { SERVICES } from "./data.js";
import Phone from "./screens/Phone.jsx";
import RestaurantScreen from "./screens/RestaurantScreen.jsx";
import WebAppScreen from "./screens/WebAppScreen.jsx";
import SaaSScreen from "./screens/SaaSScreen.jsx";
import AIScreen from "./screens/AIScreen.jsx";
import InteractiveScreen from "./screens/InteractiveScreen.jsx";
import { restaurantSteps, webAppSteps, saasSteps, aiSteps, interactiveSteps } from "./screens/buildSteps.js";

const SCREENS = [
  { Screen: RestaurantScreen, steps: restaurantSteps },
  { Screen: WebAppScreen, steps: webAppSteps },
  { Screen: SaaSScreen, steps: saasSteps },
  { Screen: AIScreen, steps: aiSteps },
  { Screen: InteractiveScreen, steps: interactiveSteps },
];

// Один "тик" master-timeline на сервис — пропорции длительностей внутри
// него = пропорции экранного времени (scrub переводит их в скролл).
const SERVICE_SPAN = 20;

// Общая хореография одного сервиса (доли от его собственного SERVICE_SPAN,
// см. бриф §8): 0–20% enter, 20–90% reveal контента экрана, 90–94% hold,
// 94–100% exit. Реверс скролла реверсирует весь master-timeline естественно —
// отдельного кода для "назад" не требуется.
const ENTER_END = 0.2;
const BUILD_START = 0.2;
const BUILD_END = 0.9;
const HOLD_START = 0.94;

export default function WhatIDoSection() {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const itemRefs = useRef([]);
  const progressLabelRef = useRef(null);
  const progressFillRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          // "all" всегда активен — без него gsap.matchMedia НЕ вызывает
          // колбэк, если ни одно из именованных условий не совпало (а на
          // обычном десктопе без reduced-motion не совпадает ни isMobile,
          // ни reduced), и вся анимация молча не строится.
          all: "all",
          isMobile: "(max-width: 767px)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isMobile, reduced } = context.conditions;

          if (reduced) {
            // Финальное состояние всех сцен сразу, без pin/scrub — раскладка
            // в обычный поток управляется CSS (@media prefers-reduced-motion).
            itemRefs.current.forEach((item) => {
              gsap.set(item.phone, { x: 0, y: 0, opacity: 1, scale: 1, rotateY: 0, rotateZ: 0, filter: "blur(0px)" });
              gsap.set(item.text, { opacity: 1, y: 0 });
              gsap.set(item.deco, { opacity: 1, y: 0 });
            });
            SCREENS.forEach(({ steps }) => steps.forEach((step) => gsap.set(step.selector, step.to)));
            return;
          }

          const travel = isMobile ? "24vw" : "36vw";
          const enterRotY = isMobile ? 10 : 16;
          const enterRotZ = isMobile ? -2 : -4;

          const tl = gsap.timeline({
            defaults: { ease: "power2.inOut" },
            scrollTrigger: {
              trigger: trackRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              pin: stageRef.current,
              pinSpacing: false,
              onUpdate: (self) => {
                const idx = Math.min(SERVICES.length - 1, Math.floor(self.progress * SERVICES.length));
                if (progressLabelRef.current) {
                  progressLabelRef.current.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(SERVICES.length).padStart(2, "0")}`;
                }
                if (progressFillRef.current) {
                  progressFillRef.current.style.width = `${((idx + 1) / SERVICES.length) * 100}%`;
                }
              },
            },
          });

          const at = (i, frac) => i * SERVICE_SPAN + frac * SERVICE_SPAN;
          const dur = (frac) => frac * SERVICE_SPAN;

          SERVICES.forEach((_service, i) => {
            const item = itemRefs.current[i];
            const { steps } = SCREENS[i];

            // ENTER — телефон справа (лёгкий тilt, blur) въезжает в центр и
            // на прибытии слегка "перерастягивается", затем усаживается —
            // ощущение премиального продукта, не отскок.
            tl.fromTo(
              item.phone,
              { x: travel, opacity: 0, scale: 0.85, rotateY: enterRotY, rotateZ: enterRotZ, filter: "blur(8px)" },
              { x: 0, opacity: 1, scale: 1.045, rotateY: 0, rotateZ: 0, filter: "blur(0px)", duration: dur(ENTER_END), ease: "power3.out" },
              at(i, 0)
            );
            tl.to(item.phone, { scale: 1, duration: dur(0.12) }, at(i, ENTER_END));

            tl.fromTo(item.text, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: dur(0.16) }, at(i, 0));

            if (!isMobile) {
              tl.fromTo(item.deco, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: dur(0.14) }, at(i, 0.08));
            }

            // BUILD — контент экрана собирается по стадиям поверх окна
            // reveal (BUILD_START..BUILD_END, см. buildSteps.js).
            steps.forEach((step) => {
              const absPos = at(i, BUILD_START + step.position * (BUILD_END - BUILD_START));
              const absDur = dur(step.length * (BUILD_END - BUILD_START));
              tl.fromTo(step.selector, step.from, { ...step.to, duration: absDur }, absPos);
            });

            // EXIT — тот же телефон уходит вправо тем же жестом, каким
            // вошёл (единый объект: no hard cut в следующий сервис).
            tl.to(
              item.phone,
              { x: travel, opacity: 0, scale: 0.85, rotateY: enterRotY, rotateZ: enterRotZ, filter: "blur(8px)", duration: dur(1 - HOLD_START), ease: "power2.in" },
              at(i, HOLD_START)
            );
            tl.to(item.text, { opacity: 0, y: -16, duration: dur(1 - HOLD_START) }, at(i, HOLD_START));
            if (!isMobile) {
              tl.to(item.deco, { opacity: 0, y: -10, duration: dur(1 - HOLD_START) }, at(i, HOLD_START));
            }
          });
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

      <div ref={trackRef} className="wid-pin-track" style={{ height: `calc(var(--wid-service-vh) * ${SERVICES.length})` }}>
        <div ref={stageRef} className="wid-pin-stage">
          {SERVICES.map((service, i) => {
            const { Screen } = SCREENS[i];
            return (
            <div key={service.number} className="wid-pin-item">
              <div
                className="wid-pin-text"
                ref={(el) => {
                  if (!el) return;
                  itemRefs.current[i] = itemRefs.current[i] || {};
                  itemRefs.current[i].text = el;
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

              <div className="wid-pin-phone-slot">
                <div
                  className="wid-pin-phone"
                  ref={(el) => {
                    if (!el) return;
                    itemRefs.current[i] = itemRefs.current[i] || {};
                    itemRefs.current[i].phone = el;
                  }}
                >
                  <Phone>
                    <Screen />
                  </Phone>
                </div>

                <div
                  className="wid-pin-deco"
                  aria-hidden="true"
                  ref={(el) => {
                    if (!el) return;
                    itemRefs.current[i] = itemRefs.current[i] || {};
                    itemRefs.current[i].deco = el;
                  }}
                >
                  <span className="wid-pin-deco-chip wid-pin-deco-chip-a">{service.deco[0]}</span>
                  <span className="wid-pin-deco-chip wid-pin-deco-chip-b">{service.deco[1]}</span>
                </div>
              </div>
            </div>
            );
          })}

          <div className="wid-pin-progress" aria-hidden="true">
            <span ref={progressLabelRef} className="wid-pin-progress-label">
              01 / {String(SERVICES.length).padStart(2, "0")}
            </span>
            <span className="wid-pin-progress-track">
              <span ref={progressFillRef} className="wid-pin-progress-fill" style={{ width: `${(1 / SERVICES.length) * 100}%` }} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
