import FadeIn from "../components/FadeIn.jsx";

const SERVICES = [
  {
    number: "01",
    name: "Frontend-разработка",
    description:
      "Современные, отзывчивые интерфейсы на React и Next.js с продуманной анимацией и вниманием к деталям.",
  },
  {
    number: "02",
    name: "Backend-разработка",
    description:
      "Проектирование API и бизнес-логики на Node.js — от аутентификации до интеграции внешних сервисов.",
  },
  {
    number: "03",
    name: "AI-интеграция",
    description:
      "Встраивание AI-моделей (Replicate и совместимые API) в продукт — от обработки изображений до генерации контента.",
  },
  {
    number: "04",
    name: "Базы данных",
    description:
      "Проектирование схем, миграции и работа с PostgreSQL через Prisma для надёжных и масштабируемых продуктов.",
  },
  {
    number: "05",
    name: "UX/UI и анимации",
    description:
      "Framer Motion и Three.js для интерфейсов, которые не просто работают, а ощущаются как готовый продукт.",
  },
];

export default function ServicesSection() {
  return (
    <section className="services" id="services">
      <FadeIn delay={0} y={40}>
        <h2 className="services-heading">Услуги</h2>
      </FadeIn>

      <div className="services-list">
        {SERVICES.map((service, i) => (
          <FadeIn key={service.number} delay={i * 0.1} className="service-item">
            <span className="service-number">{service.number}</span>
            <div className="service-body">
              <p className="service-name">{service.name}</p>
              <p className="service-description">{service.description}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
