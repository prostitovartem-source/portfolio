import { useCallback, useEffect, useRef, useState } from "react";
import FadeIn from "../components/FadeIn.jsx";
import ContactButton from "../components/ContactButton.jsx";
import useMotionPreference from "../hooks/useMotionPreference.js";
import { t } from "../i18n/index.js";
import "./video.css";

const MEDIA = `${import.meta.env.BASE_URL}media/video/`;
const DESKTOP = { src: `${MEDIA}ai-hero-desktop.mp4`, poster: `${MEDIA}ai-hero-desktop.webp` };
const MOBILE = { src: `${MEDIA}ai-hero-mobile.mp4`, poster: `${MEDIA}ai-hero-mobile.webp` };

const STEPS = ["frame", "motion", "process", "site"];
const STATS = ["size", "versions", "sound"];
const MODES = ["off", "on"];

// Время кроссфейда в CSS (.vid-layer-video): паузу ставим после него,
// чтобы ролик не замирал на полуслове, пока ещё виден.
const FADE_MS = 700;

/** Видео, которое играет только пока active=true; src подставляется лениво. */
function LoopVideo({ asset, active, armed, className }) {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || !armed) return;

    if (active) {
      // play() может отклониться (энергосбережение, политика автозапуска) —
      // это не ошибка: остаётся постер.
      video.play()?.catch(() => {});
      return;
    }
    const id = setTimeout(() => video.pause(), FADE_MS);
    return () => clearTimeout(id);
  }, [active, armed]);

  return (
    <video
      ref={ref}
      className={className}
      src={armed ? asset.src : undefined}
      poster={asset.poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

export default function VideoSection() {
  const { reduced } = useMotionPreference();
  const [mode, setMode] = useState("on");
  const [inView, setInView] = useState(false);
  const [armed, setArmed] = useState(false);
  const stageRef = useRef(null);
  const radioRefs = useRef({});

  // Старт/пауза по видимости рамки. Файлы начинают грузиться только когда
  // секция подъезжает к экрану, а не при открытии страницы.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || reduced) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setArmed(true);
      },
      { threshold: 0.25, rootMargin: "200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  const playing = !reduced && inView && mode === "on";
  // При reduced-motion показываем только постер, переключатель не нужен.
  const showVideo = !reduced && mode === "on";

  // Клавиатура для radiogroup: стрелки перемещают и выбирают, tabindex плавающий.
  const onKeyDown = useCallback((e) => {
    const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const next = e.key === "ArrowLeft" || e.key === "ArrowUp" ? "off" : "on";
    setMode(next);
    radioRefs.current[next]?.focus();
  }, []);

  return (
    <section className="vid-section" id="ai-video">
      <span className="section-number" aria-hidden="true">
        04
      </span>

      <div className="vid-inner">
        <header className="vid-head">
          <FadeIn delay={0} y={20} className="section-eyebrow">
            {t("video.eyebrow")}
          </FadeIn>

          <FadeIn delay={0.12} y={30}>
            <h2 className="hero-heading vid-heading">
              {t("video.headingLine1")}
              <br />
              {t("video.headingLine2")}
            </h2>
          </FadeIn>

          <FadeIn delay={0.25} y={20}>
            <p className="vid-text">{t("video.text")}</p>
          </FadeIn>
        </header>

        {!reduced && (
          <FadeIn delay={0.3} y={16} className="vid-toggle-wrap">
            <div
              className="vid-toggle"
              role="radiogroup"
              aria-label={t("video.toggleLabel")}
              onKeyDown={onKeyDown}
            >
              {MODES.map((m) => (
                <button
                  key={m}
                  ref={(node) => {
                    radioRefs.current[m] = node;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={mode === m}
                  tabIndex={mode === m ? 0 : -1}
                  className={`vid-toggle-btn${mode === m ? " is-active" : ""}`}
                  onClick={() => setMode(m)}
                >
                  {t(m === "on" ? "video.toggleOn" : "video.toggleOff")}
                </button>
              ))}
            </div>
          </FadeIn>
        )}

        <FadeIn delay={0.35} y={40} className="vid-stage-fade">
          <div className="vid-stage" ref={stageRef} role="img" aria-label={t("video.frameLabel")}>
            <div className="vid-browser">
              <div className="vid-browser-bar" aria-hidden="true">
                <span className="vid-dot" />
                <span className="vid-dot" />
                <span className="vid-dot" />
                <span className="vid-url">{t("video.mock.url")}</span>
              </div>

              <div className="vid-hero">
                <img className="vid-layer" src={DESKTOP.poster} alt="" />
                <div className={`vid-layer vid-layer-video${showVideo ? " is-on" : ""}`}>
                  <LoopVideo asset={DESKTOP} active={playing} armed={armed} className="vid-media" />
                </div>
                <div className="vid-shade" aria-hidden="true" />

                <div className="vid-mock" aria-hidden="true">
                  <div className="vid-mock-nav">
                    <span className="vid-mock-brand">{t("video.mock.brand")}</span>
                    <span className="vid-mock-links">
                      <i />
                      <i />
                      <i />
                    </span>
                  </div>
                  <div className="vid-mock-body">
                    <p className="vid-mock-headline">{t("video.mock.headline")}</p>
                    <span className="vid-mock-btn">{t("video.mock.button")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="vid-phone" aria-hidden="true">
              <span className="vid-phone-notch" />
              <div className="vid-phone-screen">
                <img className="vid-layer" src={MOBILE.poster} alt="" />
                <div className={`vid-layer vid-layer-video${showVideo ? " is-on" : ""}`}>
                  <LoopVideo asset={MOBILE} active={playing} armed={armed} className="vid-media" />
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        <ol className="vid-steps">
          {STEPS.map((key, i) => (
            <li className="vid-step-item" key={key}>
              <FadeIn delay={0.1 + i * 0.09} y={16} className="vid-step">
                <span className="vid-step-index">{String(i + 1).padStart(2, "0")}</span>
                <span className="vid-step-title">{t(`video.steps.${key}.title`)}</span>
                <span className="vid-step-text">{t(`video.steps.${key}.text`)}</span>
              </FadeIn>
              {i < STEPS.length - 1 && (
                <span className="vid-step-arrow" aria-hidden="true">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>

        <ul className="vid-stats">
          {STATS.map((key, i) => (
            <li key={key}>
              <FadeIn delay={i * 0.1} y={30} className="vid-stat">
                <span className="vid-stat-value">{t(`video.stats.${key}.value`)}</span>
                <span className="vid-stat-label">{t(`video.stats.${key}.label`)}</span>
              </FadeIn>
            </li>
          ))}
        </ul>

        <FadeIn delay={0.1} y={20} className="vid-cta">
          <ContactButton href="#contact" label={t("video.cta")} />
        </FadeIn>
      </div>
    </section>
  );
}
