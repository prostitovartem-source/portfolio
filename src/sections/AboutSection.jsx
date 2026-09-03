import FadeIn from "../components/FadeIn.jsx";
import AnimatedText from "../components/AnimatedText.jsx";
import ContactButton from "../components/ContactButton.jsx";
import { RingDecoration, BracketsDecoration, GridDecoration, OrbitDecoration } from "../components/Decoration.jsx";

const ABOUT_TEXT =
  "Меня зовут Артём, мне 16 лет, учусь в 11 классе. В программировании — с 12 лет: начинал с python, а сейчас работаю как full stack разработчик и создаю современные веб-продукты с фокусом на качество, производительность и удобство пользователя. Использую typescript, react, next.js и node.js, работаю с ai как инструментом ускорения разработки и создаю продукты полного цикла — от идеи и интерфейса до backend-логики и базы данных. Давайте создадим что-то классное вместе!";

// Короткие маркеры — сжатая выжимка из ABOUT_TEXT, а не новая информация.
const ABOUT_MARKERS = ["Программирую с 12 лет", "TypeScript · React · Next.js", "AI-assisted development", "Продукт под ключ"];

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
        <FadeIn delay={0} y={40} className="section-eyebrow">
          01 / Обо мне
        </FadeIn>

        <FadeIn delay={0.05} y={40}>
          <h2 className="hero-heading about-heading">Обо мне</h2>
        </FadeIn>

        <AnimatedText text={ABOUT_TEXT} className="about-text" />

        <FadeIn delay={0.1} y={16} className="about-markers">
          {ABOUT_MARKERS.map((m) => (
            <span key={m} className="about-marker">
              {m}
            </span>
          ))}
        </FadeIn>

        <ContactButton />
      </div>
    </section>
  );
}
