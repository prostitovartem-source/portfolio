import { isEn } from "../../i18n/index.js";
import { ALTIME_SHOT } from "./data.js";

/**
 * Живые экраны телефона, собранные в коде. Всё, что здесь написано,
 * повторяет настоящие продукты:
 * - тексты бота дословно из lib/max/messages.ts в ALTIME (бонус 30 🍓 -
 *   MAX_SUBSCRIPTION_BONUS);
 * - шаги оплаты повторяют app/api/payments/webhook и
 *   lib/payments/creditPayment.ts, строка операции - та же, что пишет код;
 * - модель генерации - gemini-2.5-flash-image из lib/ai;
 * - распознавание накладной - реальная функция QUANTIX, данные на экране
 *   помечены как пример.
 *
 * Экраны на русском, как и сами продукты. В статичном режиме они
 * показываются в финальном состоянии, анимацию добавляет только сцена.
 */

const L = (ru, en) => (isEn() ? en : ru);

function Chat() {
  return (
    <div className="lv lv-chat">
      <div className="lv-chat-head">
        <span className="lv-chat-back" aria-hidden="true" />
        <span className="lv-chat-avatar" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" fill="#fff" />
          </svg>
        </span>
        <span className="lv-chat-title">
          <b>ALTIME AI 🍓</b>
          <i>бот</i>
        </span>
      </div>

      <div className="lv-chat-body">
        <span className="lv-chat-day">сегодня</span>

        <div className="lv-msg lv-msg-user lv-beat">/start</div>

        <div className="lv-msg lv-msg-bot lv-beat">
          👋 Добро пожаловать в ALTIME AI!
          <br />
          <br />
          Создавайте AI-фотографии прямо в MAX 🍓
          <br />
          <br />
          🎁 Хотите получить 30 🍓 бесплатно?
          <br />
          <br />
          Просто подпишитесь на официальный канал ALTIME и нажмите кнопку проверки.
        </div>
        <div className="lv-kb lv-beat">
          <span>📢 Подписаться</span>
          <span data-tap="check">✅ Проверить подписку</span>
        </div>

        <div className="lv-msg lv-msg-bot lv-beat">
          🎉 Готово!
          <br />
          <br />
          Спасибо за подписку на ALTIME ❤️
          <br />
          <br />
          Вам начислено 30 🍓.
          <br />
          <br />
          Теперь вы можете создавать AI-фотографии.
        </div>
        <div className="lv-kb lv-beat">
          <span className="lv-kb-app" data-tap="open-app">
            🚀 Создать фото
          </span>
        </div>
      </div>

      <div className="lv-chat-input">
        <span>Сообщение</span>
      </div>
    </div>
  );
}

const FLOW_NODES = [
  { icon: "⚡", type: "Webhook", title: "ЮKassa", note: "payment.succeeded" },
  { icon: "↗", type: "HTTP", title: "checkPayment", note: "статус берём у ЮKassa, не из тела запроса" },
  { icon: "◇", type: "IF", title: "status = succeeded", note: "иначе ждём следующий вебхук" },
  { icon: "▤", type: "PostgreSQL", title: "Транзакция", note: "баланс + 🍓, только один раз" },
  { icon: "✓", type: "Result", title: "Баланс пополнен", note: "запись в истории операций" },
];

