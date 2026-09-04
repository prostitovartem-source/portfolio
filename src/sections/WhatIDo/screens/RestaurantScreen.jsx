/**
 * EMBER — вымышленный премиальный ресторан. Намеренный контраст с тёмным
 * фиолетовым порфолио: тёплый кремовый фон, бургунди/терракота, редакторский
 * serif.
 *
 * Дизайн не менялся — те же элементы, цвета и типографика. Изменена только
 * вертикальная механика: страница теперь ВЫШЕ экрана телефона и живёт в
 * .wid-r-viewport (клип по скруглению экрана), чтобы её можно было
 * по-настоящему проскроллить внутри аппарата: Hero → меню → информация →
 * бронь → финал.
 */
export default function RestaurantScreen() {
  return (
    <div className="wid-r-viewport">
      <div className="wid-r">
        <div className="wid-r-nav">
          <span className="wid-r-logo">EMBER</span>
          <span className="wid-r-navlink">Меню</span>
          <span className="wid-r-navlink">Бронь</span>
        </div>

        <div className="wid-r-hero">
          <span className="wid-r-hero-tag">Открытый огонь</span>
        </div>

        <h4 className="wid-r-headline">
          Ужин,
          <br />
          который запоминается
        </h4>
        <p className="wid-r-sub">Сезонное меню. Открытый огонь. Атмосфера вечера.</p>

        <button className="wid-r-cta" type="button" tabIndex={-1}>
          Забронировать столик
        </button>

        <p className="wid-r-sub">
          Готовим на живом огне: дровяная печь, угли, сезонные продукты от локальных хозяйств.
        </p>

        <div className="wid-r-gallery">
          <span className="wid-r-tile wid-r-tile-a" />
          <span className="wid-r-tile wid-r-tile-b" />
          <span className="wid-r-tile wid-r-tile-c" />
        </div>

        <div className="wid-r-dishes">
          <div className="wid-r-dish">
            <span className="wid-r-dish-swatch" />
            <span className="wid-r-dish-name">Тартар из тунца</span>
            <span className="wid-r-dish-price">890 ₽</span>
          </div>
          <div className="wid-r-dish">
            <span className="wid-r-dish-swatch wid-r-dish-swatch-b" />
            <span className="wid-r-dish-name">Стейк рибай</span>
            <span className="wid-r-dish-price">2 400 ₽</span>
          </div>
          <div className="wid-r-dish">
            <span className="wid-r-dish-swatch wid-r-dish-swatch-c" />
            <span className="wid-r-dish-name">Осьминог на угле</span>
            <span className="wid-r-dish-price">1 650 ₽</span>
          </div>
          <div className="wid-r-dish">
            <span className="wid-r-dish-swatch wid-r-dish-swatch-d" />
            <span className="wid-r-dish-name">Пахлава с фисташкой</span>
            <span className="wid-r-dish-price">640 ₽</span>
          </div>
        </div>

        <div className="wid-r-hours">
          <div className="wid-r-hours-row">
            <span>Пн — Чт</span>
            <span>18:00 — 00:00</span>
          </div>
          <div className="wid-r-hours-row">
            <span>Пт — Вс</span>
            <span>17:00 — 02:00</span>
          </div>
        </div>

        <div className="wid-r-info">Патриаршие · Ежедневно 18:00–00:00</div>

        <div className="wid-r-reserve">
          <span className="wid-r-reserve-dot" />
          Сегодня · 19:30 · 2 гостя
        </div>

        <div className="wid-r-foot">
          <span className="wid-r-logo">EMBER</span>
          <span className="wid-r-foot-line">Большая Бронная, 12</span>
        </div>
      </div>
    </div>
  );
}
