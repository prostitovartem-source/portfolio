import FadeIn from "../components/FadeIn.jsx";

const SERVICES = [
  {
    number: "01",
    name: "Сайты",
    description: "Быстрые, современные сайты с продуманной анимацией и вниманием к деталям — на React и Next.js.",
  },
  {
    number: "02",
    name: "Веб-приложения",
    description: "Полноценные веб-приложения — от интерфейса до API и бизнес-логики на Node.js.",
  },
  {
    number: "03",
    name: "SaaS-продукты",
    description: "SaaS-продукты под ключ: аутентификация, базы данных (PostgreSQL, Prisma), внешние интеграции.",
  },
  {
    number: "04",
    name: "AI-интеграции",
    description:
      "Встраивание AI-моделей (Replicate и совместимые API) в продукт — от обработки изображений до генерации контента.",
  },
  {
    number: "05",
    name: "Интерактивные интерфейсы",
    description: "Интерфейсы на Framer Motion и Three.js, которые не просто работают, а ощущаются как готовый продукт.",
  },
];

export default function ServicesSection() {
  return (
    <section className="services" id="services">
      <span className="section-number section-number-dark" aria-hidden="true">
        03
      </span>

      <FadeIn delay={0} y={20} className="section-eyebrow section-eyebrow-dark">
        03 / Чем занимаюсь
      </FadeIn>

      <FadeIn delay={0.05} y={40}>
        <h2 className="services-heading">Что я делаю</h2>
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
