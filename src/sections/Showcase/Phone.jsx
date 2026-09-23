import { forwardRef } from "react";

/**
 * CSS-телефон без картинок: титановый обод, чёрная рамка, Dynamic Island,
 * кнопки и стеклянный блик. Все размеры внутри в em от ширины корпуса,
 * поэтому один и тот же телефон одинаково точен и на 1440p, и на 4K.
 */
const Phone = forwardRef(function Phone({ children, className = "" }, ref) {
  return (
    <div ref={ref} className={`sc-phone ${className}`}>
      <span className="sc-phone-btn sc-phone-btn-action" aria-hidden="true" />
      <span className="sc-phone-btn sc-phone-btn-up" aria-hidden="true" />
      <span className="sc-phone-btn sc-phone-btn-down" aria-hidden="true" />
      <span className="sc-phone-btn sc-phone-btn-power" aria-hidden="true" />
      <div className="sc-phone-body">
        <div className="sc-phone-bezel">
          <div className="sc-phone-screen">
            {children}
            <span className="sc-phone-island" aria-hidden="true" />
            <span className="sc-phone-glass" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
});

export default Phone;

/** Статус-бар iOS: время слева, связь / Wi-Fi / батарея справа. */
export function StatusBar() {
  return (
    <div className="sc-status" aria-hidden="true">
      <span className="sc-status-time">9:41</span>
      <span className="sc-status-icons">
        <svg viewBox="0 0 18 12" className="sc-status-signal">
          <rect x="0" y="8" width="3" height="4" rx="0.8" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
          <rect x="10" y="3" width="3" height="9" rx="0.8" />
          <rect x="15" y="0" width="3" height="12" rx="0.8" />
        </svg>
        <svg viewBox="0 0 16 12" className="sc-status-wifi">
          <path d="M8 11.5 5.6 9.1a3.4 3.4 0 0 1 4.8 0L8 11.5Z" />
          <path d="M3.4 6.9a6.5 6.5 0 0 1 9.2 0l-1.3 1.3a4.7 4.7 0 0 0-6.6 0L3.4 6.9Z" />
          <path d="M1.2 4.7a9.6 9.6 0 0 1 13.6 0l-1.3 1.3a7.8 7.8 0 0 0-11 0L1.2 4.7Z" />
        </svg>
        <svg viewBox="0 0 27 12" className="sc-status-battery">
          <rect x="0.5" y="0.5" width="23" height="11" rx="3.2" fill="none" strokeWidth="1" />
          <rect x="2" y="2" width="17" height="8" rx="1.8" />
          <path d="M25 4v4a2 2 0 0 0 0-4Z" />
        </svg>
      </span>
    </div>
  );
}
