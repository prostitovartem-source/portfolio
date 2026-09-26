import FadeIn from "../components/FadeIn.jsx";
import SplitHeading from "../components/SplitHeading.jsx";
import { t } from "../i18n/index.js";

const FLOW = ["Idea", "Architecture", "Code", "Debug", "Test", "Polish"];

export default function AISection() {
  return (
    <section className="ai-section">
      <span className="section-number" aria-hidden="true">
        02
      </span>

      <div className="ai-content">
        <FadeIn delay={0} y={20} className="section-eyebrow">
          {t("ai.eyebrow")}
        </FadeIn>

        <FadeIn delay={0.05} y={20}>
          <span className="ai-tag">{t("ai.tag")}</span>
        </FadeIn>

        <SplitHeading
          lines={[t("ai.headingLine1"), t("ai.headingLine2")]}
          className="hero-heading ai-heading"
          delay={0.1}
        />

        <FadeIn delay={0.3} y={20}>
          <p className="ai-text">{t("ai.text")}</p>
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
