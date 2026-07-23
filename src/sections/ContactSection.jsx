import FadeIn from "../components/FadeIn.jsx";

const CONTACTS = [
  {
    label: "Telegram",
    value: "@cooicks",
    href: "https://t.me/cooicks",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path
          d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0
          12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506
          0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962
          6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184
          3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793
          1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663
          3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627
          4.476-1.635z"
        />
      </svg>
    ),
    color: "#38bdf8",
  },
  {
    label: "Email",
    value: "copickprostitov@gmail.com",
    href: "mailto:copickprostitov@gmail.com",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="22"
        height="22"
      >
        <rect x="2" y="4" width="20" height="16" rx="3" />
        <path d="m2 7 10 7 10-7" />
      </svg>
    ),
    color: "#a78bfa",
  },
  {
    label: "GitHub",
    value: "github.com",
    href: "https://github.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path
          d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205
          11.385.6.113.82-.258.82-.577
          0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729
          1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304
          3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931
          0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0
          1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005
          2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653
          1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0
          4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823
          2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24
          12c0-6.63-5.37-12-12-12z"
        />
      </svg>
    ),
    color: "#60a5fa",
  },
];

export default function ContactSection() {
  return (
    <section className="contact" id="contact">
      <FadeIn delay={0} y={40}>
        <h2 className="hero-heading contact-heading">Контакты</h2>
      </FadeIn>

      <FadeIn delay={0.1} y={20}>
        <p className="contact-lead">Открыт к работе и новым проектам — напиши мне удобным способом.</p>
      </FadeIn>

      <div className="contact-grid">
        {CONTACTS.map((c, i) => (
          <FadeIn key={c.label} delay={0.15 + i * 0.08} y={20}>
            <a href={c.href} target="_blank" rel="noopener noreferrer" className="contact-card" style={{ "--accent-color": c.color }}>
              <span className="contact-icon">{c.icon}</span>
              <span className="contact-label">{c.label}</span>
              <span className="contact-value">{c.value}</span>
            </a>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
