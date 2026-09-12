import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ContactButton from "./ContactButton.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";
import { t } from "../i18n/index.js";

const NAV_LINKS = [
  { key: "about", href: "#about" },
  { key: "projects", href: "#projects" },
  { key: "stack", href: "#stack" },
  { key: "contact", href: "#contact" },
];

/** Фиксированный navbar на весь сайт: прозрачный вверху, уплотняется при скролле. На мобильном — компактный toggle вместо сжатого текстового ряда. */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      >
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

        <LanguageSwitcher className="site-nav-lang" />

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
