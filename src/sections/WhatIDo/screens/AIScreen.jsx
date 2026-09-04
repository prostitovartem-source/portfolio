/**
 * Nova — AI-ассистент с генерацией изображений. Интерфейс построен как
 * настоящий чат (реплики, аватар, набор ответа, поле ввода), а не как
 * набор прямоугольников: это сразу читается как AI-продукт.
 */
export default function AIScreen() {
  return (
    <div className="wid-ga">
      <div className="wid-ga-topbar">
        <span className="wid-ga-avatar" />
        <span className="wid-ga-logo-text">Nova</span>
        <span className="wid-ga-model-tag">SDXL</span>
      </div>

      <div className="wid-ga-thread">
        <div className="wid-ga-msg wid-ga-msg-user">закат над горами, кинематографично</div>

        <div className="wid-ga-msg-bot">
          <span className="wid-ga-bot-mark" />
          <div className="wid-ga-bot-body">
            <span className="wid-ga-bot-text">Готово — четыре варианта:</span>
            <div className="wid-ga-gallery">
              <span className="wid-ga-thumb wid-ga-thumb-a" />
              <span className="wid-ga-thumb wid-ga-thumb-b" />
              <span className="wid-ga-thumb wid-ga-thumb-c" />
              <span className="wid-ga-thumb wid-ga-thumb-d" />
            </div>
          </div>
        </div>

        <div className="wid-ga-msg wid-ga-msg-user wid-ga-msg-short">сделай теплее</div>

        <div className="wid-ga-msg-bot">
          <span className="wid-ga-bot-mark" />
          <div className="wid-ga-typing">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>

      <div className="wid-ga-input">
        <span className="wid-ga-input-text">Сообщение…</span>
        <span className="wid-ga-send" />
      </div>
    </div>
  );
}
