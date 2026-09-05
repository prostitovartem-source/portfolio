import { useEffect, useState } from "react";
import useMotionPreference, { writeMotionChoice } from "../hooks/useMotionPreference.js";

/**
 * Ненавязчивое предложение включить анимации — только тем, у кого система
 * просит их убрать И кто ещё не сделал выбор.
 *
 * Сознательно НЕ модальное окно: настройка prefers-reduced-motion для части
 * людей стоит по медицинским причинам, и блокирующий диалог, уговаривающий
 * включить движение, для них был бы и назойливым, и вредным. Здесь — тихая
 * плашка, которая не перекрывает контент, закрывается одним нажатием и
 * больше не возвращается.
 */
export default function MotionPrompt() {
  const { systemReduced, choice } = useMotionPreference();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Показываем не сразу: пусть человек сначала увидит сайт.
    if (!systemReduced || choice !== null) return;
    const t = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(t);
  }, [systemReduced, choice]);

  if (!visible) return null;

  function decide(value) {
    writeMotionChoice(value);
    setVisible(false);
    // Перезагрузка — самый надёжный способ пересобрать все scroll-сцены:
    // иначе пришлось бы пересоздавать пины и триггеры на лету, рискуя
    // оставить их в промежуточном состоянии.
    if (value === "full") window.location.reload();
  }

  return (
    <div className="motion-prompt" role="region" aria-label="Настройка анимаций">
      <p className="motion-prompt-text">
        В системе выключены анимации, поэтому сайт показан статично. Включить движение здесь?
      </p>
      <div className="motion-prompt-actions">
        <button type="button" className="motion-prompt-btn motion-prompt-btn-primary" onClick={() => decide("full")}>
          Включить
        </button>
        <button type="button" className="motion-prompt-btn" onClick={() => decide("reduced")}>
          Оставить как есть
        </button>
      </div>
    </div>
  );
}