function Flow() {
  return (
    <div className="lv lv-flow">
      <div className="lv-flow-head">
        <span className="lv-flow-name">
          <b>Оплата → баланс</b>
          <i>ALTIME · workflow</i>
        </span>
        <span className="lv-flow-live">
          <i />
          Active
        </span>
      </div>

      <div className="lv-flow-canvas">
        {FLOW_NODES.map((n, i) => (
          <div className="lv-flow-step" key={n.type}>
            {i > 0 && (
              <span className="lv-flow-wire" aria-hidden="true">
                <span className="lv-flow-packet" />
              </span>
            )}
            <div className="lv-node" data-node={i}>
              <span className="lv-node-icon">{n.icon}</span>
              <span className="lv-node-text">
                <i>{n.type}</i>
                <b>{n.title}</b>
                <small>{n.note}</small>
              </span>
              <span className="lv-node-ok" aria-hidden="true">
                ✓
              </span>
            </div>
          </div>
        ))}

        <div className="lv-flow-side">
          <span className="lv-node lv-node-small" data-node="cron">
            <span className="lv-node-icon">⏱</span>
            <span className="lv-node-text">
              <i>Cron</i>
              <b>Перепроверка зависших платежей</b>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

const RUN_STEPS = [
  { t: "0.00s", k: "webhook", v: "payment.succeeded" },
  { t: "0.21s", k: "checkPayment", v: "status: succeeded" },
  { t: "0.24s", k: "UPDATE payment", v: "WHERE status ≠ SUCCEEDED" },
  { t: "0.26s", k: "user.balance", v: "increment: 150" },
  { t: "0.27s", k: "creditTransaction", v: "«Пополнение баланса · 150 🍓»" },
];

function Run() {
  return (
    <div className="lv lv-run">
      <div className="lv-flow-head">
        <span className="lv-flow-name">
          <b>Один проход</b>
          <i>{L("пример запуска", "sample run")}</i>
        </span>
        <span className="lv-run-status">succeeded</span>
      </div>

      <ol className="lv-run-list">
        {RUN_STEPS.map((s) => (
          <li className="lv-run-row lv-beat" key={s.k}>
            <span className="lv-run-time">{s.t}</span>
            <span className="lv-run-dot" aria-hidden="true" />
            <span className="lv-run-body">
              <b>{s.k}</b>
              <code>{s.v}</code>
            </span>
          </li>
        ))}
      </ol>

      <div className="lv-run-guard lv-beat">
        <b>Повторный вебхук</b>
        <span>тот же платёж → UPDATE ничего не меняет → второго начисления нет</span>
      </div>

      <div className="lv-run-toast lv-beat">
        <span>🍓</span>
        <span>
          <b>Баланс пополнен</b>
          <i>+150 🍓 · без участия человека</i>
        </span>
      </div>
    </div>
  );
}

function AiGen() {
  return (
    <div className="lv lv-ai">
      <div className="lv-ai-head">
        <span className="lv-ai-chip">gemini-2.5-flash-image</span>
        <b>AI-фотосессия</b>
      </div>

      <div className="lv-ai-input lv-beat">
        <span className="lv-ai-photo" aria-hidden="true">
          <svg viewBox="0 0 40 48">
            <circle cx="20" cy="17" r="8" />
            <path d="M5 46c1.5-9 7.6-14 15-14s13.5 5 15 14" />
          </svg>
        </span>
        <span className="lv-ai-input-text">
          <i>Твоё фото</i>
          <b>+ фотосессия «Old Money»</b>
        </span>
      </div>

      <div className="lv-ai-progress lv-beat">
        <span className="lv-ai-bar">
          <span className="lv-ai-bar-fill" />
        </span>
        <span className="lv-ai-steps">
          <i>списали 🍓</i>
          <i>генерация</i>
          <i>готово</i>
        </span>
      </div>

      <figure className="lv-ai-result lv-beat">
        <img src={ALTIME_SHOT("old-money")} width="720" height="900" alt="" loading="lazy" decoding="async" />
        <figcaption>Old Money</figcaption>
      </figure>

      <div className="lv-ai-more lv-beat">
        {["royal", "cyberpunk", "travel"].map((n) => (
          <img key={n} src={ALTIME_SHOT(n)} width="720" height="900" alt="" loading="lazy" decoding="async" />
        ))}
      </div>

      <p className="lv-ai-note lv-beat">Если генерация упала, клубнички возвращаются автоматически.</p>
    </div>
  );
}

const OCR_ROWS = [
  { name: "Хлеб пшеничный", qty: "20 шт", price: "46 → 58 ₽" },
  { name: "Батон нарезной", qty: "15 шт", price: "52 → 65 ₽" },
  { name: "Молоко 3,2%", qty: "24 шт", price: "89 → 111 ₽" },
];

function Ocr() {
  return (
    <div className="lv lv-ocr">
      <div className="lv-ocr-head">
        <b>QUANTIX</b>
        <span>Распознавание накладной</span>
      </div>

      <div className="lv-ocr-paper">
        <span className="lv-ocr-paper-title">НАКЛАДНАЯ</span>
        {Array.from({ length: 7 }).map((_, i) => (
          <span className="lv-ocr-line" key={i} style={{ width: `${88 - ((i * 13) % 34)}%` }} />
        ))}
        <span className="lv-ocr-scan" aria-hidden="true" />
      </div>

      <div className="lv-ocr-fields">
        <div className="lv-ocr-field lv-beat">
          <i>Поставщик</i>
          <b>ООО «Хлебный двор»</b>
        </div>
        {OCR_ROWS.map((r) => (
          <div className="lv-ocr-row lv-beat" key={r.name}>
            <span>{r.name}</span>
            <span>{r.qty}</span>
            <b>{r.price}</b>
          </div>
        ))}
        <div className="lv-ocr-total lv-beat">
          <span>Итого по накладной · наценка 25%</span>
          <b>3 836 ₽</b>
        </div>
      </div>

      <span className="lv-ocr-demo">демо-данные</span>
    </div>
  );
}

const LIVE_SCREENS = { chat: Chat, flow: Flow, run: Run, aigen: AiGen, ocr: Ocr };

export default function LiveScreen({ kind }) {
  const Screen = LIVE_SCREENS[kind];
  return Screen ? <Screen /> : null;
}
