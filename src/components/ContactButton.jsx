import Magnet from "./Magnet.jsx";

/** Основная CTA-кнопка (заливка градиентом) с magnetic-эффектом. */
export default function ContactButton({ href = "#contact", label = "Написать мне", className }) {
  return (
    <Magnet padding={70} strength={7}>
      <a href={href} className={`btn-contact ${className ?? ""}`} data-cursor-label="Go">
        {label}
      </a>
    </Magnet>
  );
}
