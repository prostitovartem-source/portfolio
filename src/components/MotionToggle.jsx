import useMotionPreference, { writeMotionChoice } from "../hooks/useMotionPreference.js";
import { t } from "../i18n/index.js";

/**
 * Постоянная точка возврата: передумать можно в любой момент, не залезая в
 * настройки системы и не чистя хранилище браузера.
 */
export default function MotionToggle() {
  const { reduced } = useMotionPreference();

  function toggle() {
    writeMotionChoice(reduced ? "full" : "reduced");
    window.location.reload();
  }

  return (
    <button type="button" className="motion-toggle" onClick={toggle} aria-pressed={!reduced}>
      {t("motion.togglePrefix")} {reduced ? t("motion.toggleOff") : t("motion.toggleOn")}
    </button>
  );
}
