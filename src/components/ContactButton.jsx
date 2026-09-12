import Magnet from "./Magnet.jsx";
import { t } from "../i18n/index.js";

/** Основная CTA-кнопка (заливка градиентом) с magnetic-эффектом. */
export default function ContactButton({ href = "#contact", label, external = false, className }) {
  const resolvedLabel = label ?? t("nav.contactCta");
  return (
    <Magnet padding={90} strength={4}>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={`btn-contact ${className ?? ""}`}
        data-cursor-label="Go"
      >
        {resolvedLabel}
      </a>
    </Magnet>
  );
}
