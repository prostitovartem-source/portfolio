/**
 * READY — финальная композиция: телефон показывает собранный результат
 * всего, что было построено по ходу секции. Единственный экран в языке
 * самого портфолио (не выдуманного продукта) — это подпись под работой,
 * а не ещё один интерфейс.
 */
export default function ReadyScreen() {
  return (
    <div className="wid-rd">
      <div className="wid-rd-status">
        <span className="wid-rd-status-dot" />
        Собрано
      </div>

      <h4 className="wid-rd-title">
        Пять продуктов —
        <br />
        один подход
      </h4>

      <div className="wid-rd-list">
        <div className="wid-rd-row">
          <span className="wid-rd-swatch wid-rd-swatch-1" />
          <span className="wid-rd-name">EMBER</span>
          <span className="wid-rd-kind">сайт</span>
        </div>
        <div className="wid-rd-row">
          <span className="wid-rd-swatch wid-rd-swatch-2" />
          <span className="wid-rd-name">Pulse</span>
          <span className="wid-rd-kind">веб-приложение</span>
        </div>
        <div className="wid-rd-row">
          <span className="wid-rd-swatch wid-rd-swatch-3" />
          <span className="wid-rd-name">Quantix</span>
          <span className="wid-rd-kind">SaaS</span>
        </div>
        <div className="wid-rd-row">
          <span className="wid-rd-swatch wid-rd-swatch-4" />
          <span className="wid-rd-name">Nova</span>
          <span className="wid-rd-kind">AI</span>
        </div>
        <div className="wid-rd-row">
          <span className="wid-rd-swatch wid-rd-swatch-5" />
          <span className="wid-rd-name">Depth</span>
          <span className="wid-rd-kind">интерфейс</span>
        </div>
      </div>

      <div className="wid-rd-foot">От макета до продакшена</div>
    </div>
  );
}
