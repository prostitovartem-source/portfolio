import FadeIn from "../components/FadeIn.jsx";
import AnimatedText from "../components/AnimatedText.jsx";
import ContactButton from "../components/ContactButton.jsx";
import { RingDecoration, BracketsDecoration, GridDecoration, OrbitDecoration } from "../components/Decoration.jsx";

const ABOUT_TEXT =
  "Я full stack разработчик, создающий современные веб-продукты с фокусом на качество, производительность и удобство пользователя. Использую typescript, react, next.js и node.js, интегрирую ai-инструменты и создаю продукты полного цикла — от идеи и интерфейса до backend-логики и базы данных. Давайте создадим что-то классное вместе!";

export default function AboutSection() {
  return (
    <section className="about" id="about">
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="about-deco about-deco-tl">
        <RingDecoration className="deco-svg deco-svg-lg" />
      </FadeIn>
      <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="about-deco about-deco-tr">
        <BracketsDecoration className="deco-svg deco-svg-lg" />
      </FadeIn>
      <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="about-deco about-deco-bl">
        <GridDecoration className="deco-svg deco-svg-md" />
      </FadeIn>
      <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="about-deco about-deco-br">
        <OrbitDecoration className="deco-svg deco-svg-md" />
      </FadeIn>

      <div className="about-content">
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading about-heading">Обо мне</h2>
        </FadeIn>

        <AnimatedText text={ABOUT_TEXT} className="about-text" />

        <ContactButton />
      </div>
    </section>
  );
}
