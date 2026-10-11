import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import FadeIn from "../components/FadeIn.jsx";
import ContactButton from "../components/ContactButton.jsx";
import useMotionPreference from "../hooks/useMotionPreference.js";
import { t } from "../i18n/index.js";
import "./video.css";

gsap.registerPlugin(ScrollTrigger);

const MEDIA = `${import.meta.env.BASE_URL}media/video/`;
const VIDEO = { src: `${MEDIA}ai-hero-desktop.mp4`, poster: `${MEDIA}ai-hero-desktop.webp` };

// Порядок шагов = порядок кнопок на панели монитора.
const STEPS = ["frame", "motion", "compress", "loop", "poster", "site"];

// Сложная сцена только там, где хватает места и есть мышь/трекпад рядом:
// на узких экранах и планшетах в портрете - статичная версия.
const DESKTOP_QUERY = "(min-width: 1024px) and (min-height: 600px)";

// Длительность в «единицах» таймлайна: вход в монитор, шесть шагов, пауза в конце.
const ZOOM = 1;
const STEP = 1;
const HOLD = 1.2;

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

function Intro({ className = "" }) {
  return (
    <header className={`vm-intro ${className}`}>
      <p className="section-eyebrow">{t("video.eyebrow")}</p>
      <h2 className="vm-heading">
        {t("video.headingLine1")}
        <br />
        {t("video.headingLine2")}
      </h2>
      <p className="vm-text">{t("video.text")}</p>
    </header>
  );
}

/** Слова описания шага - отдельными span, чтобы текст «печатался» по словам. */
function Words({ text }) {
  return text.split(" ").map((w, i) => (
    <span className="vm-word" style={{ "--w": i }} key={i}>
      {w}{" "}
    </span>
  ));
}

