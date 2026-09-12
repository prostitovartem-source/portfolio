import Magnet from "./Magnet.jsx";
import { isEn } from "../i18n/index.js";

/** Кнопка-ghost со ссылкой на живой проект, с magnetic-эффектом. */
export default function LiveProjectButton({ href, label, className }) {
  const resolvedLabel = label ?? (isEn() ? "View project" : "Смотреть проект");
  return (
    <Magnet padding={90} strength={4}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`btn-ghost ${className ?? ""}`}
        data-cursor-label="Open"
      >
        {resolvedLabel}
      </a>
    </Magnet>
  );
}
