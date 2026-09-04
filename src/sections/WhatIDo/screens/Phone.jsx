/**
 * Реалистичный CSS-мокап телефона (не картинка): титановая рамка,
 * динамический островок, боковые кнопки, лёгкий блик на экране.
 * Один и тот же телефон переиспользуется для всех 5 сцен — меняется
 * только контент экрана (children), сам объект остаётся главным
 * "актёром" сцены на протяжении всего master-timeline.
 */
export default function Phone({ children }) {
  return (
    <div className="wid-phone">
      <span className="wid-phone-btn wid-phone-btn-mute" aria-hidden="true" />
      <span className="wid-phone-btn wid-phone-btn-vol-up" aria-hidden="true" />
      <span className="wid-phone-btn wid-phone-btn-vol-down" aria-hidden="true" />
      <span className="wid-phone-btn wid-phone-btn-power" aria-hidden="true" />
      <div className="wid-phone-frame">
        <div className="wid-phone-screen">
          <div className="wid-phone-island" aria-hidden="true" />
          <div className="wid-phone-screen-inner">{children}</div>
          <span className="wid-phone-sheen" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
