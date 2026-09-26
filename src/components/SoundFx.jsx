import { useEffect } from "react";
import { play, unlockAudio } from "../lib/sound.js";

const INTERACTIVE = "a, button, [data-cursor], [role='button']";

/**
 * Глобальная озвучка интерфейса через делегирование событий: наведение на
 * кнопки и ссылки даёт тихий «тик», нажатие - мягкий «поп». Отдельные
 * компоненты не нужно трогать - любая новая кнопка озвучена автоматически.
 * Ничего не рендерит.
 */
export default function SoundFx() {
  useEffect(() => {
    let lastHover = null;

    function onPointerDown(e) {
      unlockAudio();
      const target = e.target.closest?.(INTERACTIVE);
      // Переключатель звука играет свою мелодию сам.
      if (target && !target.closest("[data-sound-toggle]")) play("click");
    }

    function onPointerOver(e) {
      if (e.pointerType !== "mouse") return;
      const target = e.target.closest?.(INTERACTIVE) ?? null;
      if (target === lastHover) return;
      lastHover = target;
      if (target) play("hover");
    }

    function onKeyDown() {
      unlockAudio();
    }

    window.addEventListener("pointerdown", onPointerDown, { capture: true, passive: true });
    window.addEventListener("pointerover", onPointerOver, { passive: true });
    window.addEventListener("keydown", onKeyDown, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", onPointerDown, { capture: true });
      window.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}
