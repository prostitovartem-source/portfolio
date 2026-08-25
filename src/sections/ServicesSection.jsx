import FadeIn from "../components/FadeIn.jsx";

const SERVICES = [
  {
    number: "01",
    name: "Websites",
    description: "Быстрые, современные сайты с продуманной анимацией и вниманием к деталям — на React и Next.js.",
  },
  {
    number: "02",
    name: "Web Applications",
    description: "Полноценные веб-приложения — от интерфейса до API и бизнес-логики на Node.js.",
  },
  {
    number: "03",
    name: "SaaS Products",
    description: "SaaS-продукты под ключ: аутентификация, базы данных (PostgreSQL, Prisma), внешние интеграции.",
  },
  {
    number: "04",
    name: "AI Integrations",
    description:
      "Встраивание AI-моделей (Replicate и совместимые API) в продукт — от обработки изображений до генерации контента.",
  },
  {
    number: "05",
    name: "Interactive Experiences",
    description: "Интерфейсы на Framer Motion и Three.js, которые не просто работают, а ощущаются как готовый продукт.",
  },
];

export default function ServicesSection() {
  return (
    <section className="services" id="services">
      <FadeIn delay={0} y={40}>
        <h2 className="services-heading">What I Build</h2>
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
