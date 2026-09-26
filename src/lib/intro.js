/**
 * Сигнал «лоадер ушёл, сцена открыта». Интро-анимации (hero, навбар)
 * ждут его, иначе они проигрываются под лоадером и никто их не видит.
 *
 * Флаг + событие: компонент, смонтированный после сигнала, получает
 * колбэк сразу, а не ждёт события, которое уже прошло.
 */
const EVENT = "copick:intro-ready";
let ready = false;

export function markIntroReady() {
  if (ready) return;
  ready = true;
  window.dispatchEvent(new Event(EVENT));
}

export function isIntroReady() {
  return ready;
}

/** Вызывает cb, когда интро готово. Возвращает функцию отписки. */
export function onIntroReady(cb) {
  if (ready) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(EVENT, handler, { once: true });
  return () => window.removeEventListener(EVENT, handler);
}
