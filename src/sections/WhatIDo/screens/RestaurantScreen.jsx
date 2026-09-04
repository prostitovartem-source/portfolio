/**
 * EMBER — вымышленный премиальный ресторан. Намеренный контраст с тёмным
 * фиолетовым порфолио: тёплый кремовый фон, бургунди/терракота, редакторский
 * serif. Показывает, что внутри телефона может жить полностью другой
 * визуальный язык, а не перекрашенный шаблон портфолио.
 */
export default function RestaurantScreen() {
  return (
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
      </div>

      <div className="wid-r-info">Патриаршие · Ежедневно 18:00–00:00</div>
      <div className="wid-r-reserve">
        <span className="wid-r-reserve-dot" />
        Сегодня · 19:30 · 2 гостя
      </div>
    </div>
  );
}
