import { t } from "../../../i18n/index.js";

/**
 * READY — финальная композиция: телефон показывает собранный результат
 * всего, что было построено по ходу секции. Единственный экран в языке
 * самого портфолио (не выдуманного продукта) — это подпись под работой,
 * а не ещё один интерфейс.
 */
export default function ReadyScreen() {
  const s = t("whatIdo.screens.ready");

  return (
    <div className="wid-rd">
      <div className="wid-rd-status">
        <span className="wid-rd-status-dot" />
        {s.status}
      </div>

      <h4 className="wid-rd-title">
        {s.titleLine1}
        <br />
        {s.titleLine2}
      </h4>

      <div className="wid-rd-list">
        {s.items.map((item, i) => (
          <div className="wid-rd-row" key={item.name}>
            <span className={`wid-rd-swatch wid-rd-swatch-${i + 1}`} />
            <span className="wid-rd-name">{item.name}</span>
            <span className="wid-rd-kind">{item.kind}</span>
          </div>
        ))}
      </div>

      <div className="wid-rd-foot">{s.footer}</div>
    </div>
  );
}
