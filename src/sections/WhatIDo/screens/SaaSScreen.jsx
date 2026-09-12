import { t } from "../../../i18n/index.js";

/**
 * Quantix — вымышленный коммерческий SaaS-дашборд (в духе того, что
 * реально строится под этот тип продукта): выручка, счета, склад.
 * Не буквальная копия существующего интерфейса Quantix, а тот же класс
 * продукта.
 */
export default function SaaSScreen() {
  const s = t("whatIdo.screens.saas");

  return (
    <div className="wid-sa">
      <div className="wid-sa-topbar">
        <span className="wid-sa-logo-text">Quantix</span>
        <span className="wid-sa-avatar" />
      </div>

      <div className="wid-sa-revenue">
        <span className="wid-sa-revenue-label">{s.revenueLabel}</span>
        <span className="wid-sa-revenue-value">{s.revenueValue}</span>
        <span className="wid-sa-revenue-trend">+12%</span>
      </div>

      <div className="wid-sa-stats">
        <div className="wid-sa-stat">
          <span className="wid-sa-stat-label">{s.orders}</span>
          <span className="wid-sa-stat-value">128</span>
        </div>
        <div className="wid-sa-stat">
          <span className="wid-sa-stat-label">{s.products}</span>
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
        {s.list.map((row) => (
          <div className="wid-sa-list-row" key={row.label}>
            <span>{row.label}</span>
            <span className={`wid-sa-list-status ${row.ok ? "wid-sa-list-status-ok" : ""}`}>{row.status}</span>
          </div>
        ))}
      </div>

      <div className="wid-sa-footer">{s.footer}</div>
    </div>
  );
}
