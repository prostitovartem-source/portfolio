/** Кнопка-ghost со ссылкой на живой проект. */
export default function LiveProjectButton({ href, label = "Смотреть проект", className }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-ghost ${className ?? ""}`}
    >
      {label}
    </a>
  );
}