/** Десктоп: секция закрепляется, монитор приближается до полного экрана, внутри по шагам идёт путь ролика. */
function MonitorScene() {
  const trackRef = useRef(null);
  const screenRef = useRef(null);
  const videoRef = useRef(null);
  const [armed, setArmed] = useState(false);

  // Видео начинает грузиться, только когда секция подъезжает к экрану.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const track = trackRef.current;
      const screen = screenRef.current;
      const video = videoRef.current;
      const buttons = [...track.querySelectorAll(".vm-btn")];
      const items = [...track.querySelectorAll(".vm-path-item")];
      const status = [...track.querySelectorAll(".vm-status-item")];
      const root = document.documentElement;

      // -2: «ещё не применяли», чтобы первый вызов applyStep(-1) отработал.
      let step = -2;
      let visible = false;

      // Видео играет только начиная с шага «Оживить» и пока секция на экране.
      const syncVideo = () => {
        if (!video) return;
        if (visible && step >= 1) video.play()?.catch(() => {});
        else video.pause();
      };

      // Состояние шагов меняется через data-атрибуты, без ререндера React.
      const applyStep = (next) => {
        if (next === step) return;
        step = next;
        screen.dataset.step = String(next + 1);
        // is-s1..is-s6 накапливаются: всё, что сделано на прошлых шагах, остаётся на экране.
        for (let k = 1; k <= STEPS.length; k++) screen.classList.toggle(`is-s${k}`, next + 1 >= k);
        status.forEach((el, i) => (el.hidden = i !== next));
        buttons.forEach((b, i) => (b.dataset.state = i < next ? "done" : i === next ? "active" : "idle"));
        items.forEach((li, i) => (li.dataset.state = i < next ? "done" : i === next ? "active" : "idle"));
        syncVideo();
      };
      applyStep(-1);

      // Центр кнопки в координатах экрана, независимо от текущего масштаба.
      const target = (btn, axis) => () => {
        const s = screen.getBoundingClientRect();
        const b = btn.getBoundingClientRect();
        const k = screen.offsetWidth / s.width;
        return axis === "x" ? (b.left + b.width / 2 - s.left) * k : (b.top + b.height / 2 - s.top) * k;
      };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const time = self.progress * tl.duration();
            // Шаг включается в момент «нажатия» - на середине своего отрезка.
            const raw = Math.floor((time - ZOOM - STEP * 0.5) / STEP);
            applyStep(Math.max(-1, Math.min(STEPS.length - 1, raw)));
            // Внутри монитора навигация сайта не нужна - прячем, пока экран развёрнут.
            root.classList.toggle("vm-immersive", self.isActive && time > ZOOM * 0.92);
            // Последний шаг показан - интерфейс разъезжается, остаётся сайт.
            screen.classList.toggle("is-final", time >= ZOOM + STEPS.length * STEP + 0.2);
          },
          onToggle: (self) => {
            visible = self.isActive;
            if (!self.isActive) root.classList.remove("vm-immersive");
            syncVideo();
          },
        },
      });

      // Вход в монитор: экран вырастает до размеров окна, вступление уходит.
      // Монитор стоит справа от текста, при входе встаёт по центру и растёт до окна.
      tl.fromTo(
        ".vm-rig",
        { scale: 0.5, xPercent: 17, yPercent: 5 },
        { scale: 1, xPercent: 0, yPercent: 0, duration: ZOOM, ease: "power2.inOut" },
        0
      )
        .fromTo(".vm-rig", { "--vm-radius": "28px" }, { "--vm-radius": "0px", duration: ZOOM * 0.4 }, ZOOM * 0.6)
        .to(".vm-intro", { autoAlpha: 0, y: -60, duration: ZOOM * 0.45 }, 0)
        .to(".vm-room", { autoAlpha: 0, duration: ZOOM * 0.5 }, ZOOM * 0.5);

      // Курсор подъезжает к кнопке и «нажимает» её.
      buttons.forEach((btn, i) => {
        const at = ZOOM + i * STEP;
        tl.to(".vm-cursor", { x: target(btn, "x"), y: target(btn, "y"), duration: STEP * 0.42, ease: "power2.inOut" }, at)
          .to(".vm-cursor", { scale: 0.78, duration: STEP * 0.06 }, at + STEP * 0.46)
          .to(".vm-cursor", { scale: 1, duration: STEP * 0.1 }, at + STEP * 0.52);
      });
      tl.fromTo(".vm-cursor", { autoAlpha: 1 }, { autoAlpha: 0, duration: STEP * 0.3 }, ZOOM + (STEPS.length - 1) * STEP + STEP * 0.6);
      tl.to({}, { duration: HOLD });

      return () => root.classList.remove("vm-immersive");
    },
    { scope: trackRef, dependencies: [] }
  );

  return (
    <div className="vm-track" ref={trackRef}>
      <div className="vm-stage">
        <div className="vm-room" aria-hidden="true" />
        <Intro />

        <div className="vm-rig">
          <div className="vm-bezel" aria-hidden="true">
            <span className="vm-stand" />
          </div>

          <div className="vm-screen" ref={screenRef} data-step="0">
            <div className="vm-preview" role="img" aria-label={t("video.frameLabel")}>
              <span className="vm-empty" aria-hidden="true">
                {t("video.monitor.empty")}
              </span>
              <img className="vm-poster" src={VIDEO.poster} alt="" decoding="async" />
              <video
                ref={videoRef}
                className="vm-video"
                src={armed ? VIDEO.src : undefined}
                poster={VIDEO.poster}
                muted
                loop
                playsInline
                preload="none"
                aria-hidden="true"
                tabIndex={-1}
              />
              <div className="vm-shade" aria-hidden="true" />

              {/* Финал: тот же ролик уже на первом экране сайта. */}
              <div className="vm-site" aria-hidden="true">
                <div className="vm-site-nav">
                  <span className="vm-site-brand">{t("video.mock.brand")}</span>
                  <span className="vm-site-links">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
                <div className="vm-site-body">
                  <p className="vm-site-headline">{t("video.mock.headline")}</p>
                  <span className="vm-site-btn">{t("video.mock.button")}</span>
                </div>
              </div>

              <span className="vm-thumb" aria-hidden="true">
                <img src={VIDEO.poster} alt="" />
                <b>poster.webp</b>
              </span>
            </div>

            {/* Интерфейс «монтажки» вокруг ролика: кнопки не кликаются, их нажимает сценарий. */}
            <div className="vm-topbar" aria-hidden="true">
              <span className="vm-dots">
                <i />
                <i />
                <i />
              </span>
              <span className="vm-file">{t("video.mock.url")}</span>
              <span className="vm-status">
                {STEPS.map((key, i) => (
                  <span key={key} className="vm-status-item" data-i={i + 1}>
                    {t("video.monitor.step")} {i + 1} {t("video.monitor.of")} {STEPS.length}: {t(`video.steps.${key}.title`).toLowerCase()}
                  </span>
                ))}
              </span>
            </div>

            <div className="vm-rail" aria-hidden="true">
              {STEPS.map((key) => (
                <span className="vm-btn" data-state="idle" key={key}>
                  <span className="vm-btn-led" />
                  {t(`video.steps.${key}.action`)}
                </span>
              ))}
            </div>

            <aside className="vm-path">
              <p className="vm-path-title">{t("video.monitor.title")}</p>
              <ol className="vm-path-list">
                {STEPS.map((key, i) => (
                  <li className="vm-path-item" data-state="idle" key={key}>
                    <span className="vm-path-n">{i + 1}</span>
                    <span className="vm-path-body">
                      <b>{t(`video.steps.${key}.title`)}</b>
                      <span className="vm-path-text">
                        <Words text={t(`video.steps.${key}.text`)} />
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </aside>

            <div className="vm-timeline" aria-hidden="true">
              <div className="vm-clip" style={{ "--poster": `url(${VIDEO.poster})` }}>
                <span className="vm-playhead" />
              </div>
              <span className="vm-chips">
                {t("video.monitor.chips").map((c) => (
                  <span className="vm-chip" key={c}>
                    {c}
                  </span>
                ))}
                <span className="vm-chip vm-chip-loop">{t("video.monitor.loop")}</span>
              </span>
            </div>

            <span className="vm-cursor" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M5 3l14 8.2-6.1 1.3 3.6 6.9-2.6 1.4-3.6-6.9L5 18z" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Телефоны, узкие окна и reduced-motion: постер и тот же короткий путь текстом. */
function StaticVersion() {
  return (
    <div className="vm-static">
      <FadeIn y={24}>
        <Intro className="vm-intro-static" />
      </FadeIn>
      <FadeIn y={30} delay={0.1} className="vm-static-frame">
        <img src={VIDEO.poster} alt={t("video.frameLabel")} width="1280" height="720" loading="lazy" decoding="async" />
      </FadeIn>
      <ol className="vm-static-steps">
        {STEPS.map((key, i) => (
          <li key={key}>
            <span className="vm-path-n">{i + 1}</span>
            <span className="vm-path-body">
              <b>{t(`video.steps.${key}.title`)}</b>
              <span>{t(`video.steps.${key}.text`)}</span>
            </span>
          </li>
        ))}
      </ol>
      <ContactButton href="#contact" label={t("video.cta")} />
    </div>
  );
}

export default function VideoSection() {
  const { reduced } = useMotionPreference();
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const scene = desktop && !reduced;

  return (
    <section className={`vm-section${scene ? " vm-section-scene" : ""}`} id="ai-video">
      <span className="section-number" aria-hidden="true">
        04
      </span>
      {scene ? <MonitorScene /> : <StaticVersion />}
      {scene && (
        <div className="vm-outro">
          <ContactButton href="#contact" label={t("video.cta")} />
        </div>
      )}
    </section>
  );
}
