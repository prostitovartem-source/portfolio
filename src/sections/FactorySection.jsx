import { useEffect, useRef, useState } from "react";
import FadeIn from "../components/FadeIn.jsx";
import ContactButton from "../components/ContactButton.jsx";
import useMotionPreference from "../hooks/useMotionPreference.js";
import { t } from "../i18n/index.js";
import "./factory.css";

const MEDIA = import.meta.env.BASE_URL;
const VIDEO = {
  src: `${MEDIA}media/video/ai-hero-mobile.mp4`,
  poster: `${MEDIA}media/video/ai-hero-mobile.webp`,
};
const SHOTS = [
  { key: "create", src: `${MEDIA}media/factory/create.webp`, w: 1280, h: 800, url: "localhost:3000" },
  { key: "history", src: `${MEDIA}media/factory/history.webp`, w: 1280, h: 570, url: "localhost:3000/#/history" },
];

export default function FactorySection() {
  const { reduced } = useMotionPreference();
  const [armed, setArmed] = useState(false);
  const phoneRef = useRef(null);
  const videoRef = useRef(null);

  // Файл начинает грузиться, только когда телефон подъезжает к экрану;
  // вне экрана видео стоит на паузе. При reduced-motion остаётся постер.
  useEffect(() => {
    const el = phoneRef.current;
    if (!el || reduced) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (entry.isIntersecting) {
          setArmed(true);
          // play() может отклониться (энергосбережение) - тогда виден постер.
          video?.play()?.catch(() => {});
        } else {
          video?.pause();
        }
      },
      { threshold: 0.25, rootMargin: "200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  // Видео подставляется после armed: сразу играем, как только появился src.
  useEffect(() => {
    if (armed && !reduced) videoRef.current?.play()?.catch(() => {});
  }, [armed, reduced]);

  return (
    <section className="fac-section" id="content-factory">
      <span className="section-number" aria-hidden="true">
        04
      </span>

      <div className="fac-inner">
        <header className="fac-head">
          <FadeIn delay={0} y={20} className="section-eyebrow">
            {t("factory.eyebrow")}
          </FadeIn>

          <FadeIn delay={0.12} y={30}>
            <h2 className="hero-heading fac-heading">
              {t("factory.headingLine1")}
              <br />
              {t("factory.headingLine2")}
            </h2>
          </FadeIn>

          <FadeIn delay={0.25} y={20}>
            <p className="fac-text">{t("factory.text")}</p>
          </FadeIn>
        </header>

        <div className="fac-stage">
          <FadeIn delay={0.3} y={40} className="fac-shots-fade">
            <div className="fac-shots" role="group" aria-label={t("factory.shotsLabel")}>
              {SHOTS.map((shot) => (
                <figure className="fac-browser" key={shot.key}>
                  <div className="fac-browser-bar" aria-hidden="true">
                    <span className="fac-dot" />
                    <span className="fac-dot" />
                    <span className="fac-dot" />
                    <span className="fac-url">{shot.url}</span>
                  </div>
                  <img
                    src={shot.src}
                    width={shot.w}
                    height={shot.h}
                    alt={t(`factory.shots.${shot.key}`)}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.4} y={40} className="fac-phone-fade">
            <div className="fac-phone" ref={phoneRef} role="img" aria-label={t("factory.phoneLabel")}>
              <span className="fac-phone-notch" aria-hidden="true" />
              <div className="fac-phone-screen">
                <video
                  ref={videoRef}
                  src={armed && !reduced ? VIDEO.src : undefined}
                  poster={VIDEO.poster}
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-hidden="true"
                  tabIndex={-1}
                />
              </div>
            </div>
          </FadeIn>
        </div>

        <ul className="fac-features">
          {t("factory.features").map((label, i) => (
            <li key={label}>
              <FadeIn delay={i * 0.08} y={20} className="fac-feature">
                <span className="fac-feature-index">{String(i + 1).padStart(2, "0")}</span>
                <span className="fac-feature-label">{label}</span>
              </FadeIn>
            </li>
          ))}
        </ul>

        <FadeIn delay={0.1} y={20} className="fac-cta">
          <span className="fac-note">{t("factory.note")}</span>
          <ContactButton href="#contact" label={t("factory.cta")} />
        </FadeIn>
      </div>
    </section>
  );
}
