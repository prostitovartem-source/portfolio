import { t } from "../../../i18n/index.js";

/**
 * Pulse — вымышленное аналитическое веб-приложение. Прохладная палитра,
 * живой график, лента активности — читается как реальный рабочий продукт,
 * не как макет дашборда "вообще".
 */
export default function WebAppScreen() {
  const s = t("whatIdo.screens.webapp");

  return (
    <div className="wid-da">
      <div className="wid-da-topbar">
        <span className="wid-da-logo-dot" />
        <span className="wid-da-logo-text">Pulse</span>
        <span className="wid-da-live">
          <span className="wid-da-live-dot" />
          live
        </span>
      </div>

      <h4 className="wid-da-headline">{s.headline}</h4>

      <div className="wid-da-kpis">
        <div className="wid-da-kpi">
          <span className="wid-da-kpi-label">{s.active}</span>
          <span className="wid-da-kpi-value">{s.activeValue}</span>
        </div>
        <div className="wid-da-kpi">
          <span className="wid-da-kpi-label">{s.latency}</span>
          <span className="wid-da-kpi-value">42 ms</span>
        </div>
      </div>

      <svg className="wid-da-chart" viewBox="0 0 220 64" preserveAspectRatio="none" aria-hidden="true">
        <polyline
          className="wid-da-chart-line"
          fill="none"
          strokeWidth="2.5"
          points="0,50 30,42 60,46 90,26 120,32 150,14 180,20 220,6"
        />
      </svg>

      <div className="wid-da-feed">
        {s.feed.map((row) => (
          <div className="wid-da-feed-row" key={row}>
            {row}
          </div>
        ))}
      </div>

      <div className="wid-da-footer">{s.footer}</div>
    </div>
  );
}
