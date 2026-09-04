import FadeIn from "../components/FadeIn.jsx";

const FLOW = ["Idea", "Architecture", "Code", "Debug", "Test", "Polish"];

export default function AISection() {
  return (
    <section className="ai-section">
      <span className="section-number" aria-hidden="true">
        02
      </span>

      <div className="ai-content">
        <FadeIn delay={0} y={20} className="section-eyebrow">
          02 / AI-разработка
        </FadeIn>

        <FadeIn delay={0.05} y={20}>
          <span className="ai-tag">vibe coding</span>
        </FadeIn>

        <FadeIn delay={0.15} y={30}>
          <h2 className="hero-heading ai-heading">
            AI ускоряет
            <br />
            разработку
          </h2>
        </FadeIn>

        <FadeIn delay={0.3} y={20}>
          <p className="ai-text">
            Использую AI не вместо разработки, а как инструмент ускорения: для
            прототипирования, исследования решений, генерации boilerplate,
            debugging и итерации продукта. Каждую строчку понимаю сам —
            AI ускоряет, а не заменяет.
          </p>
        </FadeIn>

        <div className="ai-flow">
          {FLOW.map((step, i) => (
            <div className="ai-flow-item" key={step}>
              <FadeIn delay={0.5 + i * 0.09} y={16} className="ai-flow-node">
                <span className="ai-flow-index">{String(i + 1).padStart(2, "0")}</span>
                <span className="ai-flow-label">{step}</span>
              </FadeIn>
              {i < FLOW.length - 1 && (
                <span className="ai-flow-arrow" aria-hidden="true">
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
