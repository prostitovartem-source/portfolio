const LINKS = [
  { label: "Telegram", href: "https://t.me/cooicks" },
  { label: "Email", href: "mailto:copickprostitov@gmail.com" },
  { label: "GitHub", href: "https://github.com/prostitovartem-source" },
];

/** Минимальный футер: бренд, реальные ссылки, копирайт — без лишних элементов. */
export default function Footer() {
  return (
    <footer className="site-footer">
      <span className="site-footer-brand">COPICK</span>

      <nav className="site-footer-links">
        {LINKS.map((link) => (
          <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
            {link.label}
          </a>
        ))}
      </nav>

      <span className="site-footer-copy">© 2026 · Full-Stack Web Developer</span>
    </footer>
  );
}
