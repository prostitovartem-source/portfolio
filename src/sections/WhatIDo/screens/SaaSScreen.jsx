/**
 * Quantix — вымышленный коммерческий SaaS-дашборд (в духе того, что
 * реально строится под этот тип продукта): выручка, счета, склад.
 * Не буквальная копия существующего интерфейса Quantix, а тот же класс
 * продукта.
 */
export default function SaaSScreen() {
  return (
    <div className="wid-sa">
      <div className="wid-sa-topbar">
        <span className="wid-sa-logo-text">Quantix</span>
        <span className="wid-sa-avatar" />
      </div>

      <div className="wid-sa-revenue">
        <span className="wid-sa-revenue-label">Выручка за месяц</span>
        <span className="wid-sa-revenue-value">₽482 000</span>
        <span className="wid-sa-revenue-trend">+12%</span>
      </div>

      <div className="wid-sa-stats">
        <div className="wid-sa-stat">
          <span className="wid-sa-stat-label">Заказы</span>
          <span className="wid-sa-stat-value">128</span>
        </div>
        <div className="wid-sa-stat">
          <span className="wid-sa-stat-label">Товары</span>
          <span className="wid-sa-stat-value">64</span>
        </div>
      </div>

      <div className="wid-sa-chart">
        <span className="wid-sa-bar" style={{ height: "42%" }} />
        <span className="wid-sa-bar" style={{ height: "64%" }} />
        <span className="wid-sa-bar" style={{ height: "51%" }} />
        <span className="wid-sa-bar" style={{ height: "78%" }} />
        <span className="wid-sa-bar" style={{ height: "66%" }} />
        <span className="wid-sa-bar wid-sa-bar-now" style={{ height: "100%" }} />
      </div>

      <div className="wid-sa-list">
        <div className="wid-sa-list-row">
          <span>Счёт #1042</span>
          <span className="wid-sa-list-status wid-sa-list-status-ok">оплачен</span>
        </div>
        <div className="wid-sa-list-row">
          <span>Счёт #1041</span>
          <span className="wid-sa-list-status">ожидает</span>
        </div>
        <div className="wid-sa-list-row">
          <span>Кроссовки Air</span>
          <span className="wid-sa-list-status">12 шт</span>
        </div>
      </div>

      <div className="wid-sa-footer">Обновлено только что</div>
    </div>
  );
}
