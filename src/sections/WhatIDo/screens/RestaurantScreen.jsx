import { t } from "../../../i18n/index.js";

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
  const s = t("whatIdo.screens.restaurant");

  return (
    <div className="wid-r-viewport">
      <div className="wid-r">
        <div className="wid-r-nav">
          <span className="wid-r-logo">EMBER</span>
          <span className="wid-r-navlink">{s.menu}</span>
          <span className="wid-r-navlink">{s.book}</span>
        </div>

        <div className="wid-r-hero">
          <span className="wid-r-hero-tag">{s.heroTag}</span>
        </div>

        <h4 className="wid-r-headline">
          {s.headlineLine1}
          <br />
          {s.headlineLine2}
        </h4>
        <p className="wid-r-sub">{s.sub1}</p>

        <button className="wid-r-cta" type="button" tabIndex={-1}>
          {s.cta}
        </button>

        <p className="wid-r-sub">{s.sub2}</p>

        <div className="wid-r-gallery">
          <span className="wid-r-tile wid-r-tile-a" />
          <span className="wid-r-tile wid-r-tile-b" />
          <span className="wid-r-tile wid-r-tile-c" />
        </div>

        <div className="wid-r-dishes">
          {s.dishes.map((dish, i) => (
            <div className="wid-r-dish" key={dish.name}>
              <span className={`wid-r-dish-swatch ${i > 0 ? `wid-r-dish-swatch-${"bcd"[i - 1]}` : ""}`} />
              <span className="wid-r-dish-name">{dish.name}</span>
              <span className="wid-r-dish-price">{dish.price}</span>
            </div>
          ))}
        </div>

        <div className="wid-r-hours">
          {s.hours.map((row) => (
            <div className="wid-r-hours-row" key={row.days}>
              <span>{row.days}</span>
              <span>{row.time}</span>
            </div>
          ))}
        </div>

        <div className="wid-r-info">{s.info}</div>

        <div className="wid-r-reserve">
          <span className="wid-r-reserve-dot" />
          {s.reserve}
        </div>

        <div className="wid-r-foot">
          <span className="wid-r-logo">EMBER</span>
          <span className="wid-r-foot-line">{s.footLine}</span>
        </div>
      </div>
    </div>
  );
}
