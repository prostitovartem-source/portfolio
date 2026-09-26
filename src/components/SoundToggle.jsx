import { useEffect, useState } from "react";
import { isSoundEnabled, setSoundEnabled, subscribeSound } from "../lib/sound.js";
import { t } from "../i18n/index.js";

/**
 * Кнопка звука: четыре «эквалайзерных» столбика танцуют, пока звук
 * включён, и замирают линией, когда выключен.
 */
export default function SoundToggle({ className = "" }) {
  const [on, setOn] = useState(isSoundEnabled);

  useEffect(() => subscribeSound(setOn), []);

  return (
    <button
      type="button"
      className={`sound-toggle ${on ? "sound-toggle-on" : ""} ${className}`}
      aria-pressed={on}
      aria-label={on ? t("sound.turnOff") : t("sound.turnOn")}
      title={on ? t("sound.turnOff") : t("sound.turnOn")}
      data-sound-toggle
      data-cursor-label={on ? "off" : "on"}
      onClick={() => setSoundEnabled(!on)}
    >
      <span className="sound-toggle-bars" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
    </button>
  );
}
