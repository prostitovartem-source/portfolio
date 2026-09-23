import { lazy, Suspense, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { shouldReduceMotion } from "../../hooks/useMotionPreference.js";
import { t } from "../../i18n/index.js";
import Phone, { StatusBar } from "./Phone.jsx";
import LiveScreen from "./LiveScreens.jsx";
import { CHAPTERS, SCREENS } from "./data.js";
import "./showcase.css";
import "./live-screens.css";

// Three.js - тяжёлый кусок, общий чанк с 3D в hero; грузится только
// на десктопе с включёнными анимациями.
const Phone3D = lazy(() => import("./Phone3D.jsx"));

const pad = (n) => String(n).padStart(2, "0");

function Screen({ screen, eager }) {
  return (
    <div className={`sc-screen ${screen.light ? "sc-screen-light" : ""}`} data-screen={screen.index}>
      <StatusBar />
      <div className="sc-viewport">
        {screen.kind ? (
          <LiveScreen kind={screen.kind} />
        ) : (
          <img
            className="sc-shot"
            src={screen.src}
            width={screen.w}
            height={screen.h}
            alt=""
            decoding="async"
            loading={eager ? "eager" : "lazy"}
            draggable="false"
          />
        )}
        {screen.bars && (
          <>
            <span
              className="sc-bar sc-bar-top"
              style={{ backgroundImage: `url(${screen.bars.src})`, height: `${screen.bars.top * 100}%` }}
            />
            <span
              className="sc-bar sc-bar-bottom"
              style={{ backgroundImage: `url(${screen.bars.src})`, height: `${screen.bars.bottom * 100}%` }}
            />
          </>
        )}
      </div>
    </div>
  );
}

function ChapterLink({ chapter, className }) {
  const external = !chapter.link.startsWith("#");
  return (
    <a
      className={className}
      href={chapter.link}
      {...(external ? { target: "_blank", rel: "noreferrer", "data-cursor-label": "↗" } : {})}
    >
      <span className="sc-cta-dot" aria-hidden="true" />
      {chapter.cta}
    </a>
  );
}

function Meta({ chapter, className = "" }) {
  const labels = t("showcase.labels");
  return (
    <div className={`sc-meta ${className}`}>
      <div className="sc-meta-col">
        <span className="sc-meta-label">{labels.built}</span>
        <ul className="sc-built">
          {chapter.built.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>
      <div className="sc-meta-col">
        <span className="sc-meta-label">{labels.stack}</span>
        <ul className="sc-stack">
          {chapter.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Kicker({ chapter, index, className = "" }) {
  return (
    <p className={`sc-kicker ${className}`}>
      <span className="sc-kicker-index">{pad(index + 1)}</span>
      {t("showcase.labels.proof")} {chapter.proof}
    </p>
  );
}

function ChapterCopy({ chapter, index }) {
  const labels = t("showcase.labels");
  return (
    <div className={`sc-copy sc-copy-${chapter.side === "right" ? "left" : "right"}`} data-chapter={chapter.id}>
      <Kicker chapter={chapter} index={index} className="sc-in" />
      <h3 className="sc-name" aria-label={chapter.title}>
        {chapter.title.split(" ").map((word, w) => (
          <span className="sc-word" key={w} aria-hidden="true">
            {[...word].map((ch, i) => (
              <span className="sc-char-mask" key={i}>
                <span className="sc-char">{ch}</span>
              </span>
            ))}
          </span>
        ))}
      </h3>
      <p className="sc-lead sc-in">{chapter.lead}</p>

      <div className="sc-caps sc-in">
        {chapter.screens.map((s, i) => (
          <p className="sc-cap" key={s.index} data-cap={s.index}>
            <span className="sc-cap-step">
              {labels.step} {pad(i + 1)} / {pad(chapter.screens.length)}
            </span>
            {chapter.steps[i]}
          </p>
        ))}
      </div>

      <Meta chapter={chapter} className="sc-in" />
      <ChapterLink chapter={chapter} className="sc-cta sc-in" />
    </div>
  );
}

/** Статичная версия: мобильные экраны и режим без анимаций. */
function StaticShowcase() {
  return (
    <div className="sc-static">
      <header className="sc-static-head">
        <p className="section-eyebrow">{t("showcase.eyebrow")}</p>
        <h2 className="sc-heading">
          <span>{t("showcase.headingLine1")}</span>
          <span>{t("showcase.headingLine2")}</span>
        </h2>
        <p className="sc-sub">{t("showcase.sub")}</p>
      </header>
      {CHAPTERS.map((ch, ci) => (
        <article className="sc-static-chapter" key={ch.id} style={{ "--sc-accent": ch.accent }}>
          <Kicker chapter={ch} index={ci} />
          <h3 className="sc-static-name">{ch.title}</h3>
          <p className="sc-lead">{ch.lead}</p>
          <div className="sc-static-phones">
            {ch.screens.map((s, i) => (
              <figure className="sc-static-shot" key={s.index}>
                <Phone className="sc-phone-static">
                  <div className="sc-screens">
                    <Screen screen={s} />
                  </div>
                </Phone>
                <figcaption>{ch.steps[i]}</figcaption>
              </figure>
            ))}
          </div>
          <Meta chapter={ch} />
          <ChapterLink chapter={ch} className="sc-cta" />
        </article>
      ))}
    </div>
  );
}

/**
 * Анимация живых экранов на отрезке [at, at + dwell]: у каждого своя
 * «запись» - сообщения бота, прохождение сигнала по цепочке, генерация.
 */
const LIVE_ANIMATORS = {
  chat(tl, el, at, dwell, tapAt) {
    const beats = [...el.querySelectorAll(".lv-beat")];
    gsap.set(beats, { autoAlpha: 0, y: 14 });
    const step = dwell / (beats.length + 1);
    beats.forEach((b, i) => {
      tl.to(b, { autoAlpha: 1, y: 0, duration: 0.2, ease: "power2.out" }, at + step * i);
    });
    // Нажатие «Проверить подписку» перед ответом бота.
    tapAt(el.querySelector("[data-tap='check']"), at + step * 2.55);
  },
  flow(tl, el, at, dwell) {
    const nodes = [...el.querySelectorAll(".lv-node[data-node]")];
    const packets = [...el.querySelectorAll(".lv-flow-packet")];
    gsap.set(nodes, { "--on": 0 });
    gsap.set(packets, { top: "0%", autoAlpha: 0 });
    const main = nodes.filter((n) => n.dataset.node !== "cron");
    const step = dwell / (main.length + 1.2);
    tl.to(main[0], { "--on": 1, duration: 0.18 }, at + 0.05);
    packets.forEach((p, i) => {
      const t0 = at + step * (i + 0.6);
      tl.set(p, { autoAlpha: 1 }, t0);
      tl.to(p, { top: "100%", duration: step * 0.7, ease: "none" }, t0);
      tl.set(p, { autoAlpha: 0 }, t0 + step * 0.7);
      tl.to(main[i + 1], { "--on": 1, duration: 0.18 }, t0 + step * 0.65);
    });
    const cron = nodes.find((n) => n.dataset.node === "cron");
    if (cron) tl.to(cron, { "--on": 1, duration: 0.25 }, at + dwell - 0.3);
  },
  run(tl, el, at, dwell) {
    const beats = [...el.querySelectorAll(".lv-beat")];
    gsap.set(beats, { autoAlpha: 0, x: -12 });
    tl.to(beats, { autoAlpha: 1, x: 0, duration: 0.18, stagger: dwell / (beats.length + 1), ease: "power2.out" }, at);
  },
  aigen(tl, el, at, dwell) {
    const [input, progress, result, more, note] = el.querySelectorAll(".lv-beat");
    const fill = el.querySelector(".lv-ai-bar-fill");
    const steps = [...el.querySelectorAll(".lv-ai-steps i")];
    gsap.set([input, progress, more, note], { autoAlpha: 0, y: 12 });
    gsap.set(result, { clipPath: "inset(0% 0% 100% 0% round 1em)" });
    gsap.set(fill, { scaleX: 0 });
    gsap.set(steps, { opacity: 0.35 });
    tl.to(input, { autoAlpha: 1, y: 0, duration: 0.2 }, at);
    tl.to(progress, { autoAlpha: 1, y: 0, duration: 0.2 }, at + 0.15);
    tl.to(fill, { scaleX: 1, duration: dwell * 0.45, ease: "power1.inOut" }, at + 0.25);
    steps.forEach((s, i) => tl.to(s, { opacity: 1, duration: 0.1 }, at + 0.25 + dwell * 0.15 * (i + 1)));
    tl.to(result, { clipPath: "inset(0% 0% 0% 0% round 1em)", duration: 0.45, ease: "power2.out" }, at + 0.3 + dwell * 0.45);
    tl.to([more, note], { autoAlpha: 1, y: 0, duration: 0.2, stagger: 0.12 }, at + 0.55 + dwell * 0.5);
  },
  ocr(tl, el, at, dwell) {
    const scan = el.querySelector(".lv-ocr-scan");
    const beats = [...el.querySelectorAll(".lv-beat")];
    gsap.set(scan, { top: "0%", autoAlpha: 1 });
    gsap.set(beats, { autoAlpha: 0, x: 14 });
    tl.to(scan, { top: "100%", duration: dwell * 0.55, ease: "none" }, at);
    tl.to(scan, { autoAlpha: 0, duration: 0.1 }, at + dwell * 0.55);
    tl.to(beats, { autoAlpha: 1, x: 0, duration: 0.18, stagger: (dwell * 0.6) / beats.length }, at + dwell * 0.25);
  },
};

export default function ShowcaseSection() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const phoneRef = useRef(null);
  const slotRef = useRef(null);
  const [use3d, setUse3d] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        { all: "all", desktop: "(min-width: 901px)", reduced: "(prefers-reduced-motion: reduce)" },
        (context) => {
          if (!context.conditions.desktop || shouldReduceMotion(context.conditions.reduced)) return;

          const stage = stageRef.current;
          const phone = phoneRef.current;
          const q = (sel) => [...stage.querySelectorAll(sel)];
          const screens = q(".sc-screens > .sc-screen");
          const copies = q(".sc-copy");
          const marks = q(".sc-mark");
          const glows = q(".sc-glow");
          const decors = q(".sc-decor");
          const tap = stage.querySelector(".sc-tap");
          const taplayer = stage.querySelector(".sc-taplayer");
          const intro = stage.querySelector(".sc-intro");
          const railItems = q(".sc-rail-item");
          const railFill = stage.querySelector(".sc-rail-fill");
          const chapterIndex = (id) => CHAPTERS.findIndex((c) => c.id === id);

          // Куда встаёт телефон: противоположно тексту главы. В vw, а не в px,
          // чтобы на 1440 и на 4K композиция держала одни и те же пропорции.
          const sideX = (ch) => () => (CHAPTERS[ch].side === "right" ? 1 : -1) * window.innerWidth * 0.2;
          const facing = (ch) => (CHAPTERS[ch].side === "right" ? -9 : 9);

          // Чистый старт: при повторной сборке (StrictMode, смена брейкпоинта)
          // GSAP иначе прочитает оставшийся inline-transform как смещение в px.
          gsap.set(
            [phone, ...screens, ...q(".sc-char"), ...q(".sc-in"), ...q(".sc-cap"), ...q(".sc-shot"), ...marks, ...q(".sc-mark span"), ...glows, ...decors],
            { clearProps: "transform,opacity,visibility,filter" }
          );
          gsap.set(screens, { autoAlpha: 0, xPercent: 0, scale: 1 });
          gsap.set(screens[0], { autoAlpha: 1 });
          gsap.set(copies, { autoAlpha: 0 });
          gsap.set(q(".sc-char"), { yPercent: 115 });
          gsap.set(q(".sc-cap"), { autoAlpha: 0, y: 14 });
          gsap.set(marks, { autoAlpha: 0, xPercent: 6 });
          gsap.set(glows, { autoAlpha: 0, scale: 0.8 });
          gsap.set(decors, { autoAlpha: 0 });
          gsap.set(tap, { autoAlpha: 0 });
          gsap.set(phone, {
            x: sideX(0),
            y: () => window.innerHeight * 0.8,
            rotationX: 42,
            rotationY: -18,
            rotationZ: -11,
            scale: 0.72,
            transformPerspective: 2400,
          });

          const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
          const ranges = [];

          // «Палец»: по процентам экрана или по реальному положению элемента
          // внутри живого экрана (считается при каждом refresh).
          function tapAt(target, at) {
            if (!target) return;
            const isEl = typeof target.getBoundingClientRect === "function";
            const pos = (axis) => () => {
              if (!isEl) return `${target[axis]}%`;
              const r = target.getBoundingClientRect();
              const l = taplayer.getBoundingClientRect();
              return axis === "x"
                ? `${((r.left + r.width / 2 - l.left) / l.width) * 100}%`
                : `${((r.top + r.height / 2 - l.top) / l.height) * 100}%`;
            };
            tl.set(tap, { left: pos("x"), top: pos("y") }, at);
            tl.fromTo(tap, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.14, ease: "power2.out" }, at);
            tl.to(tap, { autoAlpha: 0, scale: 1.7, duration: 0.22, ease: "power1.out" }, at + 0.16);
          }

          function enterCopy(ch, at, mode) {
            const el = copies[ch];
            tl.set(el, { autoAlpha: 1 }, at);
            const rise = mode === "rise";
            tl.fromTo(
              el.querySelectorAll(".sc-char"),
              { yPercent: 115, rotate: rise ? 0 : 6 },
              { yPercent: 0, rotate: 0, duration: 0.55, stagger: 0.022, ease: "power4.out" },
              at
            );
            const from = rise ? { autoAlpha: 0, y: 40, x: 0 } : { autoAlpha: 0, x: mode * 48, y: 0 };
            tl.fromTo(
              el.querySelectorAll(".sc-in"),
              from,
              { autoAlpha: 1, x: 0, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out" },
              at + 0.12
            );
          }

          function exitCopy(ch, at) {
            const el = copies[ch];
            tl.to(el.querySelectorAll(".sc-char"), { yPercent: -115, duration: 0.35, stagger: 0.012, ease: "power2.in" }, at);
            tl.to(el.querySelectorAll(".sc-in"), { autoAlpha: 0, y: -24, duration: 0.3, stagger: 0.03, ease: "power2.in" }, at);
            tl.set(el, { autoAlpha: 0 }, at + 0.5);
          }

          function swapCaption(from, to, at) {
            const out = stage.querySelector(`.sc-cap[data-cap="${from}"]`);
            const inn = stage.querySelector(`.sc-cap[data-cap="${to}"]`);
            if (out) tl.to(out, { autoAlpha: 0, y: -14, duration: 0.2, ease: "power2.in" }, at);
            if (inn) tl.to(inn, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, at + 0.2);
          }

          const decorOf = (ch) => decors.find((d) => d.dataset.chapter === CHAPTERS[ch].id);

          function showBackdrop(ch, at) {
            tl.to(glows[ch], { autoAlpha: 1, scale: 1, duration: 0.8 }, at);
            const d = decorOf(ch);
            if (d) tl.fromTo(d, { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 0.9 }, at);
          }

          function hideBackdrop(ch, at, dir) {
            tl.to(marks[ch], { autoAlpha: 0, xPercent: -10 * dir, duration: 0.4, ease: "power2.in" }, at);
            tl.to(glows[ch], { autoAlpha: 0, scale: 0.7, duration: 0.7 }, at);
            const d = decorOf(ch);
            if (d) tl.to(d, { autoAlpha: 0, duration: 0.5 }, at);
          }

          /**
           * Вход телефона в главу - у каждой главы свой жест:
           * swing - разворот по Y при переезде, roll - перекат через наклон
           * назад, spin - поворот в плоскости, dive - остаётся на месте и
           * «ныряет» к зрителю.
           */
          function movePhone(to, at) {
            const dir = CHAPTERS[to].side === "right" ? 1 : -1;
            const x = sideX(to);
            const face = facing(to);
            switch (CHAPTERS[to].enter) {
              case "roll":
                tl.to(phone, { x, duration: 1.2, ease: "power3.inOut" }, at + 0.1);
                tl.to(
                  phone,
                  { rotationX: 34, rotationZ: dir * 7, y: () => -window.innerHeight * 0.05, scale: 0.86, duration: 0.6, ease: "power2.in" },
                  at + 0.1
                );
                tl.to(phone, { rotationX: 0, rotationZ: 0, rotationY: face, y: 0, scale: 1, duration: 0.6, ease: "power2.out" }, at + 0.7);
                break;
              case "spin":
                tl.to(phone, { x, duration: 1.2, ease: "power3.inOut" }, at + 0.1);
                tl.to(phone, { rotationZ: -dir * 16, rotationY: 0, scale: 0.82, duration: 0.6, ease: "power2.in" }, at + 0.1);
                tl.to(phone, { rotationZ: 0, rotationY: face, scale: 1, duration: 0.6, ease: "back.out(1.4)" }, at + 0.7);
                break;
              case "dive":
                tl.to(phone, { scale: 1.16, rotationY: 0, rotationX: -6, duration: 0.6, ease: "power2.in" }, at + 0.1);
                tl.to(phone, { scale: 1, rotationY: face, rotationX: 0, duration: 0.7, ease: "power3.out" }, at + 0.7);
                break;
              default:
                tl.to(phone, { x, duration: 1.2, ease: "power3.inOut" }, at + 0.1);
                tl.to(phone, { rotationY: dir * 26, scale: 0.88, duration: 0.6, ease: "power2.in" }, at + 0.1);
                tl.to(phone, { rotationY: face, scale: 1, duration: 0.6, ease: "power2.out" }, at + 0.7);
            }
          }

          // ── Интро: заголовок уходит вверх, телефон «встаёт» из-под него ──
          tl.to(intro, { yPercent: -60, autoAlpha: 0, filter: "blur(10px)", duration: 0.8, ease: "power2.in" }, 0.25);
          tl.to(
            phone,
            { y: 0, rotationX: 0, rotationY: facing(0), rotationZ: 0, scale: 1, duration: 1.3, ease: "power3.out" },
            0.1
          );
          showBackdrop(0, 0.4);
          tl.to(marks[0], { autoAlpha: 1, duration: 0.8 }, 0.6);
          enterCopy(0, 0.95, -1);
          tl.to(stage.querySelector('.sc-cap[data-cap="0"]'), { autoAlpha: 1, y: 0, duration: 0.3 }, 1.25);

          let at = 1.5;

          SCREENS.forEach((scr, i) => {
            const el = screens[i];
            const start = at;
            const dwell = scr.kind ? 1.7 : scr.long ? 1.8 : 0.8;

            if (scr.long) {
              const shot = el.querySelector(".sc-shot");
              const viewport = el.querySelector(".sc-viewport");
              tl.to(shot, { y: () => -(shot.offsetHeight - viewport.offsetHeight), duration: dwell, ease: "none" }, at + 0.05);
            }
            if (scr.kind && LIVE_ANIMATORS[scr.kind]) {
              LIVE_ANIMATORS[scr.kind](tl, el, at, dwell, tapAt);
            }
            // Живой микронаклон корпуса, пока экран на месте.
            tl.to(phone, { rotationZ: i % 2 ? 1.2 : -1.2, duration: dwell, ease: "sine.inOut" }, at);
            at += dwell;

            const next = SCREENS[i + 1];
            if (!next) {
              ranges.push([start, at + 0.4, i]);
              at += 0.4;
              return;
            }

            if (next.chapter === scr.chapter) {
              if (scr.tap) tapAt(scr.tap.sel ? el.querySelector(scr.tap.sel) : scr.tap, at);
              if (scr.swap === "fade") {
                // Живые экраны сменяются растворением: это не навигация
                // внутри приложения, а следующий кадр той же истории.
                tl.fromTo(screens[i + 1], { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "power2.out" }, at + 0.15);
                tl.to(el, { autoAlpha: 0, scale: 0.96, duration: 0.35 }, at + 0.1);
              } else {
                // Тап + переход «push», как в iOS.
                tl.fromTo(screens[i + 1], { autoAlpha: 1, xPercent: 100 }, { xPercent: 0, duration: 0.5, ease: "power3.inOut" }, at + 0.2);
                tl.to(el, { xPercent: -28, opacity: 0.25, duration: 0.5, ease: "power3.inOut" }, at + 0.2);
                tl.set(el, { autoAlpha: 0 }, at + 0.72);
              }
              swapCaption(i, i + 1, at + 0.1);
              ranges.push([start, at + 0.45, i]);
              at += 0.8;
            } else {
              const from = chapterIndex(scr.chapter);
              const to = chapterIndex(next.chapter);
              const same = CHAPTERS[to].side === CHAPTERS[from].side;
              const dir = CHAPTERS[to].side === "right" ? 1 : -1;
              exitCopy(from, at);
              hideBackdrop(from, at, dir);
              movePhone(to, at);

              if (CHAPTERS[to].enter === "dive") {
                tl.to(el, { autoAlpha: 0, filter: "blur(12px)", scale: 1.08, duration: 0.35 }, at + 0.3);
                tl.fromTo(
                  screens[i + 1],
                  { autoAlpha: 0, filter: "blur(12px)", scale: 0.9 },
                  { autoAlpha: 1, filter: "blur(0px)", scale: 1, duration: 0.45, ease: "power2.out" },
                  at + 0.6
                );
              } else {
                tl.to(el, { autoAlpha: 0, scale: 0.94, duration: 0.3 }, at + 0.35);
                tl.fromTo(screens[i + 1], { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power2.out" }, at + 0.6);
              }

              tl.fromTo(marks[to], { autoAlpha: 0, xPercent: 10 * dir }, { autoAlpha: 1, xPercent: 0, duration: 0.7, ease: "power2.out" }, at + 0.55);
              showBackdrop(to, at + 0.5);
              enterCopy(to, at + 0.75, same ? "rise" : -dir);
              tl.to(stage.querySelector(`.sc-cap[data-cap="${i + 1}"]`), { autoAlpha: 1, y: 0, duration: 0.3 }, at + 1.05);
              ranges.push([start, at + 0.7, i]);
              at += 1.5;
            }
          });

          // Огромная подпись направления медленно плывёт за телефоном на
          // всём протяжении главы - отдельный слой параллакса.
          CHAPTERS.forEach((ch, ci) => {
            const own = ranges.filter((r) => SCREENS[r[2]].chapter === ch.id);
            const s = ci === 0 ? 0 : own[0][0] - 0.8;
            const e = own[own.length - 1][1] + 0.8;
            tl.fromTo(marks[ci].querySelector("span"), { xPercent: 4 }, { xPercent: -8, ease: "none", duration: e - s }, s);
          });

          const total = tl.duration();

          function setRail(time) {
            const hit = ranges.find((r) => time >= r[0] && time < r[1]) ?? ranges[ranges.length - 1];
            const active = time < 1.2 ? -1 : chapterIndex(SCREENS[hit[2]].chapter);
            railItems.forEach((item, k) => item.classList.toggle("is-active", k === active));
            railFill.style.transform = `scaleX(${Math.min(1, time / total)})`;
          }

          gsap
            .timeline({
              scrollTrigger: {
                trigger: stage,
                start: "top top",
                end: () => `+=${total * window.innerHeight * 0.5}`,
                pin: true,
                scrub: 0.8,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => setRail(self.progress * total),
              },
            })
            .add(tl);
          setRail(0);
          setUse3d(true);
          return () => setUse3d(false);
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section ref={sectionRef} className="sc-section" id="services">
      <span className="section-number" aria-hidden="true">
        03
      </span>

      <div ref={stageRef} className="sc-stage">
        <div className="sc-backdrop" aria-hidden="true">
          {CHAPTERS.map((ch) => (
            <span className={`sc-glow sc-glow-${ch.side}`} key={ch.id} style={{ "--sc-accent": ch.accent }} />
          ))}
          {CHAPTERS.filter((ch) => ch.decor).map((ch) => (
            <span
              className={`sc-decor sc-decor-${ch.decor} sc-decor-${ch.side}`}
              key={ch.id}
              data-chapter={ch.id}
              style={{ "--sc-accent": ch.accent }}
            />
          ))}
          {CHAPTERS.map((ch) => (
            <div className={`sc-mark sc-mark-${ch.side}`} key={ch.id} style={{ "--sc-accent": ch.accent }}>
              <span>{ch.rail}</span>
            </div>
          ))}
        </div>

        <div className="sc-intro">
          <p className="section-eyebrow">{t("showcase.eyebrow")}</p>
          <h2 className="sc-heading">
            <span>{t("showcase.headingLine1")}</span>
            <span>{t("showcase.headingLine2")}</span>
          </h2>
          <p className="sc-sub">{t("showcase.sub")}</p>
        </div>

        {CHAPTERS.map((ch, i) => (
          <div className="sc-copy-slot" key={ch.id} style={{ "--sc-accent": ch.accent }}>
            <ChapterCopy chapter={ch} index={i} />
          </div>
        ))}

        {use3d && (
          <Suspense fallback={null}>
            <Phone3D phoneRef={phoneRef} slotRef={slotRef} />
          </Suspense>
        )}

        <div ref={slotRef} className="sc-phone-slot">
          <Phone ref={phoneRef}>
            <div className="sc-screens">
              {SCREENS.map((s, i) => (
                <Screen screen={s} key={i} eager={i < 2} />
              ))}
            </div>
            <div className="sc-taplayer" aria-hidden="true">
              <span className="sc-tap" />
            </div>
          </Phone>
        </div>

        <div className="sc-rail" aria-hidden="true">
          <div className="sc-rail-items">
            {CHAPTERS.map((ch, i) => (
              <span className="sc-rail-item" key={ch.id} style={{ "--sc-accent": ch.accent }}>
                <span className="sc-rail-index">{pad(i + 1)}</span>
                {ch.rail}
              </span>
            ))}
          </div>
          <span className="sc-rail-track">
            <span className="sc-rail-fill" />
          </span>
        </div>
      </div>

      <StaticShowcase />
    </section>
  );
}
