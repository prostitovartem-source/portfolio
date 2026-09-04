/**
 * Pulse — вымышленное аналитическое веб-приложение. Прохладная палитра,
 * живой график, лента активности — читается как реальный рабочий продукт,
 * не как макет дашборда "вообще".
 */
export default function WebAppScreen() {
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

      <h4 className="wid-da-headline">Обзор в реальном времени</h4>

      <div className="wid-da-kpis">
        <div className="wid-da-kpi">
          <span className="wid-da-kpi-label">Активные</span>
          <span className="wid-da-kpi-value">1 204</span>
        </div>
        <div className="wid-da-kpi">
          <span className="wid-da-kpi-label">Задержка</span>
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
        <div className="wid-da-feed-row">Иван оплатил счёт #2291</div>
        <div className="wid-da-feed-row">Новый пользователь зарегистрирован</div>
        <div className="wid-da-feed-row">Деплой завершён · main</div>
      </div>

      <div className="wid-da-footer">Синхронизировано 2с назад</div>
    </div>
  );
}
