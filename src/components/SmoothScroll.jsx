import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis, useLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Единственный глобальный Lenis-инстанс сайта (root — доступен всему
 * дереву через useLenis, управляет скроллом всего document). autoRaf:false
 * — Lenis не гоняет свой отдельный requestAnimationFrame; вместо этого
 * GSAP-тикер сам вызывает lenis.raf() каждый кадр — единственный rAF-цикл
 * на сайте. useLenis(ScrollTrigger.update) держит ScrollTrigger в курсе
 * сглаженной (не нативной) позиции скролла на каждый тик Lenis.
 * Официальный паттерн, см. darkroomengineering/lenis packages/react/README.
 */
export default function SmoothScroll() {
  const lenisRef = useRef(null);

  useLenis(() => {
    ScrollTrigger.update();
  });

  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, []);

  return <ReactLenis root ref={lenisRef} options={{ autoRaf: false }} />;
}
