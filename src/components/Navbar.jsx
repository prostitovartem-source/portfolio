import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";
import ContactButton from "./ContactButton.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";
import SoundToggle from "./SoundToggle.jsx";
import { t } from "../i18n/index.js";
import useIntroReady from "../hooks/useIntroReady.js";
import { shouldReduceMotion } from "../hooks/useMotionPreference.js";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { key: "about", href: "#about" },
  { key: "projects", href: "#projects" },
  { key: "stack", href: "#stack" },
  { key: "contact", href: "#contact" },
];

/** Фиксированный navbar на весь сайт: прозрачный вверху, уплотняется при скролле. На мобильном - компактный toggle вместо сжатого текстового ряда. */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const introReady = useIntroReady();
  const progressRef = useRef(null);

  // Тонкая полоса прогресса чтения под навбаром - scrub по всей странице,
  // без React-состояния на скролл.
  useGSAP(() => {
    const bar = progressRef.current;
    if (!bar) return;
    if (shouldReduceMotion()) {
      gsap.set(bar, { display: "none" });
      return;
    }
    gsap.fromTo(
      bar,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.3 },
      }
    );
  }, []);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        className={`site-nav ${scrolled || open ? "site-nav-scrolled" : ""}`}
        initial={{ opacity: 0, y: -20 }}
        animate={introReady ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <span ref={progressRef} className="site-nav-progress" aria-hidden="true" />
        <a href="#" className="site-nav-brand" data-cursor-label={t("nav.toTop")} onClick={() => setOpen(false)}>
          COPICK
        </a>

        <nav className="site-nav-links">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {t(`nav.${link.key}`)}
            </a>
          ))}
        </nav>

        <div className="site-nav-actions">
          <SoundToggle />
          <LanguageSwitcher className="site-nav-lang" />
        </div>

        <button
          type="button"
          className={`site-nav-toggle ${open ? "site-nav-toggle-open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? t("nav.menuClose") : t("nav.menuOpen")}
        >
          <span />
          <span />
        </button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-nav-panel"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav className="mobile-nav-links">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 34, scale: 0.85, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  {t(`nav.${link.key}`)}
                </motion.a>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 34, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.1 + NAV_LINKS.length * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <ContactButton href="#contact" label={t("nav.contactCta")} />
            </motion.div>

            <motion.div
              className="mobile-nav-lang"
              initial={{ opacity: 0, y: 34, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.1 + (NAV_LINKS.length + 1) * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <LanguageSwitcher />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
