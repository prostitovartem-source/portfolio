import HeroSection from "./sections/HeroSection.jsx";
import MarqueeSection from "./sections/MarqueeSection.jsx";
import AboutSection from "./sections/AboutSection.jsx";
import ServicesSection from "./sections/ServicesSection.jsx";
import ProjectsSection from "./sections/ProjectsSection.jsx";
import ContactSection from "./sections/ContactSection.jsx";
import "./App.css";

export default function App() {
  return (
    <div className="app" style={{ overflowX: "clip" }}>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ContactSection />

      <footer>
        <p>© 2026 Артём · Сделано на React, Three.js и Framer Motion</p>
      </footer>
    </div>
  );
}
