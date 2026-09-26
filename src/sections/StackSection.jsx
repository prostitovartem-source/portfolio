import FadeIn from "../components/FadeIn.jsx";
import SplitHeading from "../components/SplitHeading.jsx";
import TechArchitecture from "../components/TechArchitecture.jsx";
import { t } from "../i18n/index.js";

export default function StackSection() {
  return (
    <section className="stack" id="stack">
      <span className="section-number" aria-hidden="true">
        04
      </span>

      <FadeIn delay={0} y={20} className="section-eyebrow">
        {t("stack.eyebrow")}
      </FadeIn>

      <SplitHeading lines={t("stack.heading")} className="hero-heading stack-heading" />

      <FadeIn delay={0.15} y={20} className="stack-legend">
        <span className="stack-legend-item stack-legend-core">{t("stack.legendCore")}</span>
        <span className="stack-legend-item stack-legend-tool">{t("stack.legendTool")}</span>
        <span className="stack-legend-item stack-legend-ai">{t("stack.legendAi")}</span>
      </FadeIn>

      <TechArchitecture />
    </section>
  );
}
