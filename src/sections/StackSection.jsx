import FadeIn from "../components/FadeIn.jsx";
import TechArchitecture from "../components/TechArchitecture.jsx";

export default function StackSection() {
  return (
    <section className="stack" id="stack">
      <span className="section-number" aria-hidden="true">
        04
      </span>

      <FadeIn delay={0} y={20} className="section-eyebrow">
        04 / Технологии
      </FadeIn>

      <FadeIn delay={0.05} y={40}>
        <h2 className="hero-heading stack-heading">Технологии</h2>
      </FadeIn>

      <FadeIn delay={0.15} y={20} className="stack-legend">
        <span className="stack-legend-item stack-legend-core">Основной стек</span>
        <span className="stack-legend-item stack-legend-tool">Рабочий инструмент</span>
        <span className="stack-legend-item stack-legend-ai">AI-ускоренное</span>
      </FadeIn>

      <TechArchitecture />
    </section>
  );
}
