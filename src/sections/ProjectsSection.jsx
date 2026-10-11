import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { shouldReduceMotion } from "../hooks/useMotionPreference.js";
import { t } from "../i18n/index.js";
import { play } from "../lib/sound.js";
import "./projects.css";

const MEDIA = `${import.meta.env.BASE_URL}media/`;

const LINKS = {
  quantix: "https://quantix-five.vercel.app/",
  altime: "https://max.ru/se13793521_bot",
};

// Настоящие результаты ALTIME: превью фотосессий из публичного каталога
// продукта, сгенерированные его же моделью.
const ALTIME_SHOTS = [
  { src: "old-money", label: "Old Money" },
  { src: "cyberpunk", label: "Cyberpunk" },
  { src: "royal", label: "Royal" },
  { src: "travel", label: "Travel" },
  { src: "galaxy-portrait", label: "Галактика" },
  { src: "yacht-deck", label: "Яхта" },
  { src: "private-jet", label: "Частный самолёт" },
];

// Раскладка веера: угол и сдвиг (в % размера карточки).
const FAN = [
  { r: -21, x: -262, y: 30 },
  { r: -14, x: -176, y: 10 },
  { r: -7, x: -88, y: 0 },
  { r: 0, x: 0, y: -6 },
  { r: 7, x: 88, y: 0 },
  { r: 14, x: 176, y: 10 },
  { r: 21, x: 262, y: 30 },
];

function Badge() {
  return (
    <span className="pj-badge">
      <span className="pj-badge-dot" aria-hidden="true" />
      {t("projects.personalBadge")}
    </span>
  );
}

function ProjectLink({ href, children, tone }) {
  return (
    <a className={`pj-link pj-link-${tone}`} href={href} target="_blank" rel="noopener noreferrer" data-cursor-label="↗">
      {children}
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </a>
  );
}

function Quantix() {
  const p = t("projects.quantix");
  return (
    <article className="pj pj-qx" data-project="quantix">
      <div className="pj-qx-stage">
        <div className="pj-qx-copy">
          <div className="pj-row">
            <span className="pj-num">01</span>
            <span className="pj-cat">{p.category}</span>
            <Badge />
          </div>
          <h3 className="pj-qx-title">QUANTIX</h3>
          <p className="pj-desc">{p.description}</p>
          <ol className="pj-qx-facts">
            {p.facts.map((f) => (
              <li key={f.k}>
                <b>{f.k}</b>
                <span>{f.v}</span>
              </li>
            ))}
          </ol>
          <ProjectLink href={LINKS.quantix} tone="blue">
            {p.cta}
          </ProjectLink>
        </div>

        <div className="pj-qx-browser" aria-hidden="true">
          <div className="pj-browser-bar">
            <span className="pj-browser-dots">
              <i />
              <i />
              <i />
            </span>
            <span className="pj-browser-url">quantix-five.vercel.app</span>
          </div>
          <div className="pj-browser-view">
            <img src={`${MEDIA}quantix/desktop-long.webp`} width="2850" height="7200" alt="" loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
    </article>
  );
}

function Altime() {
  const p = t("projects.altime");
  return (
    <article className="pj pj-alt" data-project="altime">
      <div className="pj-alt-stage">
        <div className="pj-alt-fan" aria-hidden="true">
          {ALTIME_SHOTS.map((s, i) => (
            <figure
              className="pj-alt-card"
              key={s.src}
              style={{ "--r": `${FAN[i].r}deg`, "--x": `${FAN[i].x}%`, "--y": `${FAN[i].y}%`, zIndex: 10 - Math.abs(i - 3) }}
            >
              <div className="pj-alt-inner">
                <img src={`${MEDIA}altime/shots/${s.src}.webp`} width="720" height="900" alt="" loading="lazy" decoding="async" />
                <figcaption>{s.label}</figcaption>
              </div>
            </figure>
          ))}
        </div>

        <div className="pj-alt-copy">
          <div className="pj-row pj-row-center">
            <span className="pj-num">02</span>
            <span className="pj-cat">{p.category}</span>
            <Badge />
          </div>
          <h3 className="pj-alt-title">
            ALTIME <span>AI</span>
          </h3>
          <p className="pj-desc">{p.description}</p>
          <dl className="pj-stats">
            {p.stats.map((s) => (
              <div key={s.l}>
                <dt>{s.v}</dt>
                <dd>{s.l}</dd>
              </div>
            ))}
          </dl>
          <ProjectLink href={LINKS.altime} tone="berry">
            {p.cta}
          </ProjectLink>
        </div>
      </div>
    </article>
  );
}

// Ролик, который собрал контент-завод: копия из истории, без звука, 720p.
const AUTOMATION_VIDEO = {
  src: `${MEDIA}automation/factory-output.mp4`,
  poster: `${MEDIA}automation/factory-output.webp`,
};

