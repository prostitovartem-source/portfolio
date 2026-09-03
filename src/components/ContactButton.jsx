import Magnet from "./Magnet.jsx";

/** Основная CTA-кнопка (заливка градиентом) с magnetic-эффектом. */
export default function ContactButton({ href = "#contact", label = "Написать мне", className }) {
  return (
    <Magnet padding={90} strength={4}>
      <a href={href} className={`btn-contact ${className ?? ""}`} data-cursor-label="Go">
        {label}
      </a>
    </Magnet>
  );
}
