import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { shouldReduceMotion } from "../../hooks/useMotionPreference.js";
import { t } from "../../i18n/index.js";
import Phone, { StatusBar } from "./Phone.jsx";
import { CHAPTERS, SCREENS } from "./data.js";
import "./showcase.css";

const pad = (n) => String(n).padStart(2, "0");

function Screen({ screen, eager }) {
  return (
    <div className={`sc-screen ${screen.light ? "sc-screen-light" : ""}`} data-screen={screen.index}>
      <StatusBar />
      <div className="sc-viewport">
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

function ChapterCopy({ chapter, index }) {
  const labels = t("showcase.labels");
  return (
    <div className={`sc-copy sc-copy-${chapter.side === "right" ? "left" : "right"}`} data-chapter={chapter.id}>
      <p className="sc-kicker sc-in">
        <span className="sc-kicker-index">{pad(index + 1)}</span>
        {chapter.kind}
      </p>
      <h3 className="sc-name" aria-label={chapter.name}>
        {[...chapter.name].map((ch, i) => (
          <span className="sc-char-mask" key={i} aria-hidden="true">
            <span className="sc-char">{ch === " " ? " " : ch}</span>
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

      <div className="sc-meta sc-in">
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

      <a className="sc-cta sc-in" href={chapter.link} target="_blank" rel="noreferrer" data-cursor-label="↗">
        <span className="sc-cta-dot" aria-hidden="true" />
        {chapter.cta}
      </a>
    </div>
  );
}

/** Статичная версия: мобильные экраны и режим без анимаций. */
function StaticShowcase() {
  const labels = t("showcase.labels");
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
          <p className="sc-kicker">
            <span className="sc-kicker-index">{pad(ci + 1)}</span>
            {ch.kind}
          </p>
          <h3 className="sc-static-name">{ch.name}</h3>
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
          <div className="sc-meta">
            <div className="sc-meta-col">
              <span className="sc-meta-label">{labels.built}</span>
              <ul className="sc-built">
                {ch.built.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
            <div className="sc-meta-col">
              <span className="sc-meta-label">{labels.stack}</span>
              <ul className="sc-stack">
                {ch.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
          <a className="sc-cta" href={ch.link} target="_blank" rel="noreferrer">
            <span className="sc-cta-dot" aria-hidden="true" />
            {ch.cta}
          </a>
        </article>
      ))}
    </div>
  );
}

export default function ShowcaseSection() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const phoneRef = useRef(null);
  const railRef = useRef(null);

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
          const tap = stage.querySelector(".sc-tap");
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
          gsap.set([phone, ...screens, ...q(".sc-char"), ...q(".sc-in"), ...q(".sc-cap"), ...q(".sc-shot"), ...marks, ...q(".sc-mark span"), ...glows], {
            clearProps: "transform,opacity,visibility",
          });
          gsap.set(screens, { autoAlpha: 0, xPercent: 0, scale: 1 });
          gsap.set(screens[0], { autoAlpha: 1 });
          gsap.set(copies, { autoAlpha: 0 });
          gsap.set(q(".sc-char"), { yPercent: 115 });
          gsap.set(q(".sc-cap"), { autoAlpha: 0, y: 14 });
          gsap.set(marks, { autoAlpha: 0, xPercent: 6 });
          gsap.set(glows, { autoAlpha: 0, scale: 0.8 });
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

          function enterCopy(ch, at, dir) {
            const el = copies[ch];
            tl.set(el, { autoAlpha: 1 }, at);
            tl.fromTo(
              el.querySelectorAll(".sc-char"),
              { yPercent: 115, rotate: 6 },
              { yPercent: 0, rotate: 0, duration: 0.55, stagger: 0.035, ease: "power4.out" },
              at
            );
            tl.fromTo(
              el.querySelectorAll(".sc-in"),
              { autoAlpha: 0, x: dir * 48 },
              { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.06, ease: "power3.out" },
              at + 0.12
            );
          }

          function exitCopy(ch, at) {
            const el = copies[ch];
            tl.to(el.querySelectorAll(".sc-char"), { yPercent: -115, duration: 0.35, stagger: 0.02, ease: "power2.in" }, at);
            tl.to(el.querySelectorAll(".sc-in"), { autoAlpha: 0, y: -24, duration: 0.3, stagger: 0.03, ease: "power2.in" }, at);
            tl.set(el, { autoAlpha: 0 }, at + 0.5);
          }

          function swapCaption(from, to, at) {
            const out = stage.querySelector(`.sc-cap[data-cap="${from}"]`);
            const inn = stage.querySelector(`.sc-cap[data-cap="${to}"]`);
            if (out) tl.to(out, { autoAlpha: 0, y: -14, duration: 0.2, ease: "power2.in" }, at);
            if (inn) tl.to(inn, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, at + 0.2);
          }

          // ── Интро: заголовок уходит вверх, телефон «встаёт» из-под него ──
          tl.to(intro, { yPercent: -60, autoAlpha: 0, filter: "blur(10px)", duration: 0.8, ease: "power2.in" }, 0.25);
          tl.to(
            phone,
            { y: 0, rotationX: 0, rotationY: facing(0), rotationZ: 0, scale: 1, duration: 1.3, ease: "power3.out" },
            0.1
          );
          tl.to(glows[0], { autoAlpha: 1, scale: 1, duration: 1 }, 0.4);
          tl.to(marks[0], { autoAlpha: 1, duration: 0.8 }, 0.6);
          enterCopy(0, 0.95, -1);
          tl.to(stage.querySelector('.sc-cap[data-cap="0"]'), { autoAlpha: 1, y: 0, duration: 0.3 }, 1.25);

          let at = 1.5;

          SCREENS.forEach((scr, i) => {
            const shot = screens[i].querySelector(".sc-shot");
            const viewport = screens[i].querySelector(".sc-viewport");
            const start = at;
            const dwell = scr.long ? 2 : 0.9;

            if (scr.long) {
              tl.to(
                shot,
                { y: () => -(shot.offsetHeight - viewport.offsetHeight), duration: dwell, ease: "none" },
                at + 0.05
              );
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
              // Тап + переход «push», как в iOS.
              if (scr.tap) {
                tl.set(tap, { left: `${scr.tap.x}%`, top: `${scr.tap.y}%` }, at);
                tl.fromTo(tap, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.14, ease: "power2.out" }, at);
                tl.to(tap, { autoAlpha: 0, scale: 1.7, duration: 0.22, ease: "power1.out" }, at + 0.16);
              }
              tl.fromTo(
                screens[i + 1],
                { autoAlpha: 1, xPercent: 100 },
                { xPercent: 0, duration: 0.5, ease: "power3.inOut" },
                at + 0.2
              );
              tl.to(screens[i], { xPercent: -28, opacity: 0.25, duration: 0.5, ease: "power3.inOut" }, at + 0.2);
              tl.set(screens[i], { autoAlpha: 0 }, at + 0.72);
              swapCaption(i, i + 1, at + 0.1);
              ranges.push([start, at + 0.45, i]);
              at += 0.8;
            } else {
              // Смена продукта: телефон переезжает на другую сторону сцены
              // с разворотом, а текст главы уступает место следующему.
              const from = chapterIndex(scr.chapter);
              const to = chapterIndex(next.chapter);
              const dir = CHAPTERS[to].side === "right" ? 1 : -1;
              exitCopy(from, at);
              tl.to(marks[from], { autoAlpha: 0, xPercent: -10 * dir, duration: 0.4, ease: "power2.in" }, at);
              tl.to(glows[from], { autoAlpha: 0, scale: 0.7, duration: 0.7 }, at);
              tl.to(phone, { x: sideX(to), duration: 1.2, ease: "power3.inOut" }, at + 0.1);
              tl.to(phone, { rotationY: dir * 26, scale: 0.88, duration: 0.6, ease: "power2.in" }, at + 0.1);
              tl.to(phone, { rotationY: facing(to), scale: 1, duration: 0.6, ease: "power2.out" }, at + 0.7);
              tl.to(screens[i], { autoAlpha: 0, scale: 0.94, duration: 0.3 }, at + 0.35);
              tl.fromTo(
                screens[i + 1],
                { autoAlpha: 0, scale: 1.08 },
                { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power2.out" },
                at + 0.6
              );
              tl.fromTo(marks[to], { autoAlpha: 0, xPercent: 10 * dir }, { autoAlpha: 1, xPercent: 0, duration: 0.7, ease: "power2.out" }, at + 0.55);
              tl.to(glows[to], { autoAlpha: 1, scale: 1, duration: 0.8 }, at + 0.5);
              enterCopy(to, at + 0.75, -dir);
              tl.to(stage.querySelector(`.sc-cap[data-cap="${i + 1}"]`), { autoAlpha: 1, y: 0, duration: 0.3 }, at + 1.05);
              ranges.push([start, at + 0.7, i]);
              at += 1.5;
            }
          });

          // Огромная подпись продукта медленно плывёт за телефоном на всём
          // протяжении главы - отдельный слой параллакса.
          CHAPTERS.forEach((ch, ci) => {
            const first = ranges.find((r) => SCREENS[r[2]].chapter === ch.id);
            const last = [...ranges].reverse().find((r) => SCREENS[r[2]].chapter === ch.id);
            const s = ci === 0 ? 0 : first[0] - 0.8;
            tl.fromTo(marks[ci].querySelector("span"), { xPercent: 4 }, { xPercent: -8, ease: "none", duration: last[1] - s + 0.8 }, s);
          });

          const total = tl.duration();

          function setRail(time) {
            const hit = ranges.find((r) => time >= r[0] && time < r[1]) ?? ranges[ranges.length - 1];
            const active = time < 1.2 ? -1 : chapterIndex(SCREENS[hit[2]].chapter);
            railItems.forEach((el, k) => el.classList.toggle("is-active", k === active));
            railFill.style.transform = `scaleX(${Math.min(1, time / total)})`;
          }

          const st = {
            trigger: stage,
            start: "top top",
            end: () => `+=${total * window.innerHeight * 0.55}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setRail(self.progress * total),
          };
          gsap.timeline({ scrollTrigger: st }).add(tl);
          setRail(0);
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
          {CHAPTERS.map((ch) => (
            <div className={`sc-mark sc-mark-${ch.side}`} key={ch.id} style={{ "--sc-accent": ch.accent }}>
              <span>{ch.mark}</span>
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

        <div className="sc-phone-slot">
          <Phone ref={phoneRef}>
            <div className="sc-screens">
              {SCREENS.map((s, i) => (
                <Screen screen={s} key={i} eager={i === 0} />
              ))}
            </div>
            <div className="sc-taplayer" aria-hidden="true">
              <span className="sc-tap" />
            </div>
          </Phone>
        </div>

        <div ref={railRef} className="sc-rail" aria-hidden="true">
          <div className="sc-rail-items">
            {CHAPTERS.map((ch, i) => (
              <span className="sc-rail-item" key={ch.id} style={{ "--sc-accent": ch.accent }}>
                <span className="sc-rail-index">{pad(i + 1)}</span>
                {ch.name}
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
