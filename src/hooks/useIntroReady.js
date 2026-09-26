import { useEffect, useState } from "react";
import { isIntroReady, onIntroReady } from "../lib/intro.js";

/** true, когда лоадер открыл сцену - можно запускать интро-анимации. */
export default function useIntroReady() {
  const [ready, setReady] = useState(isIntroReady);
  useEffect(() => onIntroReady(() => setReady(true)), []);
  return ready;
}
