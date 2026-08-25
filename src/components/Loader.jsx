import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Короткий экран загрузки — ждёт готовности шрифтов (или максимум 700мс,
 * без искусственных задержек) и плавно исчезает. Не блокирует рендер
 * остального сайта дольше, чем реально нужно.
 */
export default function Loader() {
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const start = performance.now();

    const tick = setInterval(() => {
      const elapsed = performance.now() - start;
      setProgress(Math.min(96, Math.round((elapsed / 600) * 100)));
    }, 40);

    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    const minTime = new Promise((resolve) => setTimeout(resolve, 300));

    Promise.race([Promise.all([fontsReady, minTime]), new Promise((resolve) => setTimeout(resolve, 700))]).then(
      () => {
        if (cancelled) return;
        clearInterval(tick);
        setProgress(100);
        setTimeout(() => !cancelled && setDone(true), 200);
      }
    );

    return () => {
      cancelled = true;
      clearInterval(tick);
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="loader-count">{String(progress).padStart(2, "0")}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
