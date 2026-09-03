import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ContactButton from "./ContactButton.jsx";

const NAV_LINKS = [
  { label: "Обо мне", href: "#about" },
  { label: "Работы", href: "#projects" },
  { label: "Стек", href: "#stack" },
  { label: "Контакт", href: "#contact" },
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
        <a href="#" className="site-nav-brand" data-cursor-label="Наверх" onClick={() => setOpen(false)}>
          COPICK
        </a>

        <nav className="site-nav-links">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className={`site-nav-toggle ${open ? "site-nav-toggle-open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
        >
          <span />
          <span />
        </button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-nav-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="mobile-nav-links">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.4 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + NAV_LINKS.length * 0.06, duration: 0.4 }}
            >
              <ContactButton href="#contact" label="Написать мне" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
