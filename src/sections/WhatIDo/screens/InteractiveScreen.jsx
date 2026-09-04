/**
 * Кульминация секции — самая экспериментальная сцена: слоистые
 * полупрозрачные CSS 3D-панели, курсор-точка, плавающие UI-чипы.
 * Не ещё один дашборд — чистое ощущение интерактивной глубины.
 */
export default function InteractiveScreen() {
  return (
    <div className="wid-ix">
      <div className="wid-ix-stack">
        <div className="wid-ix-panel wid-ix-panel-1" />
        <div className="wid-ix-panel wid-ix-panel-2" />
        <div className="wid-ix-panel wid-ix-panel-3">
          <span className="wid-ix-sheen" />
          <span className="wid-ix-chip wid-ix-chip-a">Layer 03</span>
          <span className="wid-ix-chip wid-ix-chip-b">Depth</span>
        </div>
      </div>
      <span className="wid-ix-dot wid-ix-dot-a" />
      <span className="wid-ix-dot wid-ix-dot-b" />
      <span className="wid-ix-cursor" />
      <span className="wid-ix-ring" />
    </div>
  );
}
