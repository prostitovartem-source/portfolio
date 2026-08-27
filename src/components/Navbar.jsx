import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { label: "Обо мне", href: "#about" },
  { label: "Работы", href: "#projects" },
  { label: "Стек", href: "#stack" },
  { label: "Контакт", href: "#contact" },
];

/** Фиксированный navbar на весь сайт: прозрачный вверху, уплотняется при скролле. */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`site-nav ${scrolled ? "site-nav-scrolled" : ""}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <a href="#" className="site-nav-brand" data-cursor-label="Наверх">
        COPICK
      </a>
      <nav className="site-nav-links">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
    </motion.header>
  );
}
