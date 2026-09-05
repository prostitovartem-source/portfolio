import Navbar from "./components/Navbar.jsx";
import Loader from "./components/Loader.jsx";
import CustomCursor from "./components/CustomCursor.jsx";
import SmoothScroll from "./components/SmoothScroll.jsx";
import SectionBridge from "./components/SectionBridge.jsx";
import MotionPrompt from "./components/MotionPrompt.jsx";
import Footer from "./components/Footer.jsx";
import HeroSection from "./sections/HeroSection.jsx";
import MarqueeSection from "./sections/MarqueeSection.jsx";
import AboutSection from "./sections/AboutSection.jsx";
import AISection from "./sections/AISection.jsx";
import WhatIDoSection from "./sections/WhatIDo/WhatIDoSection.jsx";
import StackSection from "./sections/StackSection.jsx";
import ProjectsSection from "./sections/ProjectsSection.jsx";
import ContactSection from "./sections/ContactSection.jsx";
import "./App.css";

export default function App() {
  return (
    <div className="app" style={{ overflowX: "clip" }}>
      <Loader />
      <CustomCursor />
      <SmoothScroll />
      <Navbar />

      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <AISection />
      <WhatIDoSection />
      <StackSection />
      <SectionBridge label="архитектура → продукт" />
      <ProjectsSection />
      <SectionBridge label="все системы соединены" />
      <ContactSection />

      <Footer />
      <MotionPrompt />
    </div>
  );
}
