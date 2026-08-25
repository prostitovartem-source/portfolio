import FadeIn from "../components/FadeIn.jsx";

const FLOW = ["AI", "Idea", "Code", "Product"];

export default function AISection() {
  return (
    <section className="ai-section">
      <div className="ai-content">
        <FadeIn delay={0} y={20}>
          <span className="ai-tag">vibe coding</span>
        </FadeIn>

        <FadeIn delay={0.1} y={30}>
          <h2 className="hero-heading ai-heading">
            AI-Augmented
            <br />
            Development
          </h2>
        </FadeIn>

        <FadeIn delay={0.25} y={20}>
          <p className="ai-text">
            Использую AI не вместо разработки, а как инструмент ускорения: для
            прототипирования, исследования решений, генерации boilerplate,
            debugging и итерации продукта.
          </p>
        </FadeIn>

        <div className="ai-flow">
          {FLOW.map((step, i) => (
            <div className="ai-flow-item" key={step}>
              <FadeIn delay={0.45 + i * 0.12} y={16} className="ai-flow-node">
                <span>{step}</span>
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
