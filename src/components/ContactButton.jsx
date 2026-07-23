/** Основная CTA-кнопка (заливка градиентом). */
export default function ContactButton({ href = "#contact", label = "Написать мне", className }) {
  return (
    <a href={href} className={`btn-contact ${className ?? ""}`}>
      {label}
    </a>
  );
}
