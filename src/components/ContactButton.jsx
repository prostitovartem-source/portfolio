import Magnet from "./Magnet.jsx";

/** Основная CTA-кнопка (заливка градиентом) с magnetic-эффектом. */
export default function ContactButton({ href = "#contact", label = "Написать мне", external = false, className }) {
  return (
    <Magnet padding={90} strength={4}>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={`btn-contact ${className ?? ""}`}
        data-cursor-label="Go"
      >
        {label}
      </a>
    </Magnet>
  );
}
