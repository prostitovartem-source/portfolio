import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { shouldReduceMotion } from "../hooks/useMotionPreference.js";
import { t } from "../i18n/index.js";
import "./projects.css";

const MEDIA = `${import.meta.env.BASE_URL}media/`;

const LINKS = {
  quantix: "https://quantix-five.vercel.app/",
  altime: "https://max.ru/se13793521_bot",
  zfinde: "https://zfinde.vercel.app/",
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

function Zfinde() {
  const p = t("projects.zfinde");
  return (
    <article className="pj pj-zf" data-project="zfinde">
      <div className="pj-zf-copy">
        <div className="pj-row">
          <span className="pj-num">03</span>
          <span className="pj-cat">{p.category}</span>
          <Badge />
        </div>
        <h3 className="pj-zf-title">ZFINDE</h3>
        <p className="pj-desc">{p.description}</p>
        <dl className="pj-stats pj-zf-stats">
          {p.stats.map((s) => (
            <div key={s.l}>
              <dt data-count={s.v}>{s.v}</dt>
              <dd>{s.l}</dd>
            </div>
          ))}
        </dl>
        <p className="pj-note">{p.note}</p>
        <ProjectLink href={LINKS.zfinde} tone="amber">
          {p.cta}
        </ProjectLink>
      </div>

      <div className="pj-zf-window" aria-hidden="true">
        <div className="pj-browser-bar pj-browser-bar-dark">
          <span className="pj-browser-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="pj-browser-url">zfinde.vercel.app</span>
        </div>
        <div className="pj-browser-view pj-zf-view">
          <img src={`${MEDIA}zfinde/desktop-results-long.webp`} width="2850" height="4452" alt="" loading="lazy" decoding="async" />
        </div>
      </div>
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
          .fromTo($$(".pj-alt-copy > :not(.pj-alt-title)"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.5 }, 1.1)
          .to({}, { duration: 0.6 });

        // ── ZFINDE: окно раскрывается справа, результаты едут внутри,
        // цифры досчитываются до настоящих значений поиска. ──
        const zf = $(".pj-zf");
        gsap.fromTo(
          $(".pj-zf-window"),
          { clipPath: "inset(0 0 0 100% round 1.2rem)", xPercent: 12 },
          {
            clipPath: "inset(0 0 0 0% round 1.2rem)",
            xPercent: 0,
            ease: "power3.out",
            scrollTrigger: { trigger: zf, start: "top 75%", end: "top 25%", scrub: 0.6 },
          }
        );
        const zfImg = $(".pj-zf-view img");
        const zfView = $(".pj-zf-view");
        gsap.fromTo(
          zfImg,
          { y: 0 },
          {
            y: () => -(zfImg.offsetHeight - zfView.offsetHeight),
            ease: "none",
            scrollTrigger: { trigger: zf, start: "top 40%", end: "bottom top", scrub: 0.6, invalidateOnRefresh: true },
          }
        );
        gsap.fromTo(
          $$(".pj-zf-copy > *"),
          { autoAlpha: 0, x: -40 },
          { autoAlpha: 1, x: 0, stagger: 0.07, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: zf, start: "top 70%" } }
        );
        $$(".pj-zf-stats dt").forEach((el) => {
          const target = Number(el.dataset.count);
          if (!Number.isFinite(target)) return;
          const o = { v: 0 };
          gsap.to(o, {
            v: target,
            duration: 1.4,
            ease: "power2.out",
            onUpdate: () => (el.textContent = Math.round(o.v)),
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [] }
  );

  return (
    <section ref={ref} className="pj-section" id="projects">
      <span className="section-number" aria-hidden="true">
        05
      </span>
      <header className="pj-head">
        <p className="section-eyebrow">{t("projects.eyebrow")}</p>
        <h2 className="pj-head-title">{t("projects.heading")}</h2>
      </header>

      <Quantix />
      <Altime />
      <Zfinde />
    </section>
  );
}