/** Видео грузится, только когда карточка рядом, и играет, только пока его видно. */
function OutputVideo() {
  const ref = useRef(null);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  // При reduced-motion наблюдатель не ставится: остаётся только постер.
  useEffect(() => {
    const video = ref.current;
    if (!video || shouldReduceMotion()) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setArmed(true);
      },
      { threshold: 0.35 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  // Старт после того, как src уже подставлен; вне экрана - пауза.
  useEffect(() => {
    const video = ref.current;
    if (!video || !armed) return;
    // play() может отклониться (энергосбережение) - тогда остаётся постер.
    if (visible) video.play()?.catch(() => {});
    else video.pause();
  }, [armed, visible]);

  return (
    <video
      ref={ref}
      className="pj-au-video"
      src={armed ? AUTOMATION_VIDEO.src : undefined}
      poster={AUTOMATION_VIDEO.poster}
      width="720"
      height="1280"
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

function Automation() {
  const p = t("projects.automation");
  return (
    <article className="pj pj-au" id="project-automation" data-project="automation">
      <div className="pj-au-copy">
        <div className="pj-row">
          <span className="pj-num">03</span>
          <span className="pj-cat">{p.category}</span>
          <Badge />
        </div>
        <h3 className="pj-au-title">{p.title}</h3>
        <p className="pj-desc">{p.description}</p>
        <ol className="pj-au-facts">
          {p.facts.map((f) => (
            <li key={f.k}>
              <b>{f.k}</b>
              <span>{f.v}</span>
            </li>
          ))}
        </ol>
        <p className="pj-note">{p.note}</p>
      </div>

      <figure className="pj-au-media">
        <div className="pj-au-frame">
          <OutputVideo />
        </div>
        <figcaption>{p.videoCaption}</figcaption>
      </figure>
    </article>
  );
}

export default function ProjectsSection() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ all: "all", desktop: "(min-width: 901px)", reduced: "(prefers-reduced-motion: reduce)" }, (ctx) => {
        if (!ctx.conditions.desktop || shouldReduceMotion(ctx.conditions.reduced)) return;
        const root = ref.current;
        const $ = (s) => root.querySelector(s);
        const $$ = (s) => [...root.querySelectorAll(s)];

        // Заголовок секции: две строки расходятся навстречу скроллу.
        gsap.fromTo(
          $(".pj-head-title"),
          { xPercent: 12 },
          { xPercent: -4, ease: "none", scrollTrigger: { trigger: $(".pj-head"), start: "top bottom", end: "bottom top", scrub: true } }
        );

        // ── QUANTIX: браузер ложится из наклона, страница внутри листается,
        // а вся сцена на время становится светлой, как сам продукт. ──
        const qx = $(".pj-qx");
        const qxImg = $(".pj-qx-browser img");
        const qxView = $(".pj-qx-browser .pj-browser-view");
        const qxTl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: qx, start: "top 85%", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true },
        });
        qxTl
          .fromTo(
            $(".pj-qx-browser"),
            { rotationX: 28, rotationY: -12, scale: 0.78, yPercent: 18, transformPerspective: 2200 },
            { rotationX: 0, rotationY: 0, scale: 1, yPercent: 0, duration: 1, ease: "power2.out" },
            0
          )
          .fromTo(qx, { "--qx-light": 0 }, { "--qx-light": 1, duration: 0.6 }, 0.55)
          .fromTo(qxImg, { y: 0 }, { y: () => -(qxImg.offsetHeight - qxView.offsetHeight), duration: 2.2 }, 1)
          .fromTo($(".pj-qx-title"), { xPercent: -8 }, { xPercent: 0, duration: 2.6 }, 0.4)
          .fromTo($$(".pj-qx-facts li"), { autoAlpha: 0.2, x: -24 }, { autoAlpha: 1, x: 0, stagger: 0.4, duration: 0.3 }, 1.2)
          .to(qx, { "--qx-light": 0, duration: 0.4 }, 3.25);

        // ── ALTIME: снимки влетают из глубины и собираются веером. ──
        const cards = $$(".pj-alt-card");
        const altTl = gsap.timeline({
          scrollTrigger: { trigger: $(".pj-alt"), start: "top 80%", end: "bottom bottom", scrub: 0.7 },
        });
        cards.forEach((card, i) => {
          const side = i - 3;
          altTl.fromTo(
            card,
            {
              xPercent: side * 190 + (side === 0 ? 0 : Math.sign(side) * 60),
              yPercent: 120 + Math.abs(side) * 30,
              rotation: side * 22,
              rotationY: side * -30,
              z: -600,
              autoAlpha: 0,
            },
            { xPercent: 0, yPercent: 0, rotation: 0, rotationY: 0, z: 0, autoAlpha: 1, duration: 1, ease: "power3.out" },
            Math.abs(side) * 0.08
          );
        });
        altTl
          .fromTo($(".pj-alt-fan"), { "--fan": 0 }, { "--fan": 1, duration: 1, ease: "power2.inOut" }, 0.6)
          .fromTo($(".pj-alt-title"), { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6 }, 0.9)
          // Веер собрался - тёплый аккорд (только при скролле вниз).
          .call(() => altTl.scrollTrigger?.direction === 1 && play("bloom"), null, 0.95)
          .fromTo($$(".pj-alt-copy > :not(.pj-alt-title)"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.5 }, 1.1)
          .to({}, { duration: 0.6 });

        // ── Автоматизация: вертикальный кадр поднимается и раскрывается снизу,
        // текст входит слева. ──
        const au = $(".pj-au");
        gsap.fromTo(
          $(".pj-au-frame"),
          { clipPath: "inset(100% 0 0 0 round 1.6rem)", yPercent: 14, rotation: 4 },
          {
            clipPath: "inset(0% 0 0 0 round 1.6rem)",
            yPercent: 0,
            rotation: 0,
            ease: "power3.out",
            scrollTrigger: { trigger: au, start: "top 75%", end: "top 20%", scrub: 0.6 },
          }
        );
        gsap.fromTo(
          $$(".pj-au-copy > *, .pj-au-facts li"),
          { autoAlpha: 0, x: -40 },
          { autoAlpha: 1, x: 0, stagger: 0.07, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: au, start: "top 70%" } }
        );
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [] }
  );

  return (
    <section ref={ref} className="pj-section" id="projects">
      <span className="section-number" aria-hidden="true">
        06
      </span>
      <header className="pj-head">
        <p className="section-eyebrow">{t("projects.eyebrow")}</p>
        <h2 className="pj-head-title">{t("projects.heading")}</h2>
      </header>

      <Quantix />
      <Altime />
      <Automation />
    </section>
  );
}
