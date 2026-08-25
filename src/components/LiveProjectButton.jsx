import Magnet from "./Magnet.jsx";

/** Кнопка-ghost со ссылкой на живой проект, с magnetic-эффектом. */
export default function LiveProjectButton({ href, label = "Смотреть проект", className }) {
  return (
    <Magnet padding={70} strength={7}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`btn-ghost ${className ?? ""}`}
        data-cursor-label="Open"
      >
        {label}
      </a>
    </Magnet>
  );
}
