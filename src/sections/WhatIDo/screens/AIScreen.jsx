/**
 * Nova — вымышленный AI-инструмент генерации изображений: промпт,
 * состояние генерации, готовая галерея результатов. Считывается как
 * AI-продукт с первого взгляда, без клише неонового киберпанка.
 */
export default function AIScreen() {
  return (
    <div className="wid-ga">
      <div className="wid-ga-topbar">
        <span className="wid-ga-logo-text">Nova</span>
        <span className="wid-ga-model-tag">SDXL</span>
      </div>

      <div className="wid-ga-prompt">
        <span className="wid-ga-prompt-text">закат над горами, кинематографично</span>
        <span className="wid-ga-cursor" />
      </div>

      <div className="wid-ga-preview">
        <span className="wid-ga-preview-shimmer" />
      </div>

      <div className="wid-ga-gallery">
        <span className="wid-ga-thumb wid-ga-thumb-a" />
        <span className="wid-ga-thumb wid-ga-thumb-b" />
        <span className="wid-ga-thumb wid-ga-thumb-c" />
        <span className="wid-ga-thumb wid-ga-thumb-d" />
      </div>

      <div className="wid-ga-footer">Сгенерировано за 4.2с</div>
    </div>
  );
}
